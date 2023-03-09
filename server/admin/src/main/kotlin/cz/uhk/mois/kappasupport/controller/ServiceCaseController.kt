package cz.uhk.mois.kappasupport.controller

import cz.uhk.mois.kappasupport.service.ServiceCaseService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Flux

@RestController
@RequestMapping("/service-cases")
class ServiceCaseController(private val serviceCaseService: ServiceCaseService) {

    @GetMapping
    fun getAllServiceCases(): ResponseEntity<Flux<ServiceCaseService.EnhancedServiceCaseDto>> {
        return ResponseEntity.ok(serviceCaseService.getAllServiceCases())
    }
}