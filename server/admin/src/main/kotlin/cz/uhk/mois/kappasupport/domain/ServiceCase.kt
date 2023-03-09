package cz.uhk.mois.kappasupport.domain


import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.Instant
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType

@Table(name = "SERVICE_CASES")
class ServiceCase(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    var id: Long? = null,

    @Column("userid")
    var userId: Long? = null,

    @Column("deviceid")
    var deviceId: Long? = null,

    @Column("casetype")
    var caseType: String,

    @Column("statetype")
    var stateType: String,

    @Column("datebegin")
    var dateBegin: Instant?,
    @Column("dateend")
    var dateEnd: Instant?,

    @Column("hash")
    var hash: String?
) {
    override fun toString(): String {
        return "ServiceCase(id=$id, userId=$userId, deviceId=$deviceId, caseType='$caseType', stateType='$stateType', dateBegin=$dateBegin, dateEnd=$dateEnd)"
    }
}