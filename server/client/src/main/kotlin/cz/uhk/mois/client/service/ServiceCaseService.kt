package cz.uhk.mois.client.service

import cz.uhk.mois.client.controller.model.*
import cz.uhk.mois.client.domain.ServiceCase
import cz.uhk.mois.client.exception.AddressNotCompleteException
import cz.uhk.mois.client.exception.ServiceCaseNotFoundException
import cz.uhk.mois.client.exception.ValidationFailedException
import cz.uhk.mois.client.mapper.DomainMapper
import cz.uhk.mois.client.repository.AddressRepository
import cz.uhk.mois.client.repository.ServiceCaseRepository
import cz.uhk.mois.client.repository.UserRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.logging.Logger

@Service
class ServiceCaseService(
    private val serviceCaseRepository: ServiceCaseRepository,
    private val userRepository: UserRepository,
    private val addressRepository: AddressRepository,
    private val mapper: DomainMapper,
    private val validationService: ValidationService,
    private val deviceService: DeviceService,
    private val messageService: MessageService,
    private val usersServiceCasesService: UsersServiceCasesService
) {

    private val logger = Logger.getLogger(this.javaClass.name)

    companion object {
        private const val format = "yyyy-MM-dd HH:mm:ss"
        private val formatter: DateTimeFormatter = DateTimeFormatter.ofPattern(format).withZone(ZoneId.systemDefault())
    }

    fun findServiceCase(id: Long): Mono<ServiceCase> = serviceCaseRepository.findById(id)
        .switchIfEmpty(Mono.error(ServiceCaseNotFoundException("Service case not found")))

    fun getAssignedOperatorsForServiceCase(serviceCaseId: Long): Flux<UserLoser> {
        return usersServiceCasesService.findAllByServiceCaseId(serviceCaseId)
            .map { it.userId }
            .collectList()
            .flatMapMany { ids ->
                userRepository.findAllByIdIn(ids)
                    .filter { it.isOperator }
                    .map { mapper.toDto(it) }
                    .flatMap { userToUserLoser(it) }
            }
    }

    fun getServiceCaseDetail(id: String, hash: String): Mono<Map<String, Any>> {
        val map = HashMap<String, Any>()
        //TODO validation for id.toLong
        return serviceCaseRepository.findById(id.toLong())
            .switchIfEmpty(Mono.error(ServiceCaseNotFoundException("Service case with $id not found")))
            .flatMap { serviceCase ->
                if (serviceCase.hash == hash) {
                    map["serviceCase"] = mapOf(
                        Pair("id", serviceCase.id),
                        Pair("stateId", serviceCase.stateId),
                        Pair("caseTypeId", serviceCase.caseTypeId),
                        Pair("dateBegin", formatter.format(serviceCase.dateBegin)),
                        Pair("dateEnd", serviceCase.dateEnd?.let { formatter.format(serviceCase.dateEnd) }),
                        Pair("hash", serviceCase.hash)
                    )
                } else {
                    return@flatMap Mono.error(ValidationFailedException("Hash does not match"))
                }

                val user = userRepository.findById(serviceCase.userId!!).map { mapper.toDto(it) }
                    .flatMap { userToUserLoser(it) }
                val operators = usersServiceCasesService.findAllByServiceCaseId(serviceCase.id!!)
                    .map { it.userId }
                    .collectList()
                    .flatMap { ids ->
                        userRepository.findAllByIdIn(ids)
                            .filter { it.isOperator }
                            .map { mapper.toDto(it) }
                            .flatMap { userToUserLoser(it) }
                            .collectList()
                    }
                val device = deviceService.findByDeviceId(serviceCase.deviceId!!)
                val messages = messageService.findAllMessagesByServiceCaseId(serviceCase.id!!)
                    .flatMap { message ->
                        userRepository.findById(message.userId)
                            .flatMap { user ->
                                Mono.just(Pair(userToUserLoser(mapper.toDto(user)), Mono.just(message)))
                            }
                            .flatMap {
                                Mono.zip(it.first, it.second)
                                    .flatMap {
                                        val user = it.t1
                                        val msg = it.t2
                                        val map = mapOf(
                                            Pair("author", user),
                                            Pair("id", msg.id),
                                            Pair("date", formatter.format(msg.date)),
                                            Pair("message", msg.message),
                                            Pair("state", msg.stateId),
                                        )
                                        Mono.just(map)
                                    }
                            }
                    }
                    .collectList()

                Mono.zip(user, operators, device, messages).flatMap { data ->
                    map["client"] = data.t1
                    map["operators"] = data.t2
                    map["device"] = data.t3
                    map["messages"] = data.t4.sortedBy { getMessageTime(it["date"] as CharSequence) }
                    Mono.just(map)
                }
            }
    }

    fun createServiceCase(serviceCase: CreateServiceCaseDto): Mono<ServiceCase> {
        return validationService.validateServiceCase(serviceCase)
            .flatMap {
                //TODO UPDATE ADRES
                val sc = mapper.fromDto(it)
                sc.dateBegin = Instant.now()
                userRepository.findByEmail(serviceCase.email)
                    .flatMap { user ->
                        user.name = serviceCase.name
                        user.surname = serviceCase.surname
                        user.email = serviceCase.email
                        user.phone = serviceCase.phone

                        val address = mapper.fromServiceCaseToAddress(serviceCase)
                        if (address.hasIncompleteAttributes()) {
                            return@flatMap Mono.error(AddressNotCompleteException("Address is not complete"))
                        }
                        // TODO good for now, refactor later
                        if (user.addressId == null && !address.isEmpty()) {
                            addressRepository.save(address)
                                .flatMap { savedAddress ->
                                    user.addressId = savedAddress.id
                                    userRepository.save(user)
                                        .flatMap { user ->
                                            sc.userId = user.id!!
                                            saveServiceCaseAndMessage(sc, serviceCase.message, serviceCase.serialNumber)
                                        }
                                }
                        } else
                            if (user.addressId != null && !address.isEmpty()) {
                                addressRepository.findById(user.addressId!!)
                                    .flatMap { addressInDb ->
                                        address.id = addressInDb.id
                                        addressRepository.save(address)
                                            .flatMap {
                                                userRepository.save(user)
                                                    .flatMap { user ->
                                                        sc.userId = user.id!!
                                                        saveServiceCaseAndMessage(
                                                            sc,
                                                            serviceCase.message,
                                                            serviceCase.serialNumber
                                                        )
                                                    }
                                            }
                                    }
                            } else {
                                userRepository.save(user)
                                    .flatMap { user ->
                                        sc.userId = user.id!!
                                        saveServiceCaseAndMessage(sc, serviceCase.message, serviceCase.serialNumber)
                                    }
                            }
                    }.switchIfEmpty {
                        val address = mapper.fromServiceCaseToAddress(serviceCase)
                        if (address.isEmpty()) {
                            val newUser = UserDto(
                                null,
                                null,
                                serviceCase.name,
                                serviceCase.surname,
                                serviceCase.phone,
                                serviceCase.email,
                                false,
                                true,
                                null
                            )
                            val user = mapper.fromDto(newUser)
                            userRepository.save(user)
                        } else {
                            if (address.hasIncompleteAttributes()) {
                                throw AddressNotCompleteException("Address is not complete")
                            } else {
                                addressRepository.save(address)
                                    .flatMap { savedAddress ->
                                        val newUser = UserDto(
                                            null,
                                            savedAddress.id,
                                            serviceCase.name,
                                            serviceCase.surname,
                                            serviceCase.phone,
                                            serviceCase.email,
                                            false,
                                            true,
                                            null
                                        )
                                        val user = mapper.fromDto(newUser)
                                        userRepository.save(user)
                                    }
                            }
                        }
                            .flatMap { user ->
                                sc.userId = user.id!!
                                saveServiceCaseAndMessage(sc, serviceCase.message, serviceCase.serialNumber)

                            }
                    }
            }
    }

    fun updateServiceCaseState(serviceCaseId: Long, stateId: Long): Mono<ServiceCase> {
        return serviceCaseRepository.findById(serviceCaseId)
            .switchIfEmpty(Mono.error(ServiceCaseNotFoundException("Service case with id $serviceCaseId not found")))
            .flatMap {
                if (it.stateId == 4L) {
                    it.dateEnd = null
                }
                it.stateId = stateId
                serviceCaseRepository.save(it)
            }
    }

    private fun getAssignOperatorId(): Mono<Long> {
        return userRepository.findAllByOperator()
            .map { it.id!! }
            .collectList()
            .flatMap { operatorIds ->
                Flux.fromIterable(operatorIds)
                    .flatMap { operatorId ->
                        usersServiceCasesService.getOperatorScCount(operatorId)
                            .flatMap {
                                var pair: Pair<Long, Long> = Pair(operatorId, it)
                                Mono.just(pair)
                            }
                    }
                    .collectList()
                    .flatMap { pairList ->
                        Mono.just(pairList.minBy { it.second }.first)
                    }
            }
    }

    private fun saveServiceCaseAndMessage(sc: ServiceCase, message: String, serialNUmber: String): Mono<ServiceCase> {
        sc.hash = generateHash()
        return deviceService.findBySerialNumber(serialNUmber).flatMap {
            sc.deviceId = it.id!!
            serviceCaseRepository.save(sc)
                .flatMap { savedServiceCase ->
                    logger.info { "Service case saved $savedServiceCase" }
                    val msg =
                        MessageDto(
                            null,
                            sc.userId!!,
                            savedServiceCase.id!!,
                            MessageStateType.DELIVERED.code,
                            message,
                            Instant.now()
                        )

                    logger.info { msg.toString() }

                    messageService.save(msg)
                        .flatMap {
                            val userToSave = UsersServiceCasesDto(savedServiceCase.userId!!, savedServiceCase.id!!)
                            usersServiceCasesService.save(userToSave)
                                .flatMap {
                                    logger.info { "User [${it.userId}] assigned to service case [${it.serviceCaseId}] " }
                                    getAssignOperatorId()
                                        .flatMap { opId ->
                                            val operatorToSave = UsersServiceCasesDto(opId, savedServiceCase.id!!)
                                            usersServiceCasesService.save(operatorToSave)
                                                .flatMap {
                                                    logger.info { "Operator [${it.userId}] assigned to service case [${it.serviceCaseId}] " }
                                                    Mono.just(savedServiceCase)
                                                }
                                        }
                                }
                        }
                }
        }
    }

    private fun getMessageTime(das: CharSequence): Instant {
        val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
        val localDateTime = LocalDateTime.parse(das as CharSequence?, formatter)
        val zonedDateTime = ZonedDateTime.of(localDateTime, ZoneId.systemDefault())
        return zonedDateTime.toInstant()
    }

    private fun generateHash(): String {
        val charPool: List<Char> = ('a'..'z') + ('A'..'Z') + ('0'..'9')
        return (1..128)
            .map { kotlin.random.Random.nextInt(0, charPool.size) }
            .map(charPool::get)
            .joinToString("")
    }

    private fun userToUserLoser(user: UserDto): Mono<UserLoser> {
        if (user.addressId == null) {
            return Mono.just(mapper.toUserLoser(user))
        }

        return addressRepository.findById(user.addressId!!)
            .map { address ->
                mapper.toUserLoser(user, mapper.toDto(address))
            }
    }
}

data class UserLoser(
    var id: Long,
    var name: String,
    var surname: String,
    var email: String,
    var phone: String?,
    var street: String?,
    var houseNumber: String?,
    var city: String?,
    var postalCode: String?,
    var isClient: Boolean,
    var isOperator: Boolean,
    var picture: String?
)