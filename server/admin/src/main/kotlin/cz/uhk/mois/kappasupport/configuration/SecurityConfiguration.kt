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
import org.springframework.web.cors.reactive.CorsWebFilter
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

        return http.cors().and().build()
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

    @Bean
    fun corsFilter(): CorsWebFilter {
        val corsConfig = CorsConfiguration()
        corsConfig.allowedOrigins = listOf("*") // Allow all origins
        corsConfig.allowedMethods = listOf("*") // Allow all HTTP methods
        corsConfig.allowedHeaders = listOf("*") // Allow all headers
        corsConfig.maxAge = 3600L // Cache preflight response for 1 hour

        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", corsConfig)

        return CorsWebFilter(source)
    }
}
