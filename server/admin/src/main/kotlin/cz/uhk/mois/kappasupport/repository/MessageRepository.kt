package cz.uhk.mois.kappasupport.repository

import cz.uhk.mois.kappasupport.domain.Message
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import java.time.Instant


interface MessageRepository : ReactiveCrudRepository<Message, Long> {

    fun findAllByServiceCaseId(serviceCaseId: Long): Flux<Message>

    @Query("SELECT * FROM service_case_messages WHERE userid = :userId AND serviceCaseId = :serviceCaseId AND date < :now")
    fun findMessagesByUserIdAndServiceCaseIdAndDateBeforeNow(
        userId: Long,
        serviceCaseId: Long,
        now: Instant = Instant.now()
    ): Flux<Message>

}