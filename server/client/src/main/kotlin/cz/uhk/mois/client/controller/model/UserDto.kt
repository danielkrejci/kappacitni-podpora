package cz.uhk.mois.client.controller.model

data class UserDto(
    val id: Long?,
    val address: AddressDto?,
    val name: String,
    val surname: String,
    val phoneNUmber: String?,
    val email: String,
    val operator: Boolean
) {
    data class AddressDto(
        val street: String?,
        val houseNumber: Int?,
        val postalCode: Int?,
        val city: String?
    )
}