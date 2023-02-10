package cz.uhk.mois.client.mapper

import cz.uhk.mois.client.controller.model.DeviceDto
import cz.uhk.mois.client.domain.Device
import org.mapstruct.Mapper
import org.mapstruct.ReportingPolicy
import org.springframework.stereotype.Component

@Mapper
@Component
interface DomainMapper {

    fun toDto(device: Device): DeviceDto
    fun fromDto(deviceDto: DeviceDto): Device
}