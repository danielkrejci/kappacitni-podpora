package cz.uhk.mois.kappasupport.service

import cz.uhk.mois.kappasupport.controller.model.UserDto
import cz.uhk.mois.kappasupport.controller.model.UsersServiceCasesDto
import cz.uhk.mois.kappasupport.domain.UsersServiceCases
import cz.uhk.mois.kappasupport.mapper.DomainMapper
import cz.uhk.mois.kappasupport.repository.UsersServiceCasesRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class UsersServiceCasesService(
    private val repository: UsersServiceCasesRepository,
    private val userService: UserService,
    private val mapper: DomainMapper
) {
    fun getOperatorIdsFromServiceCase(serviceCaseId: Long): Flux<UserDto> {
        return repository.findAllByServiceCaseId(serviceCaseId)
            .map { mapper.toDto(it) }.map { it.userId }.collectList()
            .flatMapMany {
                Flux.from(userService.findALlByIds(it).filter { it.operator })
            }
    }

    fun getServiceCasesForOperator(operatorId: Long): Flux<Long> {
        return repository.findAllByUserId(operatorId).map { it.serviceCaseId }
    }

    fun save(usc: UsersServiceCasesDto): Mono<UsersServiceCases> {
        return repository.save(mapper.fromDto(usc))
    }

}