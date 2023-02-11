package cz.uhk.mois.client.controller.model

import java.time.Instant

data class ServiceCaseDto(
    val type: ServiceCaseType,
    val serialNumber: String,
    val message: String,
    val name: String,
    val surname: String?,
    val email: String,
    val phone: String?,
    val street: String?,
    val houseNumber: Int?,
    val city: String?,
    val postalCode: String?,
    val dateBegin: Instant?,
    val dateEnd: Instant?,
)

enum class ServiceCaseType(val representation: String) {
    TURN_ON_OFF("Zapínání a vypínání"),
    HARDWARE_PROBLEM("Problémy s hardwarem"),
    INSTALL_UPDATE("Instalace a aktualizace"),
    APP_NAVIGATION("Navigace v aplikacích"),
    SOFTWARE_USAGE("Software a používání"),
    ACCOUNT_PROBLEM("Problémy s účty"),
    INTERNET_CONNECTION("Internet a připojení"),
    CAMERA("Kamera"),
    TECHNICAL_QUESTION("Technický dotaz"),
    QUESTION("Obecný dotaz"),
    OS("Operační systém")
}