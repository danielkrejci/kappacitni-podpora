package cz.uhk.mois.kappasupport.service

import cz.uhk.mois.kappasupport.domain.User
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

@Service
class StatsService(
    private val userService: UserService,
    private val serviceCaseService: ServiceCaseService,
    private val usersServiceCasesService: UsersServiceCasesService
) {


    fun getStats(): Mono<Stats> {
        val totalServiceCasesMono = serviceCaseService.getServiceCaseCount()
        val totalOperatorsFlux = userService.findAllOperators()
        val totalClientsFlux = userService.findAllClients()
        val totalActiveServiceCasesMono = serviceCaseService.getAllActiveServiceCases()
        val activeOperatorsFlux = totalOperatorsFlux.flatMap { operator ->
            getOperatorStats(operator, listOf(1L, 2L, 3L), true)
        }
        val totalClosedServiceCasesMono = serviceCaseService.getAllClosedServiceCases()
        val closedOperatorFlux = totalOperatorsFlux.flatMap { operator ->
            getOperatorStats(operator, listOf(4L), false)
        }

        return Flux.zip(
            totalServiceCasesMono,
            totalOperatorsFlux.collectList().switchIfEmpty(Mono.just(emptyList())),
            totalClientsFlux.collectList().switchIfEmpty(Mono.just(emptyList())),
            totalActiveServiceCasesMono,
            activeOperatorsFlux.collectList().switchIfEmpty(Mono.just(emptyList())),
            totalClosedServiceCasesMono,
            closedOperatorFlux.collectList().switchIfEmpty(Mono.just(emptyList()))
        ).flatMap { values ->
            val stats = Stats(
                total = values[0] as Long,
                operators = (values[1] as List<*>).size.toLong(),
                clients = (values[2] as List<*>).size.toLong(),
                active = Stats.StateActive(
                    total = values[3] as Long,
                    operators = (values[4] as List<Stats.OperatorStatsActive>).sortedBy { it.active }.reversed()
                ),
                closed = Stats.StateClosed(
                    total = values[5] as Long,
                    operators = (values[6] as List<Stats.OperatorStatsClosed>).sortedBy { it.closed }.reversed()
                )
            )
            Mono.just(stats)
        }.singleOrEmpty()
    }


    private fun getOperatorStats(operator: User, stateIds: List<Long>, active: Boolean) =
        usersServiceCasesService.getActiveCaseForOperatorId(operator.id!!).map { it.serviceCaseId }.collectList()
            .flatMap {
                serviceCaseService.findALlByIdIn(it).filter { stateIds.contains(it.stateId) }.count().flatMap {
                    Mono.just(
                        if (active) {
                            Stats.OperatorStatsActive(
                                "${operator.name} ${operator.surname}", it
                            )
                        } else {
                            Stats.OperatorStatsClosed(
                                "${operator.name} ${operator.surname}", it
                            )
                        }
                    )
                }
            }
}

data class Stats(
    var total: Long,
    var operators: Long,
    var clients: Long,
    var active: StateActive,
    var closed: StateClosed
) {
    data class StateActive(
        var total: Long,
        var operators: List<OperatorStatsActive>
    )

    data class StateClosed(
        var total: Long,
        var operators: List<OperatorStatsClosed>
    )

    data class OperatorStatsActive(
        var name: String,
        var active: Long
    )

    data class OperatorStatsClosed(
        var name: String,
        var closed: Long
    )
}