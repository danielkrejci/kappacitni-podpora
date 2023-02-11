package cz.uhk.mois.client.repository

import cz.uhk.mois.client.domain.Device
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Mono

interface DeviceRepository : ReactiveCrudRepository<Device, Long> {

    fun findBySerialNumber(serialNumber: String): Mono<Device>
}