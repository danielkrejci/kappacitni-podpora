package cz.uhk.mois.client.repository

import cz.uhk.mois.client.domain.UsersServiceCases
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface UsersServiceCasesRepository : ReactiveCrudRepository<UsersServiceCases, Long> {

    fun findAllByServiceCaseId(id: Long): Flux<UsersServiceCases>

    //TODO najít oprátorID  s nejmenším počtem případů a ne volat Xkrat do db pr každé operatorID
    @Query("SELECT COUNT(servicecaseid) FROM USERS_SERVICE_CASES WHERE userid = :userId")
    fun findUserIdWithFewestServiceCases(userId: Long): Mono<Long>

    fun findAllByUserId(userId: Long): Flux<UsersServiceCases>

    @Query("SELECT EXISTS (SELECT 1 FROM users_service_cases WHERE userId = :operatorId AND serviceCaseId = :serviceCaseId)")
    fun findIfOperatorIsAssigned(operatorId: Long, serviceCaseId: Long): Mono<Boolean>

}