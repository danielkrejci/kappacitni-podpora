package cz.uhk.mois.kappasupport.util


data class UserLoser(
    var id: Long,
    var name: String,
    var surname: String,
    var email: String?,
    var phone: String?,
    var street: String?,
    var houseNumber: String?,
    var city: String?,
    var postalCode: String?,
    var isClient: Boolean,
    var isOperator: Boolean
) {
    fun hasIncompleteAddressAttributes(): Boolean {
        return (street.isNullOrBlank() || houseNumber.isNullOrBlank() || postalCode.isNullOrBlank() || city.isNullOrBlank())
                && (street?.isNotBlank() == true || houseNumber?.isNotBlank() == true || postalCode?.isNotBlank() == true || city?.isNotBlank() == true)
    }

    fun hasEmptyAddressAttribute(): Boolean {
        return street.isNullOrEmpty() && houseNumber.isNullOrEmpty() && postalCode.isNullOrEmpty() && city.isNullOrEmpty()
    }

}
