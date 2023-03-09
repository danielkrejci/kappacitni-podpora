package cz.uhk.mois.kappasupport.controller.model

data class UserDto(
    var id: Long?,
    var address: Long?,
    var name: String,
    var surname: String,
    var phone: String?,
    var email: String,
    var operator: Boolean
) {

    override fun toString(): String {
        return "UserDto(id=$id, address=$address, name='$name', surname='$surname', phone=$phone, email='$email', operator=$operator)"
    }
}
