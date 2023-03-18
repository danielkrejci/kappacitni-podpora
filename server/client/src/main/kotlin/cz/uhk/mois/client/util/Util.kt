package cz.uhk.mois.client.util

data class CodableDto(
    val code: Long,
    val value: String
)

data class SendMessage(
    var userId: Long,
    var hash: String,
    var message: String
)