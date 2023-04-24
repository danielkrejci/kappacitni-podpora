package cz.uhk.mois.client.controller.model

import java.time.Instant

data class ServiceCaseLogDto(
    var id: Long?,
    var userId: Long,
    var serviceCaseId: Long,
    var date: Instant,
    var action: String,
)




