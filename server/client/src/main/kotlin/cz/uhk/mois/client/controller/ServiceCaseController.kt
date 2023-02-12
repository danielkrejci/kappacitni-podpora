package cz.uhk.mois.client.controller

import cz.uhk.mois.client.controller.model.ServiceCaseDto
import cz.uhk.mois.client.controller.model.ServiceCaseType
import cz.uhk.mois.client.domain.ServiceCase
import cz.uhk.mois.client.service.ServiceCaseService
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/service-cases")
class ServiceCaseController(private val serviceCaseService: ServiceCaseService) {

    @GetMapping("types")
    fun getServiceTypes() = ServiceCaseType.values().map { it.representation }

    @PostMapping("/save")
    fun saveServiceCase(@RequestBody serviceCase: ServiceCaseDto): Mono<ServiceCase> {


        return serviceCaseService.save(serviceCase)
    }


}