package cz.uhk.mois.kappasupport.controller

import cz.uhk.mois.kappasupport.exception.UserIsNotOperatorException
import cz.uhk.mois.kappasupport.exception.UserNotFoundException
import cz.uhk.mois.kappasupport.mapper.DomainMapper
import cz.uhk.mois.kappasupport.service.AddressService
import cz.uhk.mois.kappasupport.service.JwtService
import cz.uhk.mois.kappasupport.service.UserService
import cz.uhk.mois.kappasupport.util.UserLoser
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestHeader
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import reactor.core.publisher.Mono

@CrossOrigin("*")
@RestController
@RequestMapping("/users")
class UserController(
    private val userService: UserService,
    private val jwtService: JwtService,
    private val addressService: AddressService,
    private val mapper: DomainMapper
) {

    @GetMapping("/current")
    fun currentUser(@RequestHeader("Authorization") token: String): ResponseEntity<Mono<UserLoser>> {
        val email = jwtService.getEmailFromToken(token.substring(7))
        var user = userService.findByEmail(email!!).flatMap { user ->
            if (!user.isOperator) return@flatMap Mono.error(UserIsNotOperatorException("Unauthorized"))
            if (user.addressId != null) {
                addressService.findAddressById(user.addressId!!).flatMap { address ->
                    Mono.just(mapper.toUserLoser(user, mapper.toDto(address)))
                }
            } else {
                Mono.just(mapper.toUserLoser(user))
            }

        }.switchIfEmpty(Mono.error(UserNotFoundException("User with email $email not found")))
        return ResponseEntity.ok(user)
    }

}