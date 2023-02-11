package cz.uhk.mois.client.mapper

import cz.uhk.mois.client.controller.model.DeviceDto
import cz.uhk.mois.client.controller.model.ServiceCaseDto
import cz.uhk.mois.client.domain.Device
import cz.uhk.mois.client.domain.ServiceCase
import org.mapstruct.Mapper
import org.springframework.stereotype.Component

@Component
@Mapper(componentModel = "spring")
interface DomainMapper {

    fun toDto(device: Device): DeviceDto
    fun fromDto(deviceDto: DeviceDto): Device

    fun toDto(serviceCase: ServiceCase): ServiceCaseDto
    fun fromDto(serviceCaseDto: ServiceCaseDto): ServiceCase
}
