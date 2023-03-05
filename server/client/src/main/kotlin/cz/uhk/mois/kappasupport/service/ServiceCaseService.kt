package cz.uhk.mois.kappasupport.service

import cz.uhk.mois.kappasupport.controller.model.CreateServiceCaseDto
import cz.uhk.mois.kappasupport.domain.ServiceCase
import cz.uhk.mois.kappasupport.mapper.DomainMapper
import cz.uhk.mois.kappasupport.repository.ServiceCaseRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class ServiceCaseService(
    private val serviceCaseRepository: ServiceCaseRepository,
    private val mapper: DomainMapper
) {

    fun getALl(): Flux<ServiceCase> = serviceCaseRepository.findAll()


}