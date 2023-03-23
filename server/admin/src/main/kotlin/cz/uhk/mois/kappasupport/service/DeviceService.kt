package cz.uhk.mois.kappasupport.service


import cz.uhk.mois.kappasupport.controller.model.DeviceDto
import cz.uhk.mois.kappasupport.mapper.DomainMapper
import cz.uhk.mois.kappasupport.repository.DeviceRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class DeviceService(
    private val deviceRepository: DeviceRepository,
    private val mapper: DomainMapper
) {

    fun findByDeviceId(deviceId: Long): Mono<DeviceDto> {
        var device = deviceRepository.findById(deviceId)
        return device.map {
            mapper.toDto(it)
        }
    }
}