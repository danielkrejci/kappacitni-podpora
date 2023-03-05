package cz.uhk.mois.client.controller.model

import java.time.Instant

data class MessageDto(
    var id: Long?,
    var userId: Long,
    var serviceCaseId: Long,
    var stateType: MessageStateType,
    var message: String,
    var date: Instant
)

enum class MessageStateType(val representation: String, val code: String) {
    DELIVERED("Doručeno", "1"),
    SEEN("Přečteno", "2")
}



