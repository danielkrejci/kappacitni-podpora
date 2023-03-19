package cz.uhk.mois.kappasupport.controller

import cz.uhk.mois.kappasupport.controller.model.ServiceCaseDto
import cz.uhk.mois.kappasupport.domain.UsersServiceCases
import cz.uhk.mois.kappasupport.service.ServiceCaseService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@CrossOrigin("*")
@RestController
@RequestMapping("/service-cases")
class ServiceCaseController(private val serviceCaseService: ServiceCaseService) {

    @GetMapping
    fun getAllServiceCases(): ResponseEntity<Flux<ServiceCaseService.EnhancedServiceCaseDto>> {
        return ResponseEntity.ok(serviceCaseService.getAllServiceCases())
    }

    @GetMapping("/operator/{operatorId}")
    fun getServiceCasesForOperator(@PathVariable operatorId: Long): ResponseEntity<Flux<ServiceCaseDto>> {
        return ResponseEntity.ok(serviceCaseService.getServiceCasesForOperator(operatorId))
    }


    @PostMapping("/assign/{operatorId}/{serviceCaseId}")
    fun assignOperatorToServiceCase(
        @PathVariable operatorId: Long,
        @PathVariable serviceCaseId: Long
    ): Mono<UsersServiceCases> {
        return serviceCaseService.assignOperatorToServiceCase(operatorId, serviceCaseId)
    }


}