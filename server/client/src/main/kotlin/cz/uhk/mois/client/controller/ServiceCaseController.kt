package cz.uhk.mois.client.controller

import cz.uhk.mois.client.controller.model.ServiceCaseDto
import cz.uhk.mois.client.controller.model.ServiceCaseType
import cz.uhk.mois.client.domain.ServiceCase
import cz.uhk.mois.client.service.ServiceCaseService
import cz.uhk.mois.client.util.CodableDto
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/service-cases")
class ServiceCaseController(private val serviceCaseService: ServiceCaseService) {

    @GetMapping("/types")
    fun getServiceTypes(): ResponseEntity<List<CodableDto>>  {
        val types = ServiceCaseType.values().map { CodableDto(it.code, it.representation) }
        return ResponseEntity.ok(types)
    }

    @PostMapping("/save")
    fun saveServiceCase(@RequestBody serviceCase: ServiceCaseDto): ResponseEntity<Mono<ServiceCase>> {
        return ResponseEntity(serviceCaseService.save(serviceCase), HttpStatus.CREATED)
    }
}