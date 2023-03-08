package cz.uhk.mois.client.repository

import cz.uhk.mois.client.domain.Message
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux


interface MessageRepository : ReactiveCrudRepository<Message, Long> {

    fun findAllByServiceCaseId(serviceCaseId: Long): Flux<Message>

}