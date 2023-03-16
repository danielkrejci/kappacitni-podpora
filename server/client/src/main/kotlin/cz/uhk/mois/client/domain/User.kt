package cz.uhk.mois.client.domain

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType

@Table(name = "USERS")
class User(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    var id: Long? = null,

    @Column("addressId")
    var addressId: Long?,

    @Column("name")
    var name: String,

    @Column("surname")
    var surname: String,

    @Column("phone")
    var phone: String?,

    @Column("email")
    var email: String,

    @Column("isOperator")
    var isOperator: Boolean,

    @Column("isClient")
    var isClient: Boolean
) {
    override fun toString(): String {
        return "User(id=$id, addressId=$addressId, name='$name', surname='$surname', phone='$phone', email='$email', isOperator=$isOperator, isClient=$isClient)"
    }
}

@Table(name = "ADDRESSES")
class Address(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    var id: Long? = null,

    @Column("street")
    var street: String?,

    @Column("houseNumber")
    var houseNumber: String?,

    @Column("postalCode")
    var postalCode: String?,

    @Column("city")
    var city: String?
) {
    override fun toString(): String {
        return "Address(id=$id, street=$street, houseNumber=$houseNumber, postalCode=$postalCode, city=$city)"
    }
}