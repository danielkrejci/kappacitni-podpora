package cz.uhk.mois.client.domain

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType


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

    fun isEmpty(): Boolean {
        return street.isNullOrEmpty() && houseNumber.isNullOrEmpty() && postalCode.isNullOrEmpty() && city.isNullOrEmpty()
    }

    fun hasIncompleteAttributes(): Boolean {
        return (street.isNullOrBlank() || houseNumber.isNullOrBlank() || postalCode.isNullOrBlank() || city.isNullOrBlank())
                && (street?.isNotBlank() == true || houseNumber?.isNotBlank() == true || postalCode?.isNotBlank() == true || city?.isNotBlank() == true)
    }


}