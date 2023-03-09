package cz.uhk.mois.kappasupport.service


import cz.uhk.mois.kappasupport.controller.model.UserDto
import cz.uhk.mois.kappasupport.mapper.DomainMapper
import cz.uhk.mois.kappasupport.repository.UserRepository
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux

@Service
class UserService(
    private val userRepository: UserRepository,
    private val mapper: DomainMapper
) {

    fun getUsersByIdIn(ids: List<Long>): Flux<UserDto> {
        return userRepository.getUsersByIdIn(ids).map { mapper.toDto(it) }
    }

    fun findALlByIds(ids: List<Long>): Flux<UserDto> {
        return userRepository.getUsersByIdIn(ids).map { mapper.toDto(it) }

    }


}