package cz.uhk.mois.client.domain

import cz.uhk.mois.client.controller.model.ServiceCaseType
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Table
import java.time.Instant
import javax.persistence.*

@Table(name = "SERVICE_CASES")
class ServiceCase(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    var id: Long? = null,
    @Enumerated(EnumType.STRING)
    var type: ServiceCaseType,
    var serialNumber: String,
    var message: String,
    var name: String,
    var surname: String,
    var email: String,
    var phone: String?,
    var street: String?,
    var houseNumber: String?,
    var city: String?,
    var postalCode: String?,
    var dateBegin: Instant? = Instant.now(),
    var dateEnd: Instant?
) {
    override fun toString(): String {
        return "ServiceCase(id=$id, type=$type, serialNumber='$serialNumber', message='$message', name='$name', surname='$surname', email='$email', phone=$phone, street=$street, houseNumber=$houseNumber, city=$city, postalCode=$postalCode, dateBegin=$dateBegin, dateEnd=$dateEnd)"
    }
}