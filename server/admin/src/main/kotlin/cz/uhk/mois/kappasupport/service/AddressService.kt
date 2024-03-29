package cz.uhk.mois.kappasupport.service


import cz.uhk.mois.kappasupport.domain.Address
import cz.uhk.mois.kappasupport.mapper.DomainMapper
import cz.uhk.mois.kappasupport.repository.AddressRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class AddressService(
    private val addressRepository: AddressRepository,
    private val mapper: DomainMapper
) {

    fun findById(id: Long): Mono<Address> {
        return addressRepository.findById(id)
    }

    fun save(address: Address): Mono<Address> {
        return addressRepository.save(address)
    }


}