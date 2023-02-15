package cz.uhk.mois.client.controller.model

data class DeviceDto(
    val id: Long,
    val type: DeviceType,
    val modelName: String,
    val serialNumber: String
)

enum class DeviceType(val representation: String) {
    MY_PHONE("Mobilní telefon"),
    MY_PAD("Tablet"),
    MY_BOOK("Notebook"),
    MY_STUDIO("Osobní počítač"),
    MY_WATCH("Chytré hodinky"),
    MY_PODS("Sluchátka"),
    ACCESSORIES("Ostatní"),
}


