package cz.uhk.mois.client.controller

import cz.uhk.mois.client.controller.model.DeviceType
import cz.uhk.mois.client.domain.Device
import cz.uhk.mois.client.exception.DeviceNotFoundException
import cz.uhk.mois.client.service.DeviceService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/devices")
class DeviceController(private val deviceService: DeviceService) {

    @GetMapping
    fun findAll(): ResponseEntity<List<String>> {
        val deviceTypes = DeviceType.values().map { it.representation }
        println(deviceTypes)
        return ResponseEntity(deviceTypes, HttpStatus.CREATED)
    }

    @GetMapping("/serialNumber/{serialNumber}")
    fun findBySerialNumber(@PathVariable serialNumber: String): ResponseEntity<Mono<Device>> {
        val device = deviceService.findBySerialNumber(serialNumber)
            .switchIfEmpty(Mono.error(DeviceNotFoundException("Device with serual number $serialNumber not found")))
        return ResponseEntity.ok(device)
    }

    @PostMapping("/save")
    fun addDevice(@RequestBody device: Device): Mono<Device> {
        return deviceService.save(device)
    }
}