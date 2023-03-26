package cz.uhk.mois.kappasupport.domain


import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.Instant
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType

@Table(name = "SERVICE_CASE_LOGS")
class ServiceCaseLog(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    var id: Long? = null,

    @Column("userId")
    var userId: Long?,

    @Column("serviceCaseId")
    var serviceCaseId: Long,

    @Column("date")
    var date: Instant,

    @Column("action")
    var action: String,


    )