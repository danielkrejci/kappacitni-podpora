package cz.uhk.mois.kappasupport.service

import cz.uhk.mois.kappasupport.controller.model.MessageDto
import cz.uhk.mois.kappasupport.domain.Message
import cz.uhk.mois.kappasupport.exception.GenericException
import cz.uhk.mois.kappasupport.mapper.DomainMapper
import cz.uhk.mois.kappasupport.repository.MessageRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class MessageService(
    private val messageRepository: MessageRepository,
    private val mapper: DomainMapper,
) {

    fun findAllMessagesByServiceCaseId(id: Long): Flux<MessageDto> {
        return messageRepository.findAllByServiceCaseId(id).map { mapper.toDto(it) }
    }

    fun saveMessage(message: MessageDto): Mono<Message> {
        return messageRepository.save(mapper.fromDto(message))
    }

    fun saveMessage(message: Message): Mono<Message> {
        return messageRepository.save(message)
    }

    fun getMessagesCount(clientId: Long, serviceCaseId: Long): Mono<Long> {
        return messageRepository.findAllByServiceCaseIdAndUserIdAndStateIdOrderByDateDesc(clientId, serviceCaseId, 1L)
            .count()
    }

    fun findMessagesByUserIdAndServiceCaseIdAndDateBeforeNow(operatorIds: List<Long>, scId: Long): Flux<Message> {
        return messageRepository.findMessagesByUserIdAndServiceCaseIdAndDateBeforeNow(operatorIds, scId)
    }


    fun findFirstFromClient(serviceCaseId: Long): Mono<Message> {
        return messageRepository.findOldestMesasageByScId(serviceCaseId)
            .switchIfEmpty(Mono.error(GenericException("There is no message in service case $serviceCaseId")))
    }

    fun updateMessageState(messageId: Long, stateId: Long): Mono<Message> =
        messageRepository.findById(messageId)
            .switchIfEmpty(Mono.error(GenericException("Message with id $messageId not found")))
            .flatMap {
                it.stateId = stateId
                messageRepository.save(it)
            }
}