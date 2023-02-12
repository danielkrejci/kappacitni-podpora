package cz.uhk.mois.client.service

import cz.uhk.mois.client.domain.User
import cz.uhk.mois.client.mapper.DomainMapper
import cz.uhk.mois.client.repository.UserRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono

@Service
class UserService(
    private val userRepository: UserRepository,
    private val mapper: DomainMapper
) {

    fun saveUser(user: User): Mono<User> = userRepository.save(user)


}