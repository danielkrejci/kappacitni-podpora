package cz.uhk.mois.client.repository

import cz.uhk.mois.client.domain.ServiceCase
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Mono

interface ServiceCaseRepository : ReactiveCrudRepository<ServiceCase, Long> {
}