package cz.uhk.mois.kappasupport.controller.model

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