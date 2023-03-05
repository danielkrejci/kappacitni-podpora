package cz.uhk.mois.client.service

import cz.uhk.mois.client.controller.model.CreateServiceCaseDto
import cz.uhk.mois.client.controller.model.DeviceType
import cz.uhk.mois.client.controller.model.ServiceCaseType
import cz.uhk.mois.client.exception.ValidationFailedException
import org.apache.commons.lang.StringEscapeUtils
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty


@Service
class ValidationService(private val deviceService: DeviceService) {
    companion object {
        private val EMAIL_REGEX = Regex("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}\$")
        private val HTML_REGEX = Regex("<.*?>")
        private val NUMBER_REGEX = Regex("\\D+")
    }

    fun validate(sc: CreateServiceCaseDto): Mono<CreateServiceCaseDto> {
        val exceptions = mutableListOf<String>()
        // Email validation
        if (!EMAIL_REGEX.matches(sc.email)) exceptions.add("Email is invalid")

        // Device names validation
        val deviceNames = DeviceType.values().map { it.code.lowercase() }
        if (!deviceNames.contains(sc.deviceName)) exceptions.add("Device name is invalid")

        // Case type validation
        val caseTypes = ServiceCaseType.values().map { it.code }
        if (!caseTypes.contains(sc.caseType)) exceptions.add("Case type is invalid")

        // Message validation
        if (sc.message.length > 5000) exceptions.add("Message is too long")
        sc.message = sanitizeString(sc.message)

        sc.name = sanitizeString(sc.name)
        sc.surname = sanitizeString(sc.surname)
        sc.phone = sanitizePhoneNumber(sc.phone)
        sc.street = sc.street?.let { sanitizeString(it) }
        sc.houseNumber = sc.houseNumber?.let { sanitizeString(it) }
        sc.city = sc.city?.let { sanitizeString(it) }
        sc.postalCode = sc.postalCode?.let { sanitizeString(it) }

        // Serial number validation
        return deviceService.findBySerialNumber(sc.serialNumber)
            .switchIfEmpty {
                exceptions.add("Device with serial number ${sc.serialNumber} does not exist")
                Mono.error(ValidationFailedException(exceptions.toString()))
            }
            .flatMap { device ->
                if (device.type.code.lowercase() != sc.deviceName) {
                    exceptions.add("Device with ${sc.serialNumber} does not belong to ${sc.deviceName}")
                }
                if (exceptions.isNotEmpty()) Mono.error(ValidationFailedException(exceptions.toString())) else Mono.just(
                    sc
                )
            }
    }

    private fun sanitizeString(dirtyString: String): String {
        return StringEscapeUtils.escapeSql(dirtyString.replace(HTML_REGEX, ""))
    }

    private fun sanitizePhoneNumber(pn: String?): String? {
        if (pn == null) return null
        val digitsOnly = pn.replace(NUMBER_REGEX, "")
        return when {
            digitsOnly.startsWith("420") -> "+420 " + digitsOnly.drop(3).chunked(3).joinToString(" ")
            digitsOnly.startsWith("421") -> "+421 " + digitsOnly.drop(3).chunked(3).joinToString(" ")
            else -> null
        }
    }


}