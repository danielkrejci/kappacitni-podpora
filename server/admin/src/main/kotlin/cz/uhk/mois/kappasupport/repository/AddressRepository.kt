package cz.uhk.mois.kappasupport.repository

import cz.uhk.mois.kappasupport.domain.Address
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Mono

interface AddressRepository : ReactiveCrudRepository<Address, Long> {

    fun getAddressById(id: Long): Mono<Address>
}