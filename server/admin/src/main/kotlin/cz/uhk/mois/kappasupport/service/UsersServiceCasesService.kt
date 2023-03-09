package cz.uhk.mois.kappasupport.service

import cz.uhk.mois.kappasupport.controller.model.UserDto
import cz.uhk.mois.kappasupport.mapper.DomainMapper
import cz.uhk.mois.kappasupport.repository.UsersServiceCasesRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux

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
}