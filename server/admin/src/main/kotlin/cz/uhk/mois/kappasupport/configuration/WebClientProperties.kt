package cz.uhk.mois.kappasupport.configuration

import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "email")
data class WebClientProperties(
    @Value("url")
    val url: String,
)