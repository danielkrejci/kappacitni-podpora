package cz.uhk.mois.client.domain

import cz.uhk.mois.client.controller.model.ServiceCaseType
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.Instant
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType

@Table(name = "SERVICE_CASES")
class ServiceCase(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    var id: Long? = null,

    @Enumerated(EnumType.STRING)
    var type: ServiceCaseType,
    var serialNumber: String,
    val message: String,
    val name: String,
    val surname: String,
    val email: String,
    val phone: String?,
    val street: String?,
    val houseNumber: Int?,
    val city: String?,
    val postalCode: String?,
    val dateBegin: Instant = Instant.now(),
    val dateEnd: Instant?
)