package cz.uhk.mois.client.controller

import cz.uhk.mois.client.controller.model.*
import cz.uhk.mois.client.service.DeviceService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux

@CrossOrigin("*")
@RestController
@RequestMapping("/devices")
class DevicesController(private val deviceService: DeviceService) {

    @GetMapping
    fun getDevices(): Flux<DeviceDto> {
        return deviceService.findAll()
    }

    @GetMapping("/types")
    fun getDeviceTypes(): ResponseEntity<List<DeviceTypeDto>> {
        val types = DeviceType.values().map { DeviceTypeDto(it.code, it.deviceName, it.deviceType) }
        return ResponseEntity.ok(types)
    }
}