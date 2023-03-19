package cz.uhk.mois.client.service

import cz.uhk.mois.client.controller.model.CreateServiceCaseDto
import cz.uhk.mois.client.controller.model.DeviceType
import cz.uhk.mois.client.controller.model.ServiceCaseType
import cz.uhk.mois.client.domain.ServiceCase
import cz.uhk.mois.client.domain.User
import cz.uhk.mois.client.exception.ValidationFailedException
import cz.uhk.mois.client.util.SendMessage
import org.apache.commons.lang.StringEscapeUtils
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty
import java.util.logging.Logger


@Service
class ValidationService(
    @Lazy private val deviceService: DeviceService,
    @Lazy private val userService: UserService,
    @Lazy private val serviceCaseService: ServiceCaseService,
    @Lazy private val usersServiceCasesService: UsersServiceCasesService
) {

    private val logger = Logger.getLogger(this.javaClass.name)

    companion object {
        private val EMAIL_REGEX = Regex("^[A-Z0-9a-z._%+-]+@[A-Z0-9a-z.-]+\\.[A-Za-z]{2,9}\$")
        private val HTML_REGEX = Regex("<.*?>")
        private val NUMBER_REGEX = Regex("\\D+")
    }

    fun validateServiceCase(sc: CreateServiceCaseDto): Mono<CreateServiceCaseDto> {
        val exceptions = mutableListOf<String>()
        // Email validation
        if (!EMAIL_REGEX.matches(sc.email)) exceptions.add("Email is invalid")

        // Device type validation
        val deviceTypeIds = DeviceType.values().map { it.code }
        if (!deviceTypeIds.contains(sc.deviceTypeId)) exceptions.add("Device type is invalid")

        // Case type validation
        val caseTypes = ServiceCaseType.values().map { it.code }
        if (!caseTypes.contains(sc.caseTypeId)) exceptions.add("Case type is invalid")

        // Message validation
        if (sc.message.length > 5000) exceptions.add("Message is too long")
        sc.message = sanitizeString(sc.message)

        sc.name = sanitizeString(sc.name)
        sc.surname = sanitizeString(sc.surname)
        sc.phone = sanitizePhoneNumber(sc.phone)
        sc.street = sc.street?.let { sanitizeString(it) }
        sc.houseNumber = sc.houseNumber?.let { sanitizeString(it) }
        sc.city = sc.city?.let { sanitizeString(it) }
        sc.postalCode = sc.postalCode?.let { sanitizePostalCode(it) }

        // Serial number validation
        return deviceService.findBySerialNumber(sc.serialNumber)
            .switchIfEmpty {
                exceptions.add("Device with serial number ${sc.serialNumber} does not exist")
                Mono.error(ValidationFailedException(exceptions.toString()))
            }
            .flatMap { device ->
                if (device.typeId != sc.deviceTypeId) {
                    exceptions.add("Device with serial number ${sc.serialNumber} does not belongs to this deviceTypeId: ${sc.deviceTypeId}")
                }
                if (exceptions.isNotEmpty()) Mono.error(ValidationFailedException(exceptions.toString())) else Mono.just(
                    sc
                )
            }
    }

    fun validateMessage(sendMessage: SendMessage, serviceCaseId: Long): Mono<Triple<SendMessage, User, ServiceCase>> {
        val exceptions = mutableListOf<String>()
        if (sendMessage.message.length > 5000) exceptions.add("Message is too long")
        sendMessage.message = sanitizeString(sendMessage.message)

        var userMono = userService.findUser(sendMessage.userId)
        var serviceCaseMono = serviceCaseService.findServiceCase(serviceCaseId)
        var assignedOperator =
            usersServiceCasesService.hasOperatorAssignedServiseCase(sendMessage.userId, serviceCaseId)

        return Mono.zip(userMono, serviceCaseMono, assignedOperator).flatMap {
            var user = it.t1
            var serviceCase = it.t2
            var isOperatorAssigned = it.t3

            // Servise case vytvořil  uživatel jako sendMessage.userId a zároven má ten uživatel nastavený isClient na true
            // NEBO vytvořil ho jiný uživatel, ale v tom případě daný user podle sendMessage.userId musí mít isOperator na true  a má ten serviceCase přiřazený

            var userCreatedServiceCaseAndIsClient = user.id!! == serviceCase.userId!! && user.isClient
            var userIsOperatorAndHasAssaginedCase = user.isOperator && isOperatorAssigned

            if (serviceCase.hash != sendMessage.hash) exceptions.add("Hash does not match")

            if (!(userCreatedServiceCaseAndIsClient || userIsOperatorAndHasAssaginedCase)) {
                if (!userCreatedServiceCaseAndIsClient) exceptions.add("User with id ${user.id} not created servisecase or he is not client")
                if (!userIsOperatorAndHasAssaginedCase) exceptions.add("User with id ${user.id} is not operator or he does not have assaigned this servise case")
            }

            if (exceptions.isNotEmpty()) Mono.error(ValidationFailedException(exceptions.toString())) else Mono.just(
                Triple(sendMessage, user, serviceCase)
            )

        }
    }


    fun sanitizePostalCode(pc: String?): String? {
        if (pc == null) return null
        var sanitizedPostalCode = sanitizeString(pc).filter { it.isDigit() }
        if (sanitizedPostalCode.length != 5) return null
        return sanitizedPostalCode
    }

    private fun sanitizeString(dirtyString: String) = StringEscapeUtils.escapeSql(dirtyString.replace(HTML_REGEX, ""))
    private fun sanitizePhoneNumber(pn: String?): String? {
        if (pn == null) return null
        val digitsOnly = pn.replace(NUMBER_REGEX, "")
        if (digitsOnly.length != 12) return null
        return when {
            digitsOnly.startsWith("420") -> "+420 " + digitsOnly.drop(3).chunked(3).joinToString(" ")
            digitsOnly.startsWith("421") -> "+421 " + digitsOnly.drop(3).chunked(3).joinToString(" ")
            else -> null
        }
    }

}