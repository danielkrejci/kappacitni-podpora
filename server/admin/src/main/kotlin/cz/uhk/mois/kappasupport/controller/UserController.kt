package cz.uhk.mois.kappasupport.controller

import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/users")
class UserController {

    @GetMapping
    fun currentUser(token: OAuth2AuthenticationToken): OAuth2AuthenticationToken {
        return token
    }
}