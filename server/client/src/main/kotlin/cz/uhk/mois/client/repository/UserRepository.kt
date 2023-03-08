package cz.uhk.mois.client.repository

import cz.uhk.mois.client.domain.User
import org.springframework.data.r2dbc.repository.Query
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

interface UserRepository : ReactiveCrudRepository<User, Long> {

    fun findByEmail(email: String): Mono<User>

    @Query("SELECT * FROM users u WHERE u.operator IS TRUE")
    fun findAllByOperator(): Flux<User>

    fun findAllByIdIn(id: List<Long>): Flux<User>
}