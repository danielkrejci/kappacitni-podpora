package cz.uhk.mois.kappasupport.service

import com.auth0.jwt.JWT
import com.auth0.jwt.interfaces.Claim
import com.auth0.jwt.interfaces.DecodedJWT
import cz.uhk.mois.kappasupport.controller.model.UserDto
import cz.uhk.mois.kappasupport.domain.User
import cz.uhk.mois.kappasupport.exception.JWTException
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import java.util.*


@Service
class JwtService(
    private val userService: UserService
) {

    fun getEmailFromToken(token: String): Mono<String> {
        return getClaimsFromToken(token).flatMap {
            var mail = it.get("email")?.asString()!!
            Mono.just(mail)
        }
    }

    fun getUserFromToken(token: String): Mono<UserDto> {
        return getEmailFromToken(token).flatMap { mail ->
            userService.findByEmail(mail)
        }
    }


    fun checkToken(token: String): Mono<DecodedJWT> {
        val sanitizedToken = if (token.startsWith("Bearer ")) token.substring(7) else token
        val jwt = JWT.decode(sanitizedToken)
        val claims = jwt.claims

        val cal = Calendar.getInstance()
        cal.time = Date();
        cal.add(Calendar.SECOND, 2);
        if (jwt.expiresAt?.before(cal.time) == true) {
            return Mono.error(JWTException("Token is expired"))
        }

        val iss = claims["iss"]?.asString()
        if (iss != "accounts.google.com" && iss != "https://accounts.google.com") {
            return Mono.error(JWTException("Invalid issuer"))
        }

        val aud = claims["aud"]?.asString()
        if (aud != "440750977540-89l2ll74t5bqlj5cjh8q4rktmvd0igo2.apps.googleusercontent.com") {
            return Mono.error(JWTException("Invalid audience"))
        }

        val userEmail = jwt.claims["email"]?.asString() ?: return Mono.error(JWTException("There is no email in token"))

        val userPicture = jwt.claims["picture"]?.asString() ?: ""
        return userService.findByEmail(userEmail).flatMap { user ->
            updatePicture(user.id!!, userPicture).flatMap {
                if (!user.isOperator) {
                    Mono.error(JWTException("Email from token does not belong to opearotr"))
                } else {
                    Mono.just(jwt)
                }
            }
        }
    }

    private fun updatePicture(userId: Long, picture: String?): Mono<User> {
        return userService.updateUserPicture(userId, picture)
    }


    fun getClaimsFromToken(token: String): Mono<MutableMap<String, Claim>> {
        return checkToken(token).flatMap {
            Mono.just(it.claims)
        }
    }

}