package cz.uhk.mois.kappasupport.repository

import cz.uhk.mois.kappasupport.domain.ServiceCaseLog
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux

interface LogRepository : ReactiveCrudRepository<ServiceCaseLog, Long> {

    fun findAllByServiceCaseId(scId: Long): Flux<ServiceCaseLog>


}