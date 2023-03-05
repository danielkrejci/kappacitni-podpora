package cz.uhk.mois.client.controller

import cz.uhk.mois.client.controller.model.CreateServiceCaseDto
import cz.uhk.mois.client.controller.model.ServiceCaseType
import cz.uhk.mois.client.domain.ServiceCase
import cz.uhk.mois.client.service.ServiceCaseService
import cz.uhk.mois.client.util.CodableDto
import io.swagger.v3.oas.annotations.Operation
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/service-cases")
class ServiceCaseController(private val serviceCaseService: ServiceCaseService) {

    @GetMapping("/{id}/{hash}")
    fun getServiceCaseDetail(@PathVariable id: String, @PathVariable hash: String): Mono<ServiceCase> {
        return serviceCaseService.getServiceCaseDetail(id, hash)
    }

    @GetMapping("/types")
    fun getServiceTypes(): ResponseEntity<List<CodableDto>> {
        val types = ServiceCaseType.values().map { CodableDto(it.code, it.representation) }
        return ResponseEntity.ok(types)
    }

    @Operation(summary = "Send Messages to Ibm Mq", description = "Send Message to the related ibm mq")
    @PostMapping("/create")
    fun createServiceCase(@RequestBody sc: CreateServiceCaseDto): ResponseEntity<Mono<Long>> {
        return ResponseEntity(serviceCaseService.createServiceCase(sc).mapNotNull { k -> k.id }, HttpStatus.CREATED)
    }


}