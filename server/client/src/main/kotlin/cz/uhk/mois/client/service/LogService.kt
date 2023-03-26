package cz.uhk.mois.client.service


import cz.uhk.mois.client.controller.model.ServiceCaseLogDto
import cz.uhk.mois.client.domain.ServiceCaseLog
import cz.uhk.mois.client.mapper.DomainMapper
import cz.uhk.mois.client.repository.LogRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import java.time.Instant

@Service
class LogService(
    private val logRepository: LogRepository,
    private val mapper: DomainMapper
) {
    fun saveLog(userId: Long, scId: Long, action: String): Mono<ServiceCaseLog> {
        val logToSave = ServiceCaseLogDto(null, userId, scId, Instant.now(), action)
        return logRepository.save(mapper.fromDto(logToSave))
    }

}