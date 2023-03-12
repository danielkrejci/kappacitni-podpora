package cz.uhk.mois.kappasupport.configuration


import cz.uhk.mois.kappasupport.repository.UserRepository
import org.springframework.boot.sql.init.dependency.DependsOnDatabaseInitialization
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpStatus
import org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity
import org.springframework.security.config.web.server.ServerHttpSecurity
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.security.web.server.SecurityWebFilterChain
import reactor.core.publisher.Mono
import java.net.URI

@Configuration
@EnableWebFluxSecurity
@DependsOnDatabaseInitialization
class SecurityConfiguration(private val userRepository: UserRepository) {

    @Bean
    fun securityWebFilterChain(http: ServerHttpSecurity): SecurityWebFilterChain {
        http.authorizeExchange()
            .pathMatchers("/login", "/error**", "/admin/service-cases/**").permitAll()
            .anyExchange().authenticated()
            .and()
            .oauth2Login { oauth2Login ->
                oauth2Login
                    .authenticationSuccessHandler { exchange, authentication ->
                        val currentUser = authentication.principal as OAuth2User
                        val mail = currentUser.attributes["email"] as String
                        val emailFlux = userRepository.findAll().map { it.email }.collectList()
                        emailFlux.flatMap {
                            if (!it.contains(mail)) {
                                exchange.exchange.response.statusCode = HttpStatus.UNAUTHORIZED
                                exchange.exchange.session.flatMap { session ->
                                    session.invalidate().thenReturn(Unit)
                                }.then()
                            } else {
                                exchange.exchange.response.statusCode = HttpStatus.FOUND
                                exchange.exchange.response.headers.location = URI.create("/admin/service-cases")
                                Mono.empty()
                            }
                        }
                    }
                    .authenticationFailureHandler { _, _ ->
                        Mono.empty()
                    }

            }
        http.csrf { it.disable() }
        return http.build()
    }
}