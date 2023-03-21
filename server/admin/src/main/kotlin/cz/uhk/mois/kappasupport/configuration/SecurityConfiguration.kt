package cz.uhk.mois.kappasupport.configuration


import cz.uhk.mois.kappasupport.exception.JWTException
import cz.uhk.mois.kappasupport.service.JwtService
import org.springframework.boot.sql.init.dependency.DependsOnDatabaseInitialization
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.security.config.web.server.SecurityWebFiltersOrder
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.web.server.SecurityWebFilterChain
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.reactive.CorsConfigurationSource
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebFilterChain
import reactor.core.publisher.Mono


@Configuration
@DependsOnDatabaseInitialization
class SecurityConfiguration(
    private var jwtService: JwtService
) {
    @Bean
    fun securityWebFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain {
        http.addFilterAfter(JWTWebFilterChain(jwtService), SecurityWebFiltersOrder.AUTHENTICATION)
        return http.cors().configurationSource(corsFilter()).and().build()
    }

    @Bean
    fun corsFilter(): CorsConfigurationSource {
        val corsConfig = CorsConfiguration()

        corsConfig.applyPermitDefaultValues()

        corsConfig.addAllowedOrigin("http://localhost:3000")
        corsConfig.addAllowedHeader("Authorization")
        corsConfig.addAllowedMethod("*")

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", corsConfig)

        return source
    }
}

class JWTWebFilterChain(private var jwtService: JwtService) : WebFilter {
    override fun filter(exchange: ServerWebExchange, chain: WebFilterChain): Mono<Void> {
        var tokenosFromHeader = exchange.request.headers[HttpHeaders.AUTHORIZATION]?.first()
            ?: return Mono.error(JWTException("No token is found"))
        val jwtToken = tokenosFromHeader.substring(7)
        return jwtService.checkToken(jwtToken).doOnError {
            exchange.response.statusCode = HttpStatus.UNAUTHORIZED
        }.then(chain.filter(exchange))
    }

}
