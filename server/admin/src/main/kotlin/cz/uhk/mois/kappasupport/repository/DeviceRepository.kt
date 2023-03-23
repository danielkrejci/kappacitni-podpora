package cz.uhk.mois.kappasupport.repository

import cz.uhk.mois.kappasupport.domain.Device
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Mono

interface DeviceRepository : ReactiveCrudRepository<Device, Long> {

    fun findBySerialNumber(serialNumber: String): Mono<Device>

    fun findByModelName(serialNumber: String): Mono<Device>
}