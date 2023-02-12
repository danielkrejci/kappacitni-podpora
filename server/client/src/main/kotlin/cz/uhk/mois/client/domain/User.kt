package cz.uhk.mois.client.domain

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import javax.persistence.Column
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType

@Table(name = "USERS")
class User(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    var id: Long? = null,
    @Column(name = "address", unique = true)
    var address: Long,
    var name: String,
    var surname: String,
    var phoneNUmber: String,
    var email: String,
    var operator: Boolean
)

@Table(name = "ADDRESSES")
class Address(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    val id: Long? = null,
    val street: String?,
    val houseNumber: Int?,
    val postalCode: Int?,
    val city: String?
)