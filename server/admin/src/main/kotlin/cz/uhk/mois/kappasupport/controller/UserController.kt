package cz.uhk.mois.kappasupport.controller

import cz.uhk.mois.kappasupport.service.JwtService
import cz.uhk.mois.kappasupport.service.UserService
import cz.uhk.mois.kappasupport.util.UserLoser
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono

@CrossOrigin("*")
@RestController
@RequestMapping("/users")
class UserController(
    private val userService: UserService,
    private val jwtService: JwtService,
) {

    @GetMapping("/current")
    fun currentUser(@RequestHeader("Authorization") token: String): ResponseEntity<Mono<UserLoser>> {
        return ResponseEntity.ok(jwtService.getEmailFromToken(token).flatMap { email ->
            userService.getCurrentUser(email)
        })
    }

}