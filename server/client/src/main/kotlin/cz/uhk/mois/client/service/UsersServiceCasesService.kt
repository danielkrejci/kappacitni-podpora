package cz.uhk.mois.client.service

import cz.uhk.mois.client.controller.model.UsersServiceCasesDto
import cz.uhk.mois.client.domain.UsersServiceCases
import cz.uhk.mois.client.mapper.DomainMapper
import cz.uhk.mois.client.repository.UsersServiceCasesRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service

class UsersServiceCasesService(
    private val repository: UsersServiceCasesRepository,

    private val mapper: DomainMapper
) {

    fun save(us: UsersServiceCasesDto): Mono<UsersServiceCases> {
        var usc: UsersServiceCases = mapper.fromDto(us)
        return repository.save(usc)
    }

    fun findAllByServiceCaseId(id: Long): Flux<UsersServiceCasesDto> {
        return repository.findAllByServiceCaseId(id).map {
            mapper.toDto(it)
        }
    }

    fun getOperatorScCount(userId: Long): Mono<Long> {
        return repository.findUserIdWithFewestServiceCases(userId)
    }


}