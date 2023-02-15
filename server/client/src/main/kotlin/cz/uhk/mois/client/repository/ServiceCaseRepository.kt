package cz.uhk.mois.client.repository

import cz.uhk.mois.client.domain.ServiceCase
import org.springframework.data.repository.reactive.ReactiveCrudRepository

interface ServiceCaseRepository : ReactiveCrudRepository<ServiceCase, Long>