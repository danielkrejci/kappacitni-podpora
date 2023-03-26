package cz.uhk.mois.client.service

import cz.uhk.mois.client.controller.model.MessageDto
import cz.uhk.mois.client.controller.model.MessageStateType
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
    private val validationService: ValidationService,
    private val logService: LogService
) {

    fun save(message: MessageDto): Mono<Message> {
        return messageRepository.save(mapper.fromDto(message))
    }

    fun findAllMessagesByServiceCaseId(id: Long): Flux<MessageDto> {
        return messageRepository.findAllByServiceCaseId(id).map { mapper.toDto(it) }
    }

    fun sendMessage(sendMessage: SendMessage, serviceCaseId: Long): Flux<Boolean> {
        return validationService.validateMessage(sendMessage, serviceCaseId).flatMapMany {
            val senderUser = it.second
            val currentServiceCase = it.third
            val messageDto = MessageDto(
                null,
                sendMessage.userId,
                serviceCaseId,
                1,
                sendMessage.message,
                Instant.now()
            )

            var assignedOperator = serviceCaseService.getAssignedOperatorsForServiceCase(serviceCaseId).map { it.id }


            assignedOperator.collectList().flatMap { operatorIds ->
                if (senderUser.isClient && senderUser.isOperator) {
                    // CLIENT @ OPERATOR
                    val allMessagesForUser = messageRepository.findMessagesByUserIdAndServiceCaseIdAndDateBeforeNow(
                 listOf(senderUser.id!!),
                        serviceCaseId
                    )
                    bulkUpdateMessages(serviceCaseId, allMessagesForUser,  2L, messageDto, senderUser.id!!)
                } else if (senderUser.isClient) {
                    // CLIENT
                    val allMessagesForUser = messageRepository.findMessagesByUserIdAndServiceCaseIdAndDateBeforeNow(
                        operatorIds,
                        serviceCaseId
                    )
                    bulkUpdateMessages(serviceCaseId, allMessagesForUser,  2L, messageDto, senderUser.id!!)

                } else {
                    //OPERATOR
                    val allMessagesForUser = messageRepository.findMessagesByUserIdAndServiceCaseIdAndDateBeforeNow(
                        listOf(currentServiceCase.userId!!),
                        serviceCaseId
                    )
                    bulkUpdateMessages(serviceCaseId, allMessagesForUser, 3L, messageDto,senderUser.id!!)
                }

            }
        }
    }

    fun bulkUpdateMessages(
        serviceCaseId: Long,
        allMessagesForUser: Flux<Message>,
        serviceCaseState: Long,
        messageDto: MessageDto,
        userId: Long
    ): Mono<Boolean> {
        return updateServiceCaseState(serviceCaseId, serviceCaseState)
            .flatMapMany { serviceCase ->
                allMessagesForUser
                    .flatMap { message ->
                        updateMessageState(message.id!!, 2L)
                    }
            }.collectList()
            .flatMap {
                var message = mapper.fromDto(messageDto)
                messageRepository.save(message).flatMap {
                    logService.saveLog(userId,serviceCaseId, "Vytvořena zpráva klientem").flatMap {
                        Mono.just(true)
                    }
                }
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