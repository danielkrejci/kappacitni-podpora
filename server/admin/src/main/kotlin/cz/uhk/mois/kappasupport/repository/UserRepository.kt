package cz.uhk.mois.kappasupport.repository

import cz.uhk.mois.kappasupport.domain.User
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface UserRepository : ReactiveCrudRepository<User, Long> {

    fun getUsersByIdIn(ids: List<Long>): Flux<User>

    fun findByEmail(email: String): Mono<User>

    fun findAllByIdIn(ids: List<Long>): Flux<User>

    @Query("select * from users where isOperator = true")
    fun findAllOperators(): Flux<User>

    @Query("select * from users where isClient = true")
    fun findAllClients(): Flux<User>

}