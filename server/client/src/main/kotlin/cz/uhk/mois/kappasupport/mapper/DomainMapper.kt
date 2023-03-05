package cz.uhk.mois.kappasupport.mapper

import cz.uhk.mois.kappasupport.controller.model.AddressDto
import cz.uhk.mois.kappasupport.controller.model.CreateServiceCaseDto
import cz.uhk.mois.kappasupport.controller.model.StateType
import cz.uhk.mois.kappasupport.controller.model.UserDto
import cz.uhk.mois.kappasupport.domain.Address
import cz.uhk.mois.kappasupport.domain.ServiceCase
import cz.uhk.mois.kappasupport.domain.User
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.springframework.stereotype.Component


@Component
@Mapper(componentModel = "spring")
interface DomainMapper {

    fun toDto(address: Address): AddressDto
    fun fromDto(adress: AddressDto): Address

    fun toDto(user: User): UserDto
    fun fromDto(userDto: UserDto): User

    @Mapping(target = "stateType", constant = StateType.NEW_CONSTANT)
    fun fromDto(sc: CreateServiceCaseDto): ServiceCase
    fun toDto(sc: ServiceCase): CreateServiceCaseDto


}
