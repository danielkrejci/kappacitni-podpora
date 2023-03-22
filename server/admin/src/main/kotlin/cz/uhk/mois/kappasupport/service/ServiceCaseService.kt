package cz.uhk.mois.kappasupport.service

import cz.uhk.mois.kappasupport.controller.model.ServiceCaseDto
import cz.uhk.mois.kappasupport.controller.model.UserDto
import cz.uhk.mois.kappasupport.controller.model.UsersServiceCasesDto
import cz.uhk.mois.kappasupport.domain.ServiceCase
import cz.uhk.mois.kappasupport.domain.UsersServiceCases
import cz.uhk.mois.kappasupport.exception.GenericException
import cz.uhk.mois.kappasupport.exception.ServiceCaseNotFoundException
import cz.uhk.mois.kappasupport.exception.UserIsNotOperatorException
import cz.uhk.mois.kappasupport.exception.UserNotFoundException
import cz.uhk.mois.kappasupport.mapper.DomainMapper
import cz.uhk.mois.kappasupport.repository.ServiceCaseRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Instant
import kotlin.math.ceil
import kotlin.math.min

@Service
class ServiceCaseService(
    private val serviceCaseRepository: ServiceCaseRepository,
    private val usersServiceCasesService: UsersServiceCasesService,
    private val userService: UserService,
    private val messageService: MessageService,
    private val mapper: DomainMapper,
) {
    fun getAllServiceCases(
        operatorId: Long?,
        state: Long?,
        sort: String,
        page: Int
    ): Mono<PaginatedObject> {
        val pageSize = 10
        val offset = (page - 1) * pageSize

        val serviceCasesMono = if (operatorId != null && state != null) {
            findAllByOperatorId(operatorId)
                .filter { it.stateId == state }
        } else if (operatorId != null) {
            findAllByOperatorId(operatorId)
        } else if (state != null) {
            serviceCaseRepository.findAll()
                .filter { it.stateId == state }
        } else {
            serviceCaseRepository.findAll()
        }

        return serviceCasesMono.collectList()
            .flatMap { serviceCases ->
                val totalPages = ceil(serviceCases.size.toDouble() / pageSize).toInt()

                Flux.fromIterable(serviceCases.subList(offset, min(offset + pageSize, serviceCases.size)))
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
                            val sorted = sortData(convertedData, sort == "date-desc")
                            Mono.just(
                                PaginatedObject(
                                    hasNext = page < totalPages,
                                    hasPrev = page > 1,
                                    data = sorted,
                                    page = page,
                                    totalPages = totalPages
                                )
                            )

                        }
                    }
            }
    }

    private fun findAllByOperatorId(operatorId: Long): Flux<ServiceCase> {
        return userService.findByUserId(operatorId).flatMapMany {
            if (!it.isOperator) {
                Mono.error(GenericException("User with $operatorId is not operator"))
            } else {
                usersServiceCasesService.getServiceCasesForOperator(operatorId)
                    .flatMap { serviceCaseRepository.findById(it) }
                    .switchIfEmpty(Mono.error(GenericException("This operator does not have any service cases")))
            }
        }.switchIfEmpty(Mono.error(UserNotFoundException("User with is $operatorId not found")))
    }

    fun getServiceCasesForOperator(id: Long): Flux<ServiceCaseDto> {
        return isOperator(id).flatMapMany {
            if (!it) throw UserIsNotOperatorException("User with $id is not operator")
            usersServiceCasesService.getServiceCasesForOperator(id)
                .flatMap { id ->
                    serviceCaseRepository.findById(id)
                        .map { mapper.toDto(it) }
                }
        }
    }

    fun assignOperatorToServiceCase(operatorId: Long, serviceCaseId: Long): Mono<UsersServiceCases> {
        return isOperator(operatorId).flatMap {
            if (!it) throw UserIsNotOperatorException("User with $operatorId is not operator")
            serviceCaseRepository.findById(serviceCaseId)
                .switchIfEmpty(Mono.error(ServiceCaseNotFoundException("Service case not found")))
                .flatMap {
                    var usc = UsersServiceCasesDto(operatorId, serviceCaseId)
                    usersServiceCasesService.save(usc)
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

    fun sortData(cases: List<ServiceCaseData>, ascending: Boolean): List<ServiceCaseData> {
        val sortOrder = if (ascending) 1 else -1
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