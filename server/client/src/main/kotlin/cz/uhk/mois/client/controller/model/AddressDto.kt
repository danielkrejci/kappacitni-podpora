package cz.uhk.mois.client.controller.model

data class AddressDto(
    var id: Long?,
    var street: String?,
    var houseNumber: String?,
    var postalCode: String?,
    var city: String?
) {
    override fun toString(): String {
        return "AddressDto(id=$id, street=$street, houseNumber=$houseNumber, postalCode=$postalCode, city=$city)"
    }
}