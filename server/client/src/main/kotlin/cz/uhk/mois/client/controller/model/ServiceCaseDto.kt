package cz.uhk.mois.client.controller.model

import java.time.Instant

data class ServiceCaseDto(
    val type: ServiceCaseType,
    val serialNumber: String,
    val message: String,
    //USER
    val name: String,
    val surname: String,
    val email: String,
    val phone: String?,
    //address
    val street: String?,
    val houseNumber: String?,
    val city: String?,
    val postalCode: String?,
    val dateBegin: Instant?,
    val dateEnd: Instant?,
) {
    override fun toString(): String {
        return "ServiceCaseDto(type=$type, serialNumber='$serialNumber', message='$message', name='$name', surname=$surname, email='$email', phone=$phone, street=$street, houseNumber=$houseNumber, city=$city, postalCode=$postalCode, dateBegin=$dateBegin, dateEnd=$dateEnd)"
    }
}

data class ServiceCaseTypeDto(
    val code: String,
    val value: String
)
//TODO refactor to @Builder from lombok
class ServiceCaseDtoBuilder {
    private var type: ServiceCaseType? = null
    private var serialNumber: String? = null
    private var message: String? = null
    private var name: String? = null
    private var surname: String? = null
    private var email: String? = null
    private var phone: String? = null
    private var street: String? = null
    private var houseNumber: String? = null
    private var city: String? = null
    private var postalCode: String? = null
    private var dateBegin: Instant? = null
    private var dateEnd: Instant? = null

    fun type(type: ServiceCaseType) = apply { this.type = type }
    fun serialNumber(serialNumber: String) = apply { this.serialNumber = serialNumber }
    fun message(message: String) = apply { this.message = message }
    fun name(name: String) = apply { this.name = name }
    fun surname(surname: String) = apply { this.surname = surname }
    fun email(email: String) = apply { this.email = email }
    fun phone(phone: String?) = apply { this.phone = phone }
    fun street(street: String?) = apply { this.street = street }
    fun houseNumber(houseNumber: String?) = apply { this.houseNumber = houseNumber }
    fun city(city: String?) = apply { this.city = city }
    fun postalCode(postalCode: String?) = apply { this.postalCode = postalCode }
    fun dateBegin(dateBegin: Instant?) = apply { this.dateBegin = dateBegin }
    fun dateEnd(dateEnd: Instant?) = apply { this.dateEnd = dateEnd }

    fun build() = ServiceCaseDto(
        type!!,
        serialNumber!!,
        message!!,
        name!!,
        surname!!,
        email!!,
        phone,
        street,
        houseNumber,
        city,
        postalCode,
        dateBegin,
        dateEnd
    )
}

enum class ServiceCaseType(val representation: String, val code: String) {
    TURN_ON_OFF("Zapínání a vypínání", "1"),
    HARDWARE_PROBLEM("Problémy s hardwarem","2"),
    INSTALL_UPDATE("Instalace a aktualizace","3"),
    APP_NAVIGATION("Navigace v aplikacích","4"),
    SOFTWARE_USAGE("Software a používání","5"),
    ACCOUNT_PROBLEM("Problémy s účty","6"),
    INTERNET_CONNECTION("Internet a připojení","7"),
    CAMERA("Kamera","8"),
    TECHNICAL_QUESTION("Technický dotaz","9"),
    QUESTION("Obecný dotaz","10"),
    OS("Operační systém","11")
}