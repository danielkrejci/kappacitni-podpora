package cz.uhk.mois.kappasupport.controller.model

import java.time.Instant

class ServiceCaseDto(
    var userId: Long,
    var deviceId: Long,
    var caseType: String,
    var stateType: String,
    var dateBegin: Instant,
    var dateEnd: Instant?,
)

