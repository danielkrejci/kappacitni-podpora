package cz.uhk.mois.kappasupport.service

import cz.uhk.mois.kappasupport.controller.model.UserDto
import cz.uhk.mois.kappasupport.controller.model.UsersServiceCasesDto
import cz.uhk.mois.kappasupport.domain.UsersServiceCases
import cz.uhk.mois.kappasupport.mapper.DomainMapper
import cz.uhk.mois.kappasupport.repository.UsersServiceCasesRepository
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class UsersServiceCasesService(
    private val repository: UsersServiceCasesRepository,
    @Lazy private val userService: UserService,
    private val mapper: DomainMapper
) {
    fun getOperatorsFromServiceCase(serviceCaseId: Long): Flux<UserDto> {
        return repository.findAllByServiceCaseId(serviceCaseId)
            .map { mapper.toDto(it) }.map { it.userId }.collectList()
            .flatMapMany {
                Flux.from(userService.findALlByIds(it).filter { it.isOperator })
            }
    }

    fun getServiceCasesForOperatorId(operatorId: Long): Flux<Long> {
        return repository.findAllByUserId(operatorId).map { it.serviceCaseId }
    }

    fun save(usc: UsersServiceCasesDto): Mono<UsersServiceCases> {
        return repository.save(mapper.fromDto(usc))
    }

    fun findAllByServiceCaseId(id: Long): Flux<UsersServiceCasesDto> {
        return repository.findAllByServiceCaseId(id).map {
            mapper.toDto(it)
        }
    }

    fun delete(operatorId: Long, serviceCaseId: Long): Mono<Boolean> {
        return repository.deleteByUserIdAndServiceCaseId(operatorId, serviceCaseId).thenReturn(true)


    }

    fun findAllByOperatorIdAndClientId(operatorId: Long, clientId: Long): Flux<UsersServiceCases> {
        return repository.findAllByUserIdIn(listOf(operatorId, clientId).distinct())
    }

}