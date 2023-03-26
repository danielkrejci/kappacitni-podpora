package cz.uhk.mois.kappasupport.repository

import cz.uhk.mois.kappasupport.domain.Message
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Instant


interface MessageRepository : ReactiveCrudRepository<Message, Long> {

    fun findAllByServiceCaseId(serviceCaseId: Long): Flux<Message>

    @Query(
        """
        SELECT * FROM service_case_messages
        WHERE userid IN (:userIds) AND serviceCaseId = :serviceCaseId AND date < :now
    """
    )
    fun findMessagesByUserIdAndServiceCaseIdAndDateBeforeNow(
        userIds: List<Long>,
        serviceCaseId: Long,
        now: Instant = Instant.now()
    ): Flux<Message>

    fun findAllByServiceCaseIdAndUserIdAndStateIdOrderByDateDesc(
        serviceCaseId: Long,
        userId: Long,
        stateId: Long
    ): Flux<Message>


    @Query("SELECT * FROM service_case_messages WHERE servicecaseid = :serviceCaseeId ORDER BY date ASC LIMIT 1")
    fun findOldestMesasageByScId(serviceCaseeId: Long): Mono<Message>
}