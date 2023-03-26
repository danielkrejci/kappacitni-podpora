package cz.uhk.mois.kappasupport.repository

import cz.uhk.mois.kappasupport.domain.ServiceCase
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface ServiceCaseRepository : ReactiveCrudRepository<ServiceCase, Long> {

    fun findAllByUserId(clientId: Long): Flux<ServiceCase>

    fun countAllByStateId(stateId: Long): Mono<Long>

    fun findAllByIdIn(ids: List<Long>): Flux<ServiceCase>

}