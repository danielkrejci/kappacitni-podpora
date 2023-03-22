package cz.uhk.mois.kappasupport.service

import cz.uhk.mois.kappasupport.domain.Message
import cz.uhk.mois.kappasupport.exception.GenericException
import cz.uhk.mois.kappasupport.mapper.DomainMapper
import cz.uhk.mois.kappasupport.repository.MessageRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class MessageService(
    private val messageRepository: MessageRepository,
    private val mapper: DomainMapper
) {


    fun getMessagesCount(clientId: Long, serviceCaseId: Long): Mono<Long> {
        return messageRepository.findAllByServiceCaseIdAndUserIdAndStateIdOrderByDateDesc(clientId, serviceCaseId, 1L)
            .count()
    }


    fun findFirstFromClient(serviceCaseId: Long): Mono<Message> {
        return messageRepository.findOldestMesasageByScId(serviceCaseId)
            .switchIfEmpty(Mono.error(GenericException("There is no message in service case $serviceCaseId")))
    }

}