package cz.uhk.mois.kappasupport.service

import com.auth0.jwt.JWT
import com.auth0.jwt.interfaces.Claim
import com.auth0.jwt.interfaces.DecodedJWT
import cz.uhk.mois.kappasupport.exception.JWTException
import org.springframework.stereotype.Service
import reactor.core.publisher.Mono
import java.util.*


@Service
class JwtService {

    fun getEmailFromToken(token: String): Mono<String> {
        return getClaimsFromToken(token).flatMap {
            var mail = it.get("email")?.asString()!!
            Mono.just(mail)
        }
    }


    fun checkToken(token: String): Mono<DecodedJWT> {
        val sanitizedToken = if (token.startsWith("Bearer ")) token.substring(7) else token

        val jwt = JWT.decode(sanitizedToken)
        val claims = jwt.claims

        if (jwt.expiresAt?.before(Date()) == true) {
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
        return Mono.just(jwt)
    }


    fun getClaimsFromToken(token: String): Mono<MutableMap<String, Claim>> {
        return checkToken(token).flatMap {
            Mono.just(it.claims)
        }
    }

}