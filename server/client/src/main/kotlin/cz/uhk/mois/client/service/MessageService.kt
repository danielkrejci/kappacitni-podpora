package cz.uhk.mois.client.service

import cz.uhk.mois.client.controller.model.MessageDto
import cz.uhk.mois.client.domain.Message
import cz.uhk.mois.client.mapper.DomainMapper
import cz.uhk.mois.client.repository.MessageRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class MessageService(
    private val messageRepository: MessageRepository,
    private val mapper: DomainMapper
) {

    fun save(message: MessageDto): Mono<Message> {
        return messageRepository.save(mapper.fromDto(message))
    }

    fun findAllMessagesByServiceCaseId(id: Long): Flux<MessageDto> {
        return messageRepository.findAllByServiceCaseId(id).map { mapper.toDto(it) }
    }
}