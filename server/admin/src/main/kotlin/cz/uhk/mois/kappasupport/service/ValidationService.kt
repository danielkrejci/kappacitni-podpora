package cz.uhk.mois.kappasupport.service

import cz.uhk.mois.kappasupport.exception.ValidationFailedException
import cz.uhk.mois.kappasupport.util.UserLoser
import org.apache.commons.lang.StringEscapeUtils
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class ValidationService {

    companion object {
        private val EMAIL_REGEX = Regex("^[A-Z0-9a-z._%+-]+@[A-Z0-9a-z.-]+\\.[A-Za-z]{2,9}\$")
        private val HTML_REGEX = Regex("<.*?>")
        private val POSTAL_CODE_REGEX = Regex("^\\d{5}\$")
        private val PHONE_NUMBER_REGEX = """^(\+420|\+421) ?[1-9][0-9]{2} ?[0-9]{3} ?[0-9]{3}$""".toRegex()
        private val INVALID = "INVALID"
    }

    fun validateUser(user: UserLoser, checkEmail: Boolean): Mono<UserLoser> {
        val exceptions = mutableListOf<String>()


        if (checkEmail) {
            if (user.email.isNullOrBlank() || user.email.isNullOrEmpty()) {
                return Mono.error(ValidationFailedException("Email is mandatory"))
            }
            if (!EMAIL_REGEX.matches(user.email.toString())) exceptions.add("Email is invalid")
        }

        user.name = sanitizeString(user.name)
        user.surname = sanitizeString(user.surname)
        user.phone = sanitizePhoneNumber(user.phone)
        user.street = user.street?.let { sanitizeString(it) }
        user.houseNumber = user.houseNumber?.let { sanitizeString(it) }
        user.city = user.city?.let { sanitizeString(it) }
        user.postalCode = user.postalCode?.let { sanitizePostalCode(it) }

        if (user.name.isBlank()) exceptions.add("Username is mandatory")
        if (user.surname.isBlank()) exceptions.add("Surname is mandatory")

        if (user.phone == INVALID) exceptions.add("Invalid phone number")
        if (user.postalCode == INVALID) exceptions.add("Invalid postal code")

        if (user.hasIncompleteAddressAttributes()) exceptions.add("Incomplete address attributes")

        return if (exceptions.isNotEmpty()) Mono.error(ValidationFailedException(exceptions.toString())) else Mono.just(
            user
        )

    }


    private fun sanitizePostalCode(pc: String?): String? {
        if (pc.isNullOrEmpty() || pc.isNullOrBlank()) return null
        val trimmedInput = pc.replace("\\s".toRegex(), "")
        return if (POSTAL_CODE_REGEX.matches(trimmedInput)) {
            trimmedInput
        } else INVALID
    }

    private fun sanitizeString(dirtyString: String) = StringEscapeUtils.escapeSql(dirtyString.replace(HTML_REGEX, ""))
    private fun sanitizePhoneNumber(pn: String?): String? {
        if (pn.isNullOrEmpty() || pn.isNullOrBlank()) return null
        var trimmed = pn.replace("\\s".toRegex(), "")
        return if (PHONE_NUMBER_REGEX.matches(trimmed)) {
            reformatPhoneNumber(trimmed)
        } else {
            INVALID
        }
    }

    private fun reformatPhoneNumber(phoneNumber: String): String {
        if (phoneNumber.length < 10) {
            return phoneNumber
        }
        val countryCode = phoneNumber.substring(0, 4)
        val firstThreeDigits = phoneNumber.substring(4, 7)
        val nextThreeDigits = phoneNumber.substring(7, 10)
        val lastThreeDigits = phoneNumber.substring(10)
        return "$countryCode $firstThreeDigits $nextThreeDigits $lastThreeDigits"
    }
}