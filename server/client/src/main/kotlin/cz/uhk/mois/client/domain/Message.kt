package cz.uhk.mois.client.domain

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.Instant
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType

@Table(name = "SERVICE_CASE_MESSAGES")
class Message(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    var id: Long? = null,

    @Column("userId")
    var userId: Long,

    @Column("serviceCaseId")
    var serviceCaseId: Long,

    @Column("stateId")
    var stateId: Long,

    @Column("message")
    var message: String,

    @Column("date")
    var date: Instant
) {
    override fun toString(): String {
        return "Message(id=$id, userId=$userId, serviceCaseId=$serviceCaseId, stateId='$stateId', message='$message', date=$date)"
    }
}