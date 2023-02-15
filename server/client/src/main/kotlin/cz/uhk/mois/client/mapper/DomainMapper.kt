package cz.uhk.mois.client.mapper

import cz.uhk.mois.client.controller.model.AddressDto
import cz.uhk.mois.client.controller.model.DeviceDto
import cz.uhk.mois.client.controller.model.ServiceCaseDto
import cz.uhk.mois.client.controller.model.UserDto
import cz.uhk.mois.client.domain.Address
import cz.uhk.mois.client.domain.Device
import cz.uhk.mois.client.domain.ServiceCase
import cz.uhk.mois.client.domain.User
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.springframework.stereotype.Component


@Component
@Mapper(componentModel = "spring")
interface DomainMapper {

    fun toDto(device: Device): DeviceDto
    fun fromDto(deviceDto: DeviceDto): Device

    fun toDto(serviceCase: ServiceCase): ServiceCaseDto
    fun fromDto(serviceCaseDto: ServiceCaseDto): ServiceCase

    fun toDto(address: Address): AddressDto
    fun fromDto(adress: AddressDto): Address

    fun toDto(user: User): UserDto
    fun fromDto(userDto: UserDto): User

    @Mapping(target = "operator", ignore = true)
    @Mapping(target = "address", ignore = true)
    fun fromServiceCaseToUser(serviceCaseDto: ServiceCaseDto): User

    fun fromServiceCaseToAddressDto(serviceCaseDto: ServiceCaseDto): Address

}
