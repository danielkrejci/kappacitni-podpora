package cz.uhk.mois.kappasupport.repository

import cz.uhk.mois.kappasupport.domain.UsersServiceCases
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface UsersServiceCasesRepository : ReactiveCrudRepository<UsersServiceCases, Long> {

    fun findAllByServiceCaseId(serviceCaseId: Long): Flux<UsersServiceCases>

    fun deleteByUserIdAndServiceCaseId(userId: Long, serviceCaseId: Long): Mono<Void>
    fun findAllByUserId(userId: Long): Flux<UsersServiceCases>

    fun findAllByUserIdIn(userIds: List<Long>): Flux<UsersServiceCases>
}