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

    @Column("userId")
    var userId: Long? = null,

    @Column("deviceId")
    var deviceId: Long,

    @Column("caseTypeId")
    var caseTypeId: Long,

    @Column("stateId")
    var stateId: Long,

    @Column("hash")
    var hash: String?,

    @Column("dateBegin")
    var dateBegin: Instant?,

    @Column("dateEnd")
    var dateEnd: Instant?
) {
    override fun toString(): String {
        return "ServiceCase(id=$id, userId=$userId, deviceId=$deviceId, caseTypeId='$caseTypeId', stateId='$stateId', hash=$hash, dateBegin=$dateBegin, dateEnd=$dateEnd)"
    }
}