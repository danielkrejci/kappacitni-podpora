package cz.uhk.mois.client.service

import cz.uhk.mois.client.controller.model.DeviceDto
import cz.uhk.mois.client.domain.Device
import cz.uhk.mois.client.mapper.DomainMapper
import cz.uhk.mois.client.repository.DeviceRepository
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.RequestBody
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class DeviceService(
    private val deviceRepository: DeviceRepository,

    ) {
    lateinit var mapper: DomainMapper
    fun findAll(): Flux<DeviceDto> {
        val devices = deviceRepository.findAll()
        return devices.map {
            mapper.toDto(it)
        }
    }

    fun saveDevice(device: Device): Mono<Device> {
        return deviceRepository.save(device)
    }
}