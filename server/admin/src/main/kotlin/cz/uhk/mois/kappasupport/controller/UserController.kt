package cz.uhk.mois.kappasupport.controller

import cz.uhk.mois.kappasupport.controller.model.UserDto
import cz.uhk.mois.kappasupport.service.UserService
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono

@RestController
@RequestMapping("/users")
class UserController(private val userService: UserService) {

    @GetMapping
    fun currentUser(token: OAuth2AuthenticationToken): Mono<UserDto> {
        var username: String = token.principal.attributes["email"] as String
        return userService.findByEmail(username)
    }


}