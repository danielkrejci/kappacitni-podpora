package cz.uhk.mois.client.service

import cz.uhk.mois.client.configuration.WebClientProperties
import cz.uhk.mois.client.controller.model.DeviceType
import cz.uhk.mois.client.controller.model.ServiceCaseType
import cz.uhk.mois.client.domain.ServiceCase
import cz.uhk.mois.client.domain.User
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import reactor.core.publisher.Mono
import java.util.logging.Logger

@Service
class EmailService(
    private val deviceService: DeviceService,
    private val webClient: WebClient,
    private val webClientProperties: WebClientProperties
) {

    private val logger = Logger.getLogger(this.javaClass.name)

    fun sendEmail(user: User, sc: ServiceCase, templateName: String): Mono<User> {
        return deviceService.findByDeviceId(sc.deviceId).flatMap { device ->
            val emailbody = SendEmailbody(
                "${user.name} ${user.surname}",
                user.email,
                getScType(sc.caseTypeId),
                "Tvoje zpráva se vyřizuje!",
                device.modelName,
                getDeviceCategory(device.typeId),
                device.serialNumber,
                "Detail servisního případu",
                webClientProperties.serviceCaseUrl + "/${sc.id}/${sc.hash}"
            )

            val email = SendEmail(
                "Potvrzení přijetí žádosti na podporu - Kappacitní Podpora",
                listOf(user.email),
                templateName,
                emailbody,
            )

            webClient.post()
                .uri(webClientProperties.url)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .bodyValue(email)
                .retrieve()
                .bodyToMono(SendEmail::class.java)
                .onErrorResume {
                    logger.warning("Error when sending email: $email ==> $it")
                    Mono.just(email)
                }.flatMap {
                    Mono.just(user)
                }
        }
    }
}

fun getScType(id: Long): String {
    return ServiceCaseType.values().filter { it.code == id }.map { it.representation }.first()
}

fun getDeviceCategory(id: Long): String {
    return DeviceType.values().filter { it.code == id }.map { it.deviceName }.first()
}

data class SendEmail(
    var subject: String,
    var to: List<String>,
    var templateName: String,
    var templateContext: SendEmailbody,
)

data class SendEmailbody(
    var name: String,
    var email: String,
    var category: String,
    var message: String,
    var device: String,
    var type: String,
    var serialNumber: String,
    var buttonText: String,
    var buttonLink: String
)