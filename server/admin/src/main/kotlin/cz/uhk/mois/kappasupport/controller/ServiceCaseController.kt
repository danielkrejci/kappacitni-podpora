package cz.uhk.mois.kappasupport.controller

import cz.uhk.mois.kappasupport.controller.model.ServiceCaseDto
import cz.uhk.mois.kappasupport.service.ServiceCaseService
import cz.uhk.mois.kappasupport.util.*
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/service-cases")
class ServiceCaseController(private val serviceCaseService: ServiceCaseService) {

    @GetMapping("/{id}")
    fun getServiceCaseDetail(@PathVariable id: String): ResponseEntity<Mono<Map<String, Any>>> {
        return ResponseEntity.ok(serviceCaseService.getServiceCaseDetail(id))
    }

    @PostMapping("/{id}/message")
    fun sendMessage(
        @RequestBody message: SendMessage,
        @PathVariable id: String,
        @RequestHeader("Authorization") token: String
    ): ResponseEntity<Mono<Boolean>> {
        return ResponseEntity.ok(serviceCaseService.sendMessage(message, id, token))
    }

    @GetMapping
    fun getAllServiceCases(
        @RequestParam(required = false) operatorId: Long?,
        @RequestParam(required = false) clientId: Long?,
        @RequestParam(required = false) state: Long?,
        @RequestParam(required = false, defaultValue = "date-desc") sort: String,
        @RequestParam(required = false, defaultValue = "1") page: Int,
    ): ResponseEntity<Mono<ServiceCaseService.PaginatedObject>> {
        return ResponseEntity.ok(serviceCaseService.getAllServiceCases(operatorId, clientId, state, sort, page))
    }

    @GetMapping("/operator/{operatorId}")
    fun getServiceCasesForOperator(@PathVariable operatorId: Long): ResponseEntity<Flux<ServiceCaseDto>> {
        return ResponseEntity.ok(serviceCaseService.getServiceCasesForOperator(operatorId))
    }

    @PostMapping("/{id}/category")
    fun changeCategory(
        @PathVariable id: String,
        @RequestBody category: ChangeCategory,
        @RequestHeader("Authorization") token: String
    ): ResponseEntity<Mono<Boolean>> {
        return ResponseEntity.ok(serviceCaseService.changeCategory(id, category, token))
    }

    @PostMapping("/{id}/state")
    fun changeState(
        @PathVariable id: String,
        @RequestBody category: ChangeState,
        @RequestHeader("Authorization") token: String
    ): ResponseEntity<Mono<Boolean>> {
        return ResponseEntity.ok(serviceCaseService.changeState(id, category, token))
    }

    @DeleteMapping("/{id}/operator")
    fun deleteOperatorFromSc(
        @PathVariable id: String,
        @RequestBody assignOperator: AssignUser,
        @RequestHeader("Authorization") token: String
    ): ResponseEntity<Mono<Boolean>> {
        return ResponseEntity.ok(serviceCaseService.removeOperatorFromSc(id, assignOperator, token))
    }

    @PostMapping("/{id}/operator")
    fun assignOperator(
        @PathVariable id: String,
        @RequestBody assignOperator: AssignUser,
        @RequestHeader("Authorization") token: String
    ): ResponseEntity<Mono<Boolean>> {
        return ResponseEntity.ok(serviceCaseService.assignOperator(id, assignOperator, token))
    }

    @GetMapping("/{id}/logs")
    fun getLogs(@PathVariable id: String): ResponseEntity<Flux<ServiceCaseLogResponse>> {
        return ResponseEntity.ok(serviceCaseService.getLogsForServiceCase(id.toLong()))
    }
}
