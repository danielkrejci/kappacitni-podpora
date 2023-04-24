package cz.uhk.mois.client

import cz.uhk.mois.client.configuration.WebClientProperties
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication

@SpringBootApplication
@EnableConfigurationProperties(WebClientProperties::class)
class ClientApplication

fun main(args: Array<String>) {
    runApplication<ClientApplication>(*args)
}
