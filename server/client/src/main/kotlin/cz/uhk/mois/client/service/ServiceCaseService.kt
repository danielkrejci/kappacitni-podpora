package cz.uhk.mois.client.service

import cz.uhk.mois.client.controller.model.*
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
    private val mapper: DomainMapper,
    private val validationService: ValidationService,
    private val deviceService: DeviceService,
    private val messageService: MessageService
) {

    fun getServiceCaseDetail(id: String, hash: String): Mono<ServiceCase> {

        //potřbeuju service case jako takový

        // usera a operátora
        // daný device který se toho case týká
        // vsechny messages které se daného sc týkají

        //TODO validation for id.toLong
        //TODO shodovani hashu
        return serviceCaseRepository.findById(id.toLong()).flatMap { serviceCase ->
            userRepository.findById(serviceCase.userId!!).subscribe {
                println("user je $it")
            }


            if (serviceCase.hash == hash) {
                println("GUF PICO")
            } else {
                println("ERROR PICO")
            }
            Mono.just(serviceCase)
        }


    }

    fun createServiceCase(serviceCase: CreateServiceCaseDto): Mono<ServiceCase> {
        return validationService.validate(serviceCase).flatMap {
            //TODO UPDATE ADRES
            val sc = mapper.fromDto(it)



            sc.dateBegin = Instant.now()
            userRepository.findByEmail(serviceCase.email)
                .flatMap {
                    it.name = serviceCase.name
                    it.surname = serviceCase.surname
                    it.email = serviceCase.email
                    it.phone = serviceCase.phone
                    userRepository.save(it).flatMap { user ->
                        sc.userId = user.id!!
                        saveServiceCaseAndMessage(sc, serviceCase.message)
                    }
                }.switchIfEmpty {
                    val address = mapper.fromServiceCaseToAddressDto(serviceCase)
                    addressRepository.save(address)
                        .flatMap { savedAddress ->
                            val newUser = UserDto(
                                null,
                                savedAddress.id,
                                serviceCase.name,
                                serviceCase.surname,
                                serviceCase.phone,
                                serviceCase.email,
                                false
                            )
                            userRepository.save(mapper.fromDto(newUser))
                        }
                        .flatMap { user ->
                            sc.userId = user.id!!
                            saveServiceCaseAndMessage(sc, serviceCase.message)

                        }
                }
        }
    }

    private fun saveServiceCaseAndMessage(sc: ServiceCase, message: String): Mono<ServiceCase> {
        sc.hash = generateHash()
        println("Saving service case $sc")

        deviceService.findByModelName()


        sc.deviceId = 69L
        return serviceCaseRepository.save(sc).flatMap { savedServiceCase ->
            val msg =
                MessageDto(null, sc.userId!!, savedServiceCase.id!!, MessageStateType.DELIVERED, message, Instant.now())
            messageService.save(msg).flatMap {
                Mono.just(savedServiceCase)
            }
        }
    }

    private fun generateHash(): String {
        val charPool: List<Char> = ('a'..'z') + ('A'..'Z') + ('0'..'9')
        return (1..128)
            .map { kotlin.random.Random.nextInt(0, charPool.size) }
            .map(charPool::get)
            .joinToString("")
    }
}