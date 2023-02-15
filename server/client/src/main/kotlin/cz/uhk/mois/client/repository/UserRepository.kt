package cz.uhk.mois.client.repository

import cz.uhk.mois.client.domain.User
import org.springframework.data.repository.reactive.ReactiveCrudRepository

interface UserRepository : ReactiveCrudRepository<User, Long> {
}