package cz.uhk.mois.kappasupport.service

import cz.uhk.mois.kappasupport.controller.model.UserDto
import cz.uhk.mois.kappasupport.domain.ServiceCase
import cz.uhk.mois.kappasupport.mapper.DomainMapper
import cz.uhk.mois.kappasupport.repository.ServiceCaseRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux

@Service
class ServiceCaseService(
    private val serviceCaseRepository: ServiceCaseRepository,
    private val usersServiceCasesService: UsersServiceCasesService,
    private val userService: UserService,
    private val mapper: DomainMapper,
) {

    fun getAllServiceCases(): Flux<EnhancedServiceCaseDto> {
        return serviceCaseRepository.findAll().flatMap { serviceCase ->
            usersServiceCasesService.getOperatorIdsFromServiceCase(serviceCase.id!!).collectList().map {
                EnhancedServiceCaseDto(serviceCase, it)
            }
        }
    }

    data class EnhancedServiceCaseDto(
        var serviceCase: ServiceCase,
        var operators: List<UserDto>
    )
}