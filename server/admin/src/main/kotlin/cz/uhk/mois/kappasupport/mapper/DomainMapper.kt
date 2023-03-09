package cz.uhk.mois.kappasupport.mapper

import cz.uhk.mois.kappasupport.controller.model.ServiceCaseDto
import cz.uhk.mois.kappasupport.controller.model.UserDto
import cz.uhk.mois.kappasupport.controller.model.UsersServiceCasesDto
import cz.uhk.mois.kappasupport.domain.ServiceCase
import cz.uhk.mois.kappasupport.domain.User
import cz.uhk.mois.kappasupport.domain.UsersServiceCases
import org.mapstruct.Mapper
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
}
