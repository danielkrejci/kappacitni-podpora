package cz.uhk.mois.client.domain

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.Instant
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType

@Table(name = "MESSAGES")
class Message(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    var id: Long? = null,
    @Column("userid")
    var userId: Long,
    @Column("servicecaseid")
    var serviceCaseId: Long,
    @Enumerated(EnumType.STRING)
    @Column("statetype")
    var stateType: String,
    var message: String,
    var date: Instant
) {
    override fun toString(): String {
        return "Message(id=$id, userId=$userId, serviceCaseId=$serviceCaseId, stateType='$stateType', message='$message', date=$date)"
    }
}