package cz.uhk.mois.client.service

import cz.uhk.mois.client.controller.model.ServiceCaseDtoBuilder
import cz.uhk.mois.client.controller.model.ServiceCaseType
import cz.uhk.mois.client.domain.ServiceCase
import cz.uhk.mois.client.domain.User
import cz.uhk.mois.client.repository.AddressRepository
import cz.uhk.mois.client.repository.ServiceCaseRepository
import cz.uhk.mois.client.repository.UserRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.mapstruct.Mapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import reactor.test.StepVerifier
import java.time.Instant

@SpringBootTest
class ServiceCaseServiceTest {

    @Autowired
    private lateinit var userRepository: UserRepository

    @Autowired
    private lateinit var serviceCaseRepository: ServiceCaseRepository

    @Autowired
    private lateinit var addressRepository: AddressRepository

    @Autowired
    private lateinit var mapper: Mapper

    private lateinit var serviceCaseService: ServiceCaseService

    //TODO
    @Test
    @Disabled
    fun `save - user exists`() {

        val serviceCaseDto = ServiceCaseDtoBuilder()
            .type(ServiceCaseType.OS)
            .serialNumber("serialNumberos")
            .email("email@example.com")
            .name("John")
            .surname("Doe")
            .build()
        val expectedServiceCase = ServiceCase(
            null,
            ServiceCaseType.OS,
            serviceCaseDto.email,
            serviceCaseDto.name,
            serviceCaseDto.surname,
            "null",
            "",
            null,
            null,
            null,
            serviceCaseDto.phone,
            null,
            null,
            Instant.now()
        )

        val user = User(1L, 1L, "John", "Doe", "123456789", "email@example.com", false)
        userRepository.save(user).block()

        val result = serviceCaseService.save(serviceCaseDto).block()


        assertNotNull(result)
        assertEquals(expectedServiceCase.email, result?.email)
        assertEquals(expectedServiceCase.name, result?.name)
        assertEquals(expectedServiceCase.surname, result?.surname)
        assertEquals(expectedServiceCase.phone, result?.phone)

        StepVerifier.create(serviceCaseRepository.findAll())
            .expectNextMatches { it.email == expectedServiceCase.email }
            .verifyComplete()

        StepVerifier.create(userRepository.findAll())
            .expectNextMatches { it.email == user.email }
            .verifyComplete()
    }


}