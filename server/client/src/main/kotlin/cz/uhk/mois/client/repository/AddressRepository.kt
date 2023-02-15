package cz.uhk.mois.client.repository

import cz.uhk.mois.client.domain.Address
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Mono

interface AddressRepository: ReactiveCrudRepository<Address, Long> {

    fun getAddressById(id: Long): Mono<Address>
}