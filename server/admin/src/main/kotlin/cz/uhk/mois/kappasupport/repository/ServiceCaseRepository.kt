package cz.uhk.mois.kappasupport.repository

import cz.uhk.mois.kappasupport.domain.ServiceCase
import org.springframework.data.repository.reactive.ReactiveCrudRepository

interface ServiceCaseRepository : ReactiveCrudRepository<ServiceCase, Long> {
}