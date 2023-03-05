package cz.uhk.mois.kappasupport.controller

import cz.uhk.mois.kappasupport.controller.model.CreateServiceCaseDto
import cz.uhk.mois.kappasupport.domain.ServiceCase
import cz.uhk.mois.kappasupport.service.ServiceCaseService
import io.swagger.v3.oas.annotations.Operation
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono


@RestController
@RequestMapping("/service-cases")
class ServiceCaseController(
    private val serviceCaseService: ServiceCaseService
) {

    @GetMapping
    fun test(): Flux<ServiceCase> {
        return serviceCaseService.getALl()
    }

}