package cz.uhk.mois.client.domain

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import javax.persistence.GeneratedValue
import javax.persistence.GenerationType

@Table(name = "USERS_SERVICE_CASES")
class UsersServiceCases(
    @Id
    @GeneratedValue(strategy = GenerationType.TABLE)
    var id: Long? = null,

    @Column("userid")
    var userId: Long,

    @Column("servicecaseid")
    var serviceCaseId: Long
) {
    override fun toString(): String {
        return "UsersServiceCases(id=$id, userId=$userId, serviceCaseId=$serviceCaseId)"
    }
}