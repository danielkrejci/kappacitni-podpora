package cz.uhk.mois.client.controller.model

data class CreateServiceCaseDto(
    var deviceName: String,
    var caseType: String,
    var serialNumber: String,
    var message: String,

    //USER
    var name: String,
    var surname: String,
    var email: String,
    var phone: String?,

    //ADDRESS
    var street: String?,
    var houseNumber: String?,
    var city: String?,
    var postalCode: String?,
)

enum class ServiceCaseType(val representation: String, val code: String) {
    TURN_ON_OFF("Zapínání a vypínání", "1"),
    HARDWARE_PROBLEM("Problémy s hardwarem", "2"),
    INSTALL_UPDATE("Instalace a aktualizace", "3"),
    APP_NAVIGATION("Navigace v aplikacích", "4"),
    SOFTWARE_USAGE("Software a používání", "5"),
    ACCOUNT_PROBLEM("Problémy s účty", "6"),
    INTERNET_CONNECTION("Internet a připojení", "7"),
    CAMERA("Kamera", "8"),
    TECHNICAL_QUESTION("Technický dotaz", "9"),
    QUESTION("Obecný dotaz", "10"),
    OS("Operační systém", "11")
}