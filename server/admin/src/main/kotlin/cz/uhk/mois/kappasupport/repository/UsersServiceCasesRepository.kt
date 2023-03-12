package cz.uhk.mois.kappasupport.repository

import cz.uhk.mois.kappasupport.domain.UsersServiceCases
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux

interface UsersServiceCasesRepository : ReactiveCrudRepository<UsersServiceCases, Long> {

    fun findAllByServiceCaseId(serviceCaseId: Long): Flux<UsersServiceCases>


    fun findAllByUserId(userId: Long): Flux<UsersServiceCases>
}