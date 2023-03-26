package cz.uhk.mois.kappasupport.domain


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
    var isClient: Boolean,

    @Column("picture")
    var picture: String?,
) {
    override fun toString(): String {
        return "User(id=$id, addressId=$addressId, name='$name', surname='$surname', phone='$phone', email='$email', isOperator=$isOperator, isClient=$isClient)"
    }
}
