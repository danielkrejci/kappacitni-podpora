package cz.uhk.mois.kappasupport.controller

import cz.uhk.mois.kappasupport.service.JwtService
import cz.uhk.mois.kappasupport.service.UserService
import cz.uhk.mois.kappasupport.util.UserLoser
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono


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

    @GetMapping("/operators")
    fun getAllOperators(): ResponseEntity<Flux<UserLoser>> {
        return ResponseEntity.ok(userService.findAllOperatorsUl())
    }

    @GetMapping("/clients")
    fun getAllClients(): ResponseEntity<Flux<UserLoser>> {
        return ResponseEntity.ok(userService.findAllClientsUl())
    }

    @PostMapping("/{userId}")
    fun editUser(@RequestBody user: UserLoser, @PathVariable userId: Long): ResponseEntity<Mono<Boolean>> {
        return ResponseEntity.ok(userService.editUser(user, userId))
    }

    @DeleteMapping("/{userId}")
    fun deleteUser(@PathVariable userId: Long): ResponseEntity<Mono<Boolean>> {
        return ResponseEntity.ok(userService.deleteUser(userId))
    }

    @PostMapping
    fun createUser(@RequestBody user: UserLoser): ResponseEntity<Mono<Boolean>> {
        return ResponseEntity.ok(userService.create(user))
    }


}