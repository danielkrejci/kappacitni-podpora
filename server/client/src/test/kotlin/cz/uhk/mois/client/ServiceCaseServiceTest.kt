package cz.uhk.mois.client

import cz.uhk.mois.client.controller.model.CreateServiceCaseDto
import cz.uhk.mois.client.controller.model.MessageDto
import cz.uhk.mois.client.controller.model.UsersServiceCasesDto
import cz.uhk.mois.client.domain.*
import cz.uhk.mois.client.mapper.DomainMapper
import cz.uhk.mois.client.repository.AddressRepository
import cz.uhk.mois.client.repository.ServiceCaseRepository
import cz.uhk.mois.client.repository.UserRepository
import cz.uhk.mois.client.service.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.Mockito.any
import org.mockito.Mockito.`when`
import org.mockito.junit.jupiter.MockitoExtension
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import reactor.test.StepVerifier
import java.time.Instant


@ExtendWith(MockitoExtension::class)
class ServiceCaseServiceTest {

    @Mock
    private lateinit var validationService: ValidationService

    @Mock
    private lateinit var userRepository: UserRepository

    @Mock
    private lateinit var addressRepository: AddressRepository

    @Mock
    private lateinit var serviceCaseRepository: ServiceCaseRepository

    @Mock
    private lateinit var deviceService: DeviceService

    @Mock
    private lateinit var messageService: MessageService

    @Mock
    private lateinit var usersServiceCasesService: UsersServiceCasesService

    @Mock
    private lateinit var mapper: DomainMapper

    @Mock
    private lateinit var logService: LogService

    @Mock
    private lateinit var emailService: EmailService

    @InjectMocks
    private lateinit var serviceCaseService: ServiceCaseService

    private lateinit var createServiceCaseDto: CreateServiceCaseDto

    private lateinit var user: User

    private lateinit var address: Address

    private lateinit var device: Device

    @BeforeEach
    fun setUp() {
        user = User(
            1L,
            1L,
            "Daniel",
            "Tláskal",
            "1234556789",
            "krejcda2@ughk.cz",
            false,
            true,
            null
        )

        createServiceCaseDto = CreateServiceCaseDto(
            1L,
            1L,
            "Some serial number",
            "Nejde mi zapnout mobil",
            "Daniel",
            "Tláskal",
            "krejcda2@ughk.cz",
            "1234556789",
            "Vrbického",
            "56",
            "Hradec Králové",
            "50003"
        )

        address = Address(
            1L,
            createServiceCaseDto.street,
            createServiceCaseDto.houseNumber,
            createServiceCaseDto.postalCode,
            createServiceCaseDto.city
        )

        device = Device(
            1L, 1L, "myPhone", createServiceCaseDto.serialNumber, Instant.now()
        )


    }

    @Test
    fun `test createServiceCase with valid input`() {
        val sc = ServiceCase(1L, 1L, 1L, 1L, 1L, "hashos", Instant.now(), null)
        `when`(mapper.fromDto(createServiceCaseDto)).thenReturn(
            sc
        )

        `when`(addressRepository.save(any())).thenReturn(Mono.just(address))
        `when`(userRepository.save(user)).thenReturn(Mono.just(user))
        `when`(deviceService.findBySerialNumber(createServiceCaseDto.serialNumber)).thenReturn(Mono.just(device))
        `when`(serviceCaseRepository.save(sc)).thenReturn(Mono.just(sc))
        `when`(userRepository.findById(1L)).thenReturn(Mono.just(user))
        `when`(emailService.sendEmail(user, sc, "")).thenReturn(Mono.just(user))
        `when`(logService.saveLog(1L, 1L, "${user.name} ${user.surname} vytvořil servisní případ")).thenReturn(
            Mono.just(ServiceCaseLog(1L, 1L, 1L, Instant.now(), "Now"))
        )

        `when`(logService.saveLog(1L, 1L, "Vytvořena zpráva klientem")).thenReturn(
            Mono.just(ServiceCaseLog(1L, 1L, 1L, Instant.now(), "Vytvořena zpráva klientem"))
        )

        `when`(messageService.save(MessageDto(null, 1L, 1L, 1L, "Nejde mi zapnout mobil", any<Instant?>()))).thenReturn(
            Mono.just(Message(1L, 1L, 1L, 1L, "", Instant.now()))
        )
        val operator = User(
            2L,
            1L,
            "Daniel",
            "Tláskal",
            "1234556789",
            "dasd@ughk.cz",
            true,
            false,
            null
        )

        `when`(userRepository.findAllByOperator()).thenReturn(Flux.just(operator))
        `when`(usersServiceCasesService.getOperatorScCount(2L)).thenReturn(Mono.just(1L))
        `when`(usersServiceCasesService.save(UsersServiceCasesDto(2L, 1L))).thenReturn(
            Mono.just(UsersServiceCases(2L, 2L, 1L))
        )
        `when`(userRepository.findById(2L)).thenReturn(Mono.just(operator))
        `when`(usersServiceCasesService.save(UsersServiceCasesDto(1L, 1L))).thenReturn(
            Mono.just(
                UsersServiceCases(
                    1L,
                    1L,
                    1L
                )
            )
        )

        `when`(logService.saveLog(2L, 1L, "Přiřazen operátor Daniel Tláskal")).thenReturn(
            Mono.just(
                ServiceCaseLog(
                    3L, 2L, 1L, Instant.now(), "Přiřazen operátor Daniel Tláskal"
                )
            )
        )

        `when`(mapper.fromServiceCaseToAddress(createServiceCaseDto)).thenReturn(address)
        `when`(addressRepository.findById(user.addressId!!)).thenReturn(Mono.just(address))
        `when`(userRepository.findByEmail(createServiceCaseDto.email)).thenReturn(Mono.just(user))
        `when`(validationService.validateServiceCase(createServiceCaseDto)).thenReturn(Mono.just(createServiceCaseDto))

        val result = serviceCaseService.createServiceCase(createServiceCaseDto)

        StepVerifier.create(result).expectNextMatches {
            it.id == 1L &&
                    it.userId == 1L &&
                    it.deviceId == 1L &&
                    it.caseTypeId == 1L &&
                    it.stateId == 1L &&
                    it.dateEnd == null

        }.verifyComplete()
    }
}