package cz.uhk.mois.kappasupport

import cz.uhk.mois.kappasupport.configuration.WebClientProperties
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.runApplication

@SpringBootApplication
@EnableConfigurationProperties(WebClientProperties::class)
class KappaSupportApplication

fun main(args: Array<String>) {
    runApplication<KappaSupportApplication>(*args)
}
