package cz.uhk.mois.client.service

import cz.uhk.mois.client.controller.model.ServiceCaseDto
import cz.uhk.mois.client.controller.model.UserDto
import cz.uhk.mois.client.domain.ServiceCase
import cz.uhk.mois.client.mapper.DomainMapper
import cz.uhk.mois.client.repository.AddressRepository
import cz.uhk.mois.client.repository.ServiceCaseRepository
import cz.uhk.mois.client.repository.UserRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import reactor.kotlin.core.publisher.switchIfEmpty
import java.time.Instant

@Service
class ServiceCaseService(
    private val serviceCaseRepository: ServiceCaseRepository,
    private val userRepository: UserRepository,
    private val addressRepository: AddressRepository,
    private val mapper: DomainMapper
) {

    fun save(serviceCase: ServiceCaseDto): Mono<ServiceCase> {
        val sc = mapper.fromDto(serviceCase)
        sc.dateBegin = Instant.now()
        return userRepository.findByEmail(sc.email)
            .flatMap {
                it.name = serviceCase.name
                it.surname = serviceCase.surname
                it.email = serviceCase.email
                it.phone = serviceCase.phone
                userRepository.save(it).flatMap {
                    serviceCaseRepository.save(sc)
                }
            }
            .switchIfEmpty {
                val address = mapper.fromServiceCaseToAddressDto(serviceCase)
                addressRepository.save(address)
                    .flatMap { savedAddress ->
                        val newUser = UserDto(null, savedAddress.id, sc.name, sc.surname, sc.phone, sc.email, false)
                        userRepository.save(mapper.fromDto(newUser))
                    }
                    .flatMap { serviceCaseRepository.save(sc) }
            }

    }
}