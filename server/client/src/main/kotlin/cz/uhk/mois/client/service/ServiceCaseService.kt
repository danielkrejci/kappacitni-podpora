package cz.uhk.mois.client.service

import cz.uhk.mois.client.controller.model.ServiceCaseDto
import cz.uhk.mois.client.domain.ServiceCase
import cz.uhk.mois.client.mapper.DomainMapper
import cz.uhk.mois.client.repository.ServiceCaseRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class ServiceCaseService(
    private val serviceCaseRepository: ServiceCaseRepository,
    private val mapper: DomainMapper
) {

    fun save(serviceCase: ServiceCaseDto): Mono<ServiceCase> {
        val sc = mapper.fromDto(serviceCase)
        return serviceCaseRepository.save(sc)
    }
}