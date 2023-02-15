package cz.uhk.mois.client.service

import cz.uhk.mois.client.controller.model.DeviceDto
import cz.uhk.mois.client.domain.Device
import cz.uhk.mois.client.mapper.DomainMapper
import cz.uhk.mois.client.repository.DeviceRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class DeviceService(
    private val deviceRepository: DeviceRepository,
    private val mapper: DomainMapper
) {

    fun findAll(): Flux<DeviceDto> {
        val devices = deviceRepository.findAll()
        return devices.map {
            mapper.toDto(it)
        }
    }

    fun save(device: Device): Mono<Device> {
        return deviceRepository.save(device)
    }

    fun findBySerialNumber(serialNumber: String): Mono<Device> {
        return deviceRepository.findBySerialNumber(serialNumber)
    }
}