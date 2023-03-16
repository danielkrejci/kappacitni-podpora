package cz.uhk.mois.client.controller.model

data class UserDto(
    var id: Long?,
    var addressId: Long?,
    var name: String,
    var surname: String,
    var phone: String?,
    var email: String,
    var isOperator: Boolean,
    var isClient: Boolean
) {

    override fun toString(): String {
        return "UserDto(id=$id, addressId=$addressId, name='$name', surname='$surname', phone=$phone, email='$email', isOperator=$isOperator, isClient=$isClient)"
    }
}

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