package cz.uhk.mois.kappasupport.service


import cz.uhk.mois.kappasupport.controller.model.ServiceCaseLogDto
import cz.uhk.mois.kappasupport.domain.ServiceCaseLog
import cz.uhk.mois.kappasupport.mapper.DomainMapper
import cz.uhk.mois.kappasupport.repository.LogRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.time.Instant

@Service
class LogService(
    private val logRepository: LogRepository,
    private val mapper: DomainMapper
) {

    fun getLogsForServiceCase(scId: Long): Flux<ServiceCaseLog> {
        return logRepository.findAllByServiceCaseId(scId)
    }

    fun saveLog(userId: Long, scId: Long, action: String): Mono<ServiceCaseLog> {
        val logToSave = ServiceCaseLogDto(null, userId, scId, Instant.now(), action)
        return logRepository.save(mapper.fromDto(logToSave))
    }


}