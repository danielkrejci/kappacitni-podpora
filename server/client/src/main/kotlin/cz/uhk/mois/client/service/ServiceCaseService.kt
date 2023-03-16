package cz.uhk.mois.client.service

import cz.uhk.mois.client.controller.model.*
import cz.uhk.mois.client.domain.ServiceCase
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
import java.time.ZoneId
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
        private const val format =  "yyyy-MM-dd HH:mm:ss"
        private val formatter: DateTimeFormatter = DateTimeFormatter.ofPattern(format).withZone(ZoneId.systemDefault())
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
                        Pair("dateBegin",formatter.format(serviceCase.dateBegin)),
                        Pair("dateEnd", formatter.format(serviceCase.dateBegin)),
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
                    map["messages"] = data.t4
                    Mono.just(map)
                }
            }
    }

    fun createServiceCase(serviceCase: CreateServiceCaseDto): Mono<ServiceCase> {
        //TODO při vytvoření SC přiřadit operátorovi, pokud žádný nemá nic tak náhodně, jinak tomu kdo jich má nejméně
        return validationService.validate(serviceCase)
            .flatMap {
                //TODO UPDATE ADRES
                val sc = mapper.fromDto(it)
                sc.dateBegin = Instant.now()
                userRepository.findByEmail(serviceCase.email)
                    .flatMap {
                        it.name = serviceCase.name
                        it.surname = serviceCase.surname
                        it.email = serviceCase.email
                        it.phone = serviceCase.phone
                        userRepository.save(it)
                            .flatMap { user ->
                                sc.userId = user.id!!
                                saveServiceCaseAndMessage(sc, serviceCase.message, serviceCase.serialNumber)
                            }
                    }.switchIfEmpty {
                        // TODO adresa není povinný údaj, když ji nezadám, tak se nesmí vytvořit prázdný záznam v tabulce addresses
                        val address = mapper.fromServiceCaseToAddress(serviceCase)

                        logger.info { address.toString() }

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
                                    true
                                )

                                val user = mapper.fromDto(newUser)

                                logger.info { user.toString() }

                                userRepository.save(user)
                            }
                            .flatMap { user ->
                                sc.userId = user.id!!
                                saveServiceCaseAndMessage(sc, serviceCase.message, serviceCase.serialNumber)

                            }
                    }
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

    private fun generateHash(): String {
        val charPool: List<Char> = ('a'..'z') + ('A'..'Z') + ('0'..'9')
        return (1..128)
            .map { kotlin.random.Random.nextInt(0, charPool.size) }
            .map(charPool::get)
            .joinToString("")
    }

    private fun userToUserLoser(user: UserDto): Mono<UserLoser> {
        return addressRepository.findById(user.addressId!!).map { address ->
            mapper.toUserLoser(user, mapper.toDto(address))
        }
    }
}

data class UserLoser(
    var name: String,
    var surname: String,
    var email: String,
    var phone: String,
    var street: String,
    var houseNumber: String,
    var city: String,
    var postalCode: String,
)