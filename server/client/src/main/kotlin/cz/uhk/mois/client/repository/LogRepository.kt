package cz.uhk.mois.client.repository

import cz.uhk.mois.client.domain.ServiceCaseLog
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux

interface LogRepository : ReactiveCrudRepository<ServiceCaseLog, Long> {

    fun findAllByServiceCaseId(scId:Long) : Flux<ServiceCaseLog>


}