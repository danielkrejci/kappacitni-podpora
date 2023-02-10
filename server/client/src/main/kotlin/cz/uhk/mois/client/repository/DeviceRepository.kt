package cz.uhk.mois.client.repository

import cz.uhk.mois.client.controller.model.DeviceDto
import cz.uhk.mois.client.domain.Device
import org.springframework.data.repository.reactive.ReactiveCrudRepository

interface DeviceRepository : ReactiveCrudRepository<Device, Long> {
}