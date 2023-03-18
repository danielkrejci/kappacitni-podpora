package cz.uhk.mois.client.service

import cz.uhk.mois.client.controller.model.MessageDto
import cz.uhk.mois.client.domain.Message
import cz.uhk.mois.client.domain.ServiceCase
import cz.uhk.mois.client.exception.MessageNotFoundException
import cz.uhk.mois.client.mapper.DomainMapper
import cz.uhk.mois.client.repository.MessageRepository
import cz.uhk.mois.client.util.SendMessage
import org.springframework.context.annotation.Lazy
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Service
class MessageService(
    private val messageRepository: MessageRepository,
    @Lazy private val serviceCaseService: ServiceCaseService,
    private val mapper: DomainMapper,
    private val validationService: ValidationService
) {
    companion object {
        private const val format = "yyyy-MM-dd HH:mm:ss"
        private val formatter: DateTimeFormatter = DateTimeFormatter.ofPattern(format).withZone(ZoneId.systemDefault())
    }

    fun save(message: MessageDto): Mono<Message> {
        return messageRepository.save(mapper.fromDto(message))
    }

    fun findAllMessagesByServiceCaseId(id: Long): Flux<MessageDto> {
        return messageRepository.findAllByServiceCaseId(id).map { mapper.toDto(it) }
    }

    fun sendMessage(sendMessage: SendMessage, serviceCaseId: Long): Mono<Message> {
        return validationService.validateMessage(sendMessage, serviceCaseId).flatMap {
            val senderUser = it.second
            val messageDto = MessageDto(
                null,
                sendMessage.userId,
                serviceCaseId,
                1,
                sendMessage.message,
                Instant.now()
            )
            val allMessagesForUser = messageRepository.findMessagesByUserIdAndServiceCaseIdAndDateBeforeNow(
                sendMessage.userId,
                serviceCaseId
            )

            return@flatMap if (senderUser.isClient && senderUser.isOperator) {
                // CLIENT @ OPERATOR
                bulkUpdateMessages(serviceCaseId, allMessagesForUser, senderUser.id!!, 2L, messageDto)
            } else if (senderUser.isClient) {
                // CLIENT
                bulkUpdateMessages(serviceCaseId, allMessagesForUser, senderUser.id!!, 2L, messageDto)

            } else {
                //OPERATOR
                bulkUpdateMessages(serviceCaseId, allMessagesForUser, senderUser.id!!, 3L, messageDto)
            }

        }


    }

    fun bulkUpdateMessages(
        serviceCaseId: Long,
        allMessagesForUser: Flux<Message>,
        senderUserId: Long,
        serviceCaseState: Long,
        messageDto: MessageDto
    ): Mono<Message> {
        return updateServiceCaseState(serviceCaseId, serviceCaseState)
            .flatMapMany { serviceCase ->
                allMessagesForUser.filter {
                    serviceCase.userId == senderUserId && it.date.isBefore(Instant.now())
                }
                    .flatMap { message ->
                        updateMessageState(message.id!!, 2L)
                    }
            }.collectList()
            .flatMap {
                var message = mapper.fromDto(messageDto)
                messageRepository.save(message)
            }
    }

    private fun updateMessageState(messageId: Long, stateId: Long): Mono<Message> =
        messageRepository.findById(messageId)
            .switchIfEmpty(Mono.error(MessageNotFoundException("Message with id $messageId not found")))
            .flatMap {
                it.stateId = stateId
                messageRepository.save(it)
            }


    private fun updateServiceCaseState(serviceCaseId: Long, state: Long): Mono<ServiceCase> =
        serviceCaseService.updateServiceCaseState(serviceCaseId, state)


}