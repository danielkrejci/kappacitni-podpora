package cz.uhk.mois.kappasupport.mapper

import cz.uhk.mois.kappasupport.controller.model.*
import cz.uhk.mois.kappasupport.domain.*
import cz.uhk.mois.kappasupport.util.UserLoser
import org.mapstruct.Mapper
import org.mapstruct.Mapping
import org.springframework.stereotype.Component

@Component
@Mapper(componentModel = "spring")
interface DomainMapper {

    fun fromDto(sc: ServiceCaseDto): ServiceCase
    fun toDto(sc: ServiceCase): ServiceCaseDto
    fun fromDto(userDto: UserDto): User
    fun toDto(user: User): UserDto
    fun fromDto(usersServiceCasesDto: UsersServiceCasesDto): UsersServiceCases
    fun toDto(usersServiceCases: UsersServiceCases): UsersServiceCasesDto

    @Mapping(source = "userDto.id", target = "id")
    fun toUserLoser(userDto: UserDto, addressDto: AddressDto): UserLoser
    fun toUserLoser(userDto: UserDto): UserLoser
    fun toDto(address: Address): AddressDto
    fun fromDto(address: AddressDto): Address
    fun toDto(message: Message): MessageDto
    fun fromDto(messageDto: MessageDto): Message
}
