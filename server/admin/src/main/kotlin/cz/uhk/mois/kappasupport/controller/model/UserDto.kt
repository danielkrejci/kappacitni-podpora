package cz.uhk.mois.kappasupport.controller.model

data class UserDto(
    var id: Long?,
    var addressId: Long?,
    var name: String,
    var surname: String,
    var phone: String?,
    var email: String,
    var isOperator: Boolean,
    var isClient: Boolean,
    var picture: String?
) {

    override fun toString(): String {
        return "UserDto(id=$id, addressId=$addressId, name='$name', surname='$surname', phone=$phone, email='$email', isOperator=$isOperator, isClient=$isClient)"
    }
}
