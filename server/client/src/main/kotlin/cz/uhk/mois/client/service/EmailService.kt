package cz.uhk.mois.client.service

import cz.uhk.mois.client.controller.model.DeviceType
import cz.uhk.mois.client.controller.model.ServiceCaseType
import cz.uhk.mois.client.domain.ServiceCase
import cz.uhk.mois.client.domain.User
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class EmailService(
    private val deviceService: DeviceService
) {

    fun sendEmail(user: User, sc: ServiceCase): Mono<User> {
        return deviceService.findByDeviceId(sc.deviceId).flatMap { device ->
            var email = SendEmail(
                "${user.name} ${user.surname}",
                user.email,
                getScType(sc.caseTypeId),
                "Tvoje zpráva se vyřizuje bráško",
                device.modelName,
                getDeviceCategory(device.typeId),
                device.serialNumber
            )
            println("SENDING EMAIL for sc: ${sc.id} $email")
            Mono.just(user)
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
    var name: String,
    var email: String,
    var category: String,
    var message: String,
    var device: String,
    var type: String,
    var serialNumber: String
)