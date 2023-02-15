package cz.uhk.mois.client.domain

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType

@Table(name = "USERS")
class User(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    var id: Long? = null,
    var address: Long,
    var name: String,
    var surname: String,
    var phone: String?,
    var email: String,
    var operator: Boolean
) {
    override fun toString(): String {
        return "User(id=$id, address=$address, name='$name', surname='$surname', phone='$phone', email='$email', operator=$operator)"
    }
}

@Table(name = "ADDRESSES")
class Address(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    var id: Long? = null,
    var street: String?,
    var houseNumber: String?,
    var postalCode: String?,
    var city: String?
) {
    override fun toString(): String {
        return "Address(id=$id, street=$street, houseNumber=$houseNumber, postalCode=$postalCode, city=$city)"
    }
}