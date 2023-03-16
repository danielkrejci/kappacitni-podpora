package cz.uhk.mois.client.controller.model

data class CreateServiceCaseDto(
    var deviceTypeId: Long,
    var caseTypeId: Long,
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

data class SavedServiceCaseDto(
    var id: Long,
    var hash: String
)

enum class ServiceCaseType(val representation: String, val code: Long) {
    TURN_ON_OFF("Zapínání a vypínání", 1),
    HARDWARE_PROBLEM("Problémy s hardwarem", 2),
    INSTALL_UPDATE("Instalace a aktualizace", 3),
    APP_NAVIGATION("Navigace v aplikacích", 4),
    SOFTWARE_USAGE("Software a používání", 5),
    ACCOUNT_PROBLEM("Problémy s účty", 6),
    INTERNET_CONNECTION("Internet a připojení", 7),
    CAMERA("Kamera", 8),
    TECHNICAL_QUESTION("Technický dotaz", 9),
    QUESTION("Obecný dotaz", 10),
    OS("Operační systém", 11)
}

enum class StateType(val representation: String, val code: Long) {
    NEW("Nový", 1),
    ACTIVE("Aktivní", 2),
    WAITING("Čekající", 3),
    CLOSED("Uzavřený", 4);

    companion object {
        const val NEW_CONSTANT = "1L"
    }
}