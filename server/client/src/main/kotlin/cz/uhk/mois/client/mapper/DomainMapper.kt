package cz.uhk.mois.client.mapper

import cz.uhk.mois.client.controller.model.*
import cz.uhk.mois.client.domain.*
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.springframework.stereotype.Component


@Component
@Mapper(componentModel = "spring")
interface DomainMapper {

    fun toDto(device: Device): DeviceDto
    fun fromDto(deviceDto: DeviceDto): Device

    fun toDto(address: Address): AddressDto
    fun fromDto(adress: AddressDto): Address

    fun toDto(user: User): UserDto
    fun fromDto(userDto: UserDto): User

    @Mapping(target = "stateType", constant = StateType.NEW_CONSTANT)
    fun fromDto(sc: CreateServiceCaseDto): ServiceCase
    fun toDto(sc: ServiceCase): CreateServiceCaseDto

    fun toDto(message: Message): MessageDto
    fun fromDto(messageDto: MessageDto): Message

    fun fromServiceCaseToAddressDto(serviceCaseDto: CreateServiceCaseDto): Address

}
