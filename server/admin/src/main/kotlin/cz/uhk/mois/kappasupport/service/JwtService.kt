package cz.uhk.mois.kappasupport.service

import arrow.core.getOrElse
import cz.uhk.mois.kappasupport.exception.EmailNotFoundException

import io.github.nefilim.kjwt.JWT
import org.springframework.stereotype.Service


@Service
class JwtService {

    companion object {
        const val EMAIL = "email"
    }

    fun getEmailFromToken(token: String): String {
        var email = ""
        JWT.decode(token).tap {
            email = it.jwt.claimValue(EMAIL).getOrElse { throw EmailNotFoundException("Email not found ") }
        }
        return email
    }
}