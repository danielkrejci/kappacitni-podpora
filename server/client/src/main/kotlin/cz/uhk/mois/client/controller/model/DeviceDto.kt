package cz.uhk.mois.client.controller.model

import java.util.stream.Collectors
import java.util.stream.Stream

data class DeviceDto(
    val id: Long,
    val type: DeviceType,
    val modelName: String,
    val serialNumber: String
)

enum class DeviceType(val representation: String, val code: String) {
    MY_PHONE("Mobilní telefon", "myPhone"),
    MY_PAD("Tablet", "myPad"),
    MY_BOOK("Notebook", "myBook"),
    MY_STUDIO("Osobní počítač", "myStudio"),
    MY_WATCH("Chytré hodinky", "myWatch"),
    MY_PODS("Sluchátka", "myPods"),
    ACCESSORIES("Ostatní", "accessories");

    fun fromCode(code: String) {
        Stream.of(DeviceType.values()).collect(Collectors.toMap())
    }
}


