package cz.uhk.mois.kappasupport.service

import cz.uhk.mois.kappasupport.controller.model.ServiceCaseType
import cz.uhk.mois.kappasupport.domain.ServiceCase
import cz.uhk.mois.kappasupport.domain.User
import cz.uhk.mois.kappasupport.util.DeviceType
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
    return ServiceCaseType.values().filter { it.id == id }.map { it.representation }.first()
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