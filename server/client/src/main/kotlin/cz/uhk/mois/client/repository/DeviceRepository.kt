package cz.uhk.mois.client.repository

import cz.uhk.mois.client.domain.Device
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface DeviceRepository : ReactiveCrudRepository<Device, Long> {

    fun findBySerialNumber(serialNumber: String): Mono<Device>

    fun findByModelName(serialNumber: String): Mono<Device>
}