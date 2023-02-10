package cz.uhk.mois.client.controller

import cz.uhk.mois.client.controller.model.DeviceType
import cz.uhk.mois.client.domain.Device
import cz.uhk.mois.client.service.DeviceService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/devices")
class DeviceController(private val deviceService: DeviceService) {

    @GetMapping
    fun findAll(): ResponseEntity<List<String>> {
        val deviceTypes = DeviceType.values().map { it.representation }
        return ResponseEntity.ok(deviceTypes)
    }

    @PostMapping("/save")
    fun addDevice(@RequestBody device: Device): Mono<Device> {
        return deviceService.saveDevice(device)
    }
}