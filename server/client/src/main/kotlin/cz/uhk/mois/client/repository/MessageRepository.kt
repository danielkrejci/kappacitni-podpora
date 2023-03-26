package cz.uhk.mois.client.repository

import cz.uhk.mois.client.domain.Message
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import java.time.Instant


interface MessageRepository : ReactiveCrudRepository<Message, Long> {

    fun findAllByServiceCaseId(serviceCaseId: Long): Flux<Message>

    @Query("""
        SELECT * FROM service_case_messages
        WHERE userid IN (:userIds) AND serviceCaseId = :serviceCaseId AND date < :now
    """)
    fun findMessagesByUserIdAndServiceCaseIdAndDateBeforeNow(
        userIds: List<Long>,
        serviceCaseId: Long,
        now: Instant = Instant.now()
    ): Flux<Message>

}