package cz.uhk.mois.client.repository

import cz.uhk.mois.client.domain.User
import org.springframework.data.repository.reactive.ReactiveCrudRepository
import reactor.core.publisher.Mono

interface UserRepository : ReactiveCrudRepository<User, Long> {

    fun findByEmail(email: String): Mono<User>

}