package cz.uhk.mois.client.controller

import cz.uhk.mois.client.controller.model.CreateServiceCaseDto
import cz.uhk.mois.client.controller.model.SavedServiceCaseDto
import cz.uhk.mois.client.controller.model.ServiceCaseType
import cz.uhk.mois.client.service.MessageService
import cz.uhk.mois.client.service.ServiceCaseService
import cz.uhk.mois.client.util.CodableDto
import cz.uhk.mois.client.util.SendMessage
import io.swagger.v3.oas.annotations.Operation
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@CrossOrigin("*")
@RestController
@RequestMapping("/service-cases")
class ServiceCaseController(
    private val serviceCaseService: ServiceCaseService,
    private val messageService: MessageService
) {


    @PostMapping("/{serviceCaseId}/message")
    fun sendMessageToServiceCase(
        @RequestBody message: SendMessage,
        @PathVariable serviceCaseId: Long
    ): ResponseEntity<Flux<Boolean>> {
        return ResponseEntity(messageService.sendMessage(message, serviceCaseId), HttpStatus.CREATED)
    }

    @GetMapping("/{id}/{hash}")
    fun getServiceCaseDetail(@PathVariable id: String, @PathVariable hash: String): Mono<Map<String, Any>> {
        return serviceCaseService.getServiceCaseDetail(id, hash)
    }

    @GetMapping("/types")
    fun getServiceTypes(): ResponseEntity<List<CodableDto>> {
        val types = ServiceCaseType.values().map { CodableDto(it.code, it.representation) }
        return ResponseEntity.ok(types)
    }

    @Operation(summary = "Send Messages to Ibm Mq", description = "Send Message to the related ibm mq")
    @PostMapping
    fun createServiceCase(@RequestBody sc: CreateServiceCaseDto): ResponseEntity<Mono<SavedServiceCaseDto>> {
        return ResponseEntity(
            serviceCaseService.createServiceCase(sc).mapNotNull { SavedServiceCaseDto(it.id!!, it.hash!!) },
            HttpStatus.CREATED
        )
    }
}