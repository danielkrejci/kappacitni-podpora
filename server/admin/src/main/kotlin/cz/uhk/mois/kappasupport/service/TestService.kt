package cz.uhk.mois.kappasupport.service

import cz.uhk.mois.kappasupport.util.CodableDto
import org.springframework.core.ParameterizedTypeReference
import org.springframework.scheduling.annotation.EnableScheduling
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient

@Service
@EnableScheduling
class TestService(
    private val webClient: WebClient
) {


    //@Scheduled(cron = "*/10 * * * * *")
    fun test() {
        println("koleso")
        var result = webClient.get()
            .uri("localhost:8083/service-cases/types")
            .retrieve()
            .bodyToMono(object : ParameterizedTypeReference<List<CodableDto?>?>() {}).block()
        println(result)
    }

}