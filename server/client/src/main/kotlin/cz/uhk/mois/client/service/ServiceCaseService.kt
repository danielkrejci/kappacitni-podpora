package cz.uhk.mois.client.service

import cz.uhk.mois.client.controller.model.*
import cz.uhk.mois.client.domain.ServiceCase
import cz.uhk.mois.client.exception.ServiceCaseNotFoundException
import cz.uhk.mois.client.exception.ValidationFailedException
import cz.uhk.mois.client.mapper.DomainMapper
import cz.uhk.mois.client.repository.AddressRepository
import cz.uhk.mois.client.repository.ServiceCaseRepository
import cz.uhk.mois.client.repository.UserRepository
import mu.KotlinLogging
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty
import java.time.Instant

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

    private val logger = KotlinLogging.logger {}


    fun getServiceCaseDetail(id: String, hash: String): Mono<Map<String, Any>> {
        var map = HashMap<String, Any>()
        //TODO validation for id.toLong
        return serviceCaseRepository.findById(id.toLong())
            .switchIfEmpty(Mono.error(ServiceCaseNotFoundException("Service case with $id not found")))
            .flatMap { serviceCase ->
                if (serviceCase.hash == hash) {
                    map["serviceCase"] = mapOf(
                        Pair("id", serviceCase.id),
                        Pair("stateTypeId", serviceCase.stateType),
                        Pair("caseTypeId", serviceCase.caseType),
                        Pair("dateBegin", serviceCase.dateBegin),
                        Pair("dateEnd", serviceCase.dateEnd),
                    )
                } else {
                    return@flatMap Mono.error(ValidationFailedException("Hash does not match"))
                }

                var user = userRepository.findById(serviceCase.userId!!).map { mapper.toDto(it) }
                    .flatMap { userToUserLoser(it) }
                var operators = usersServiceCasesService.findAllByServiceCaseId(serviceCase.id!!)
                    .map { it.userId }
                    .collectList()
                    .flatMap { ids ->
                        userRepository.findAllByIdIn(ids)
                            .filter { it.operator }
                            .map { mapper.toDto(it) }
                            .flatMap { userToUserLoser(it) }
                            .collectList()
                    }
                var device = deviceService.findByDeviceId(serviceCase.deviceId!!)
                var messages = messageService.findAllMessagesByServiceCaseId(serviceCase.id!!)
                    .flatMap { message ->
                        userRepository.findById(message.userId)
                            .flatMap { user ->
                                Mono.just(Pair(userToUserLoser(mapper.toDto(user)), Mono.just(message)))
                            }
                            .flatMap {
                                Mono.zip(it.first, it.second)
                                    .flatMap {
                                        var user = it.t1
                                        var msg = it.t2
                                        var map = mapOf(
                                            Pair("author", user),
                                            Pair("id", msg.id),
                                            Pair("date", msg.date),
                                            Pair("message", msg.message),
                                            Pair("state", msg.stateType),
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
                        val address = mapper.fromServiceCaseToAddressDto(serviceCase)
                        addressRepository.save(address)
                            .flatMap { savedAddress ->
                                val newUser = UserDto(
                                    null,
                                    savedAddress.id,
                                    serviceCase.name,
                                    serviceCase.surname,
                                    serviceCase.phone,
                                    serviceCase.email,
                                    false
                                )
                                userRepository.save(mapper.fromDto(newUser))
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
            sc.deviceId = it.id
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
        return addressRepository.findById(user.address!!).map { address ->
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