package cz.uhk.mois.kappasupport.controller

import cz.uhk.mois.kappasupport.service.Stats
import cz.uhk.mois.kappasupport.service.StatsService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/stats")
class StatsController(
    private val statsService: StatsService
) {


    @GetMapping
    fun getStats(): ResponseEntity<Mono<Stats>> {
        return ResponseEntity.ok(statsService.getStats())
    }
}