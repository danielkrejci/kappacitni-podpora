package cz.uhk.mois.kappasupport.util

data class UserLoser(
    var id: Long,
    var name: String,
    var surname: String,
    var email: String,
    var phone: String?,
    var street: String?,
    var houseNumber: String?,
    var city: String?,
    var postalCode: String?,
    var isClient: Boolean,
    var isOperator: Boolean
)

