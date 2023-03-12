package cz.uhk.mois.kappasupport.service

import cz.uhk.mois.kappasupport.controller.model.ServiceCaseDto
import cz.uhk.mois.kappasupport.controller.model.UserDto
import cz.uhk.mois.kappasupport.controller.model.UsersServiceCasesDto
import cz.uhk.mois.kappasupport.domain.ServiceCase
import cz.uhk.mois.kappasupport.domain.UsersServiceCases
import cz.uhk.mois.kappasupport.exception.ServiceCaseNotFoundException
import cz.uhk.mois.kappasupport.exception.UserIsNotOperatorException
import cz.uhk.mois.kappasupport.exception.UserNotFoundException
import cz.uhk.mois.kappasupport.mapper.DomainMapper
import cz.uhk.mois.kappasupport.repository.ServiceCaseRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class ServiceCaseService(
    private val serviceCaseRepository: ServiceCaseRepository,
    private val usersServiceCasesService: UsersServiceCasesService,
    private val userService: UserService,
    private val mapper: DomainMapper,
) {

    fun getAllServiceCases(): Flux<EnhancedServiceCaseDto> {
        return serviceCaseRepository.findAll()
            .flatMap { serviceCase ->
                usersServiceCasesService.getOperatorIdsFromServiceCase(serviceCase.id!!)
                    .collectList()
                    .map {
                        EnhancedServiceCaseDto(serviceCase, it)
                    }
            }
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
                Mono.just(it.operator)
            }
    }

    data class EnhancedServiceCaseDto(
        var serviceCase: ServiceCase,
        var operators: List<UserDto>
    )
}