package cz.uhk.mois.kappasupport.service

import cz.uhk.mois.kappasupport.controller.model.*
import cz.uhk.mois.kappasupport.domain.Message
import cz.uhk.mois.kappasupport.domain.ServiceCase
import cz.uhk.mois.kappasupport.exception.GenericException
import cz.uhk.mois.kappasupport.exception.ServiceCaseNotFoundException
import cz.uhk.mois.kappasupport.exception.UserIsNotOperatorException
import cz.uhk.mois.kappasupport.exception.UserNotFoundException
import cz.uhk.mois.kappasupport.mapper.DomainMapper
import cz.uhk.mois.kappasupport.repository.ServiceCaseRepository
import cz.uhk.mois.kappasupport.util.*
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import kotlin.math.ceil
import kotlin.math.min

@Service
class ServiceCaseService(
    private val serviceCaseRepository: ServiceCaseRepository,
    private val usersServiceCasesService: UsersServiceCasesService,
    private val addressService: AddressService,
    private val userService: UserService,
    private val mapper: DomainMapper,
    private val deviceService: DeviceService,
    private val messageService: MessageService,
    private val jwtService: JwtService,
    private val logService: LogService
) {
    companion object {
        private const val format = "yyyy-MM-dd HH:mm:ss"
        private val formatter: DateTimeFormatter = DateTimeFormatter.ofPattern(format).withZone(ZoneId.systemDefault())
        var EMPTY_RESULT = Mono.just(
            PaginatedObject(
                hasNext = false,
                hasPrev = false,
                data = emptyList(),
                page = 1,
                totalPages = 1
            )
        )
    }

    fun getLogsForServiceCase(scId: Long): Flux<ServiceCaseLogResponse> {
        return logService.getLogsForServiceCase(scId)
            .flatMap { serviceCaseLog ->
                userService.findById(serviceCaseLog.userId!!)
                    .flatMap { user ->
                        userToUserLoser(mapper.toDto(user))
                            .flatMap { userLoser ->
                                Mono.just(
                                    ServiceCaseLogResponse(
                                        serviceCaseLog.id!!,
                                        serviceCaseLog.date,
                                        userLoser,
                                        serviceCaseLog.action
                                    )
                                )
                            }
                    }
            }
            .sort(compareBy<ServiceCaseLogResponse> { it.date }.reversed())
    }

    fun findALlByIdIn(ids: List<Long>): Flux<ServiceCase> {
        return serviceCaseRepository.findAllByIdIn(ids)
    }

    fun sendMessage(message: SendMessage, id: String, token: String): Mono<Boolean> {
        return serviceCaseRepository.findById(id.toLong())
            .flatMap { serviceCase ->
                jwtService.getUserFromToken(token)
                    .flatMap { operator ->
                        usersServiceCasesService.getOperatorsFromServiceCase(serviceCase.id!!)
                            .collectList()
                            .flatMap { operatorsInServiceCase ->
                                if (operatorsInServiceCase.contains(operator)) {
                                    if (message.message.isEmpty() || message.message.isBlank()) {
                                        Mono.error(GenericException("Message is empty"))
                                    } else {
                                        val messageToSave = MessageDto(
                                            null,
                                            operator.id!!,
                                            serviceCase.id!!,
                                            1L,
                                            message.message,
                                            Instant.now()
                                        )

                                        val allMessagesForUser =
                                            messageService.findMessagesByUserIdAndServiceCaseIdAndDateBeforeNow(
                                                listOf(serviceCase.userId!!),
                                                id.toLong()
                                            )

                                        bulkUpdateMessages(
                                            id.toLong(),
                                            allMessagesForUser,
                                            3,
                                            messageToSave,
                                            operator.id!!
                                        ).flatMap {
                                            updateServiceCaseState(id.toLong(), 3L, operator.id!!).flatMap {
                                                Mono.just(true)
                                            }
                                        }
                                    }
                                } else {
                                    Mono.error(GenericException("User ${operator.name} ${operator.surname} does not have aassigned service case with id ${serviceCase.id}"))
                                }
                            }
                    }
            }
            .switchIfEmpty(Mono.error(ServiceCaseNotFoundException("Service case with id $id not found")))
    }


    private fun bulkUpdateMessages(
        serviceCaseId: Long,
        allMessagesForUser: Flux<Message>,
        serviceCaseState: Long,
        messageDto: MessageDto,
        operatorId: Long
    ): Mono<Boolean> {
        return updateServiceCaseState(serviceCaseId, serviceCaseState, operatorId)
            .flatMapMany { serviceCase ->
                allMessagesForUser
                    .flatMap { message ->
                        messageService.updateMessageState(message.id!!, 2L)
                    }
            }.collectList()
            .flatMap {
                var message = mapper.fromDto(messageDto)
                messageService.saveMessage(message).flatMap {
                    logService.saveLog(
                        operatorId,
                        serviceCaseId,
                        "Vytvořena zpráva operátorem"
                    ).flatMap {
                        Mono.just(true)
                    }
                }
            }
    }

    fun getAllServiceCases(
        operatorId: Long?,
        clientId: Long?,
        state: Long?,
        sort: String,
        page: Int
    ): Mono<PaginatedObject> {
        val pageSize = 10
        val offset = (page - 1) * pageSize

        val serviceCasesMono = getServiceCases(operatorId, clientId, state)

        return serviceCasesMono.collectList()
            .flatMap { serviceCases ->
                val totalPages = ceil(serviceCases.size.toDouble() / pageSize).toInt()
                if (page > totalPages || page <= 0) {
                    return@flatMap EMPTY_RESULT.flatMap {
                        it.page = page
                        it.totalPages = if (totalPages == 0) 1 else totalPages
                        Mono.just(it)
                    }
                }

                var sorted = if (sort == "date-desc") {
                    serviceCases.sortedBy { it.dateBegin }.reversed()
                } else {
                    serviceCases.sortedBy { it.dateBegin }
                }

                Flux.fromIterable(sorted.subList(offset, min(offset + pageSize, serviceCases.size)))
                    .flatMap { serviceCase ->
                        usersServiceCasesService.getOperatorsFromServiceCase(serviceCase.id!!)
                            .collectList()
                            .flatMap {
                                Mono.just(EnhancedServiceCaseDto(serviceCase, it as List<UserDto>))
                            }
                    }
                    .collectList()
                    .flatMap { data ->
                        convertToServiceCaseData(data).collectList().flatMap { convertedData ->
                            Mono.just(
                                PaginatedObject(
                                    hasNext = page < totalPages,
                                    hasPrev = page > 1,
                                    data = sortData(convertedData, sort == "date-desc").distinctBy { it.id },
                                    page = page,
                                    totalPages = totalPages
                                )
                            )

                        }
                    }
            }.switchIfEmpty(EMPTY_RESULT)
    }

    private fun getServiceCases(operatorId: Long?, clientId: Long?, state: Long?): Flux<ServiceCase> {
        return if (operatorId != null && state != null && clientId != null) {
            findAllByOperatorIdAndClientId(operatorId, clientId)
                .filter { it.stateId == state }
        } else if (operatorId != null && clientId != null) {
            findAllByOperatorIdAndClientId(operatorId, clientId)
        } else if (state != null && clientId != null) {
            serviceCaseRepository.findAllByUserId(clientId)
                .filter { it.stateId == state }
        } else if (operatorId != null && state != null) {
            findAllByOperatorId(operatorId)
                .filter { it.stateId == state }
        } else if (operatorId != null) {
            findAllByOperatorId(operatorId)
        } else if (state != null) {
            serviceCaseRepository.findAll()
                .filter { it.stateId == state }
        } else if (clientId != null) {
            serviceCaseRepository.findAllByUserId(clientId)
        } else {
            serviceCaseRepository.findAll()
        }
    }

    private fun findAllByOperatorIdAndClientId(operatorId: Long, clientId: Long): Flux<ServiceCase> {
        return usersServiceCasesService.findAllByOperatorIdAndClientId(operatorId, clientId).flatMap {
            serviceCaseRepository.findById(it.serviceCaseId)
        }
    }

    private fun findAllByOperatorId(operatorId: Long): Flux<ServiceCase> {
        return userService.findByUserId(operatorId).flatMapMany {
            if (!it.isOperator) {
                Flux.empty()
            } else {
                usersServiceCasesService.getServiceCasesForOperatorId(operatorId)
                    .flatMap { serviceCaseRepository.findById(it) }
            }
        }
    }

    fun getServiceCasesForOperator(id: Long): Flux<ServiceCaseDto> {
        return isOperator(id).flatMapMany {
            if (!it) throw UserIsNotOperatorException("User with $id is not operator")
            usersServiceCasesService.getServiceCasesForOperatorId(id)
                .flatMap { id ->
                    serviceCaseRepository.findById(id)
                        .map { mapper.toDto(it) }
                }
        }
    }

    fun getServiceCaseDetail(id: String): Mono<Map<String, Any>> {
        val map = HashMap<String, Any>()
        //TODO validation for id.toLong
        return serviceCaseRepository.findById(id.toLong())
            .switchIfEmpty(Mono.error(ServiceCaseNotFoundException("Service case with $id not found")))
            .flatMap { serviceCase ->

                map["serviceCase"] = mapOf(
                    Pair("id", serviceCase.id),
                    Pair("stateId", serviceCase.stateId),
                    Pair("caseTypeId", serviceCase.caseTypeId),
                    Pair("dateBegin", formatter.format(serviceCase.dateBegin)),
                    Pair("dateEnd", serviceCase.dateEnd?.let { formatter.format(serviceCase.dateEnd) }),
                    Pair("hash", serviceCase.hash)
                )

                val user = userService.findById(serviceCase.userId!!).map { mapper.toDto(it) }
                    .flatMap { userToUserLoser(it) }
                val operators =
                    usersServiceCasesService.findAllByServiceCaseId(serviceCase.id!!)
                        .collectList()
                        .flatMap { ucServices ->
                            var sorted = ucServices.sortedWith(compareBy { it.id!! }).map { it.userId }
                            userService.findAllByIdIn(sorted)
                                .filter { it.isOperator }
                                .map { mapper.toDto(it) }
                                .flatMap { userToUserLoser(it) }
                                .collectList()
                        }
                val device = deviceService.findByDeviceId(serviceCase.deviceId!!)
                val messages = messageService.findAllMessagesByServiceCaseId(serviceCase.id!!)
                    .flatMap { message ->
                        userService.findById(message.userId)
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

    private fun isOperator(id: Long): Mono<Boolean> {
        return userService.findByUserId(id)
            .switchIfEmpty(Mono.error(UserNotFoundException("User with $id does not exists")))
            .flatMap {
                Mono.just(it.isOperator)
            }
    }

    private fun getMessageTime(das: CharSequence): Instant {
        val formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")
        val localDateTime = LocalDateTime.parse(das as CharSequence?, formatter)
        val zonedDateTime = ZonedDateTime.of(localDateTime, ZoneId.systemDefault())
        return zonedDateTime.toInstant()
    }

    private fun userToUserLoser(user: UserDto): Mono<UserLoser> {
        if (user.addressId == null) {
            return Mono.just(mapper.toUserLoser(user))
        }

        return addressService.findById(user.addressId!!)
            .map { address ->
                mapper.toUserLoser(user, mapper.toDto(address))
            }
    }

    fun sortData(cases: List<ServiceCaseData>, ascending: Boolean): List<ServiceCaseData> {
        val sortOrder = if (!ascending) 1 else -1
        val sortedCases = cases.sortedWith(compareBy { it.dateBegin })
        return sortedCases.sortedWith(compareBy { it.dateBegin!!.toEpochMilli() * sortOrder })
    }

    fun convertToServiceCaseData(cases: List<EnhancedServiceCaseDto>): Flux<ServiceCaseData> {
        return Flux.fromIterable(cases).flatMap {
            val id = it.serviceCase.id!!
            val dateBegin = it.serviceCase.dateBegin
            val dateEnd = it.serviceCase.dateEnd
            val clientMono = userService.findByUserId(it.serviceCase.userId!!)
                .switchIfEmpty(Mono.error(UserNotFoundException("User with serviceCaseId: ${it.serviceCase.userId} not found")))
            val messageMono = messageService.findFirstFromClient(it.serviceCase.id!!)
            val messageCountMono = messageService.getMessagesCount(it.serviceCase.userId!!, it.serviceCase.id!!)
            val stateId = it.serviceCase.stateId
            val operators = it.operators.map { "${it.name} ${it.surname}" }
            Mono.zip(clientMono, messageMono, messageCountMono).flatMap {
                Mono.just(
                    ServiceCaseData(
                        id,
                        dateBegin,
                        dateEnd,
                        "${it.t1.name} ${it.t1.surname}",
                        it.t2.message,
                        it.t3,
                        stateId,
                        operators
                    )
                )
            }
        }
    }

    fun changeCategory(id: String, category: ChangeCategory, token: String): Mono<Boolean> {
        return jwtService.getUserFromToken(token).flatMap { user ->
            getServiceCaseTypeById(category.categoryId)
                .flatMap {
                    updateServiceCaseCategory(id.toLong(), it.id)
                        .flatMap {
                            if (getCategoryMessage(it.stateId) == getCategoryMessage(category.categoryId)) {
                                Mono.just(true)
                            } else {
                                val action =
                                    "Kategorie změněna z ${getCategoryMessage(it.stateId)} na ${
                                        getCategoryMessage(
                                            category.categoryId
                                        )
                                    }"
                                logService.saveLog(user.id!!, id.toLong(), action).flatMap {
                                    Mono.just(true)
                                }
                            }
                        }
                }
        }
    }

    fun changeState(id: String, state: ChangeState, token: String): Mono<Boolean> {
        return jwtService.getUserFromToken(token).flatMap { user ->
            getServiceCaseStateById(state.stateId.toLong())
                .flatMap {
                    updateServiceCaseState(id.toLong(), it.id, user.id!!)
                        .flatMap {
                            if (state.stateId.toLong() == 4L) {
                                updateServiceCaseDateEnd(id.toLong(), Instant.now()).flatMap {
                                    Mono.just(true)
                                }
                            } else {
                                updateServiceCaseDateEnd(id.toLong(), null).flatMap {
                                    Mono.just(true)
                                }
                            }
                        }
                }
        }
    }

    private fun updateServiceCaseCategory(serviceCaseId: Long, categoryId: Long): Mono<ServiceCase> {
        return serviceCaseRepository.findById(serviceCaseId)
            .flatMap {
                it.caseTypeId = categoryId
                serviceCaseRepository.save(it)
            }
    }

    private fun updateServiceCaseState(serviceCaseId: Long, stateId: Long, operatorId: Long): Mono<ServiceCase> {
        return serviceCaseRepository.findById(serviceCaseId)
            .flatMap {
                if (getStateMessage(it.stateId) == getStateMessage(stateId)) {
                    Mono.just(it)
                } else {
                    val action = "Změněn stav z ${getStateMessage(it.stateId)} na ${getStateMessage(stateId)}"
                    it.stateId = stateId
                    serviceCaseRepository.save(it).flatMap { savedSc ->
                        logService.saveLog(operatorId, serviceCaseId, action).flatMap {
                            Mono.just(savedSc)
                        }
                    }
                }
            }
    }

    private fun getStateMessage(id: Long): String {
        return StateType.values().filter { it.id == id }.map { it.representation }.first()
    }

    private fun getCategoryMessage(id: Long): String {
        return ServiceCaseType.values().filter { it.id == id }.map { it.representation }.first()
    }

    fun updateServiceCaseDateEnd(scId: Long, dateEnd: Instant?): Mono<ServiceCase> {
        return serviceCaseRepository.findById(scId).flatMap {
            it.dateEnd = dateEnd
            serviceCaseRepository.save(it)
        }
    }

    fun assignOperator(serviceCaseId: String, assignOperator: AssignUser, token: String): Mono<Boolean> {
        var operatorId = assignOperator.userId.toLong()
        return jwtService.getUserFromToken(token).flatMap { user ->
            userService.findByUserId(operatorId)
                .flatMap { foundedOperator ->
                    usersServiceCasesService.getServiceCasesForOperatorId(operatorId)
                        .collectList()
                        .flatMap { currentlyAssignedCases ->
                            if (currentlyAssignedCases.contains(serviceCaseId.toLong())) {
                                Mono.error(GenericException("Operator with id: $operatorId already have this service case"))
                            } else {
                                var dt = UsersServiceCasesDto(
                                    operatorId,
                                    serviceCaseId.toLong()
                                )
                                usersServiceCasesService.save(dt)
                                    .flatMap {
                                        logService.saveLog(
                                            user.id!!,
                                            serviceCaseId.toLong(),
                                            "Přiřazen operátor ${foundedOperator.name} ${foundedOperator.surname}"
                                        ).flatMap {
                                            Mono.just(true)
                                        }
                                    }
                            }
                        }
                }.switchIfEmpty(Mono.error(UserNotFoundException("User with id ${assignOperator.userId} not found")))
        }
    }

    fun removeOperatorFromSc(serviceCaseId: String, assignOperator: AssignUser, token: String): Mono<Boolean> {
        val operatorId = assignOperator.userId.toLong()
        return jwtService.getUserFromToken(token).flatMap { user ->
            userService.findByUserId(operatorId)
                .flatMap { foundedOperator ->
                    usersServiceCasesService.getServiceCasesForOperatorId(operatorId)
                        .collectList()
                        .flatMap { serviceCasesForOperator ->
                            if (serviceCasesForOperator.contains(serviceCaseId.toLong())) {
                                usersServiceCasesService.findAllByServiceCaseId(serviceCaseId.toLong())
                                    .collectList()
                                    .flatMap { allUsersForServiceCase ->
                                        if (allUsersForServiceCase.size <= 2) {
                                            Mono.error(GenericException("Cannot delete operator. At least one operator has to have this service case"))
                                        } else {
                                            usersServiceCasesService.delete(operatorId, serviceCaseId.toLong())
                                                .flatMap {
                                                    logService.saveLog(
                                                        user.id!!,
                                                        serviceCaseId.toLong(),
                                                        "Smazán operátor ${foundedOperator.name} ${foundedOperator.surname}"
                                                    ).flatMap {
                                                        Mono.just(true)
                                                    }
                                                }
                                        }
                                    }
                            } else {
                                Mono.error(GenericException("Operator with id $operatorId doees not have assigned service case with id $serviceCaseId"))
                            }

                        }
                }
        }
    }


    fun getServiceCaseCount(): Mono<Long> {
        return serviceCaseRepository.count()
    }

    fun getAllActiveServiceCases(): Mono<Long> {
        return serviceCaseRepository.countAllByStateIdIn(listOf(1L, 2L, 3L))
    }

    fun getAllClosedServiceCases(): Mono<Long> {
        return serviceCaseRepository.countAllByStateId(4L)
    }

    data class ServiceCaseData(
        var id: Long,
        var dateBegin: Instant?,
        var dateEnd: Instant?,
        var client: String,
        var message: String,
        var newMessagesCount: Long,
        var stateId: Long,
        var operators: List<String>
    )

    data class EnhancedServiceCaseDto(
        var serviceCase: ServiceCase,
        var operators: List<UserDto>
    )

    data class PaginatedObject(
        var hasNext: Boolean,
        var hasPrev: Boolean,
        var data: List<ServiceCaseData>,
        var page: Int,
        var totalPages: Int
    )
}