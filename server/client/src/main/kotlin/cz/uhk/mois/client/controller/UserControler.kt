package cz.uhk.mois.client.controller

import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.context.SecurityContextHolder
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken
import org.springframework.security.oauth2.core.OAuth2AccessToken
import org.springframework.security.oauth2.core.oidc.OidcIdToken
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


//for testing purposes only
@RestController
@RequestMapping("/users")
class UserControler {

    @GetMapping
    fun currentUser(token: OAuth2AuthenticationToken): OAuth2AuthenticationToken {
        return token
    }
}