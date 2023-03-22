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
    fun getAllServiceCases(
        @RequestParam(required = false) operatorId: Long?,
        @RequestParam(required = false) state: Long?,
        @RequestParam(required = false, defaultValue = "date-desc") sort: String,
        @RequestParam(required = false, defaultValue = "1") page: Int,
    ): ResponseEntity<Mono<ServiceCaseService.PaginatedObject>> {
        return ResponseEntity.ok(serviceCaseService.getAllServiceCases(operatorId, state, sort, page))
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