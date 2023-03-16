package cz.uhk.mois.client.controller.model

import java.time.Instant

data class DeviceDto(
    val id: Long,
    val typeId: Long,
    val modelName: String,
    val serialNumber: String,
    val releaseDate: Instant
)

data class DeviceTypeDto(
    val code: Long,
    val name: String,
    val type: String
)

enum class DeviceType( val deviceType: String, val deviceName : String, val code: Long,) {
    MY_PHONE( "Mobilní telefon", "myPhone", 1),
    MY_PAD( "Tablet", "myPad", 2),
    MY_BOOK( "Notebook", "myBook", 3),
    MY_STUDIO( "Osobní počítač", "myStudio", 4),
    MY_WATCH( "Chytré hodinky", "myWatch", 5),
    MY_PODS( "Sluchátka", "myPods", 6),
    ACCESSORIES( "Ostatní", "accessories", 7);
}


