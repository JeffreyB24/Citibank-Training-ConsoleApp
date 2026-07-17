package com.citibank.bank_backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.citibank.bank_backend.security.JwtAuthenticationFilter;
import com.citibank.bank_backend.security.RestAccessDeniedHandler;
import com.citibank.bank_backend.security.RestAuthenticationEntryPoint;

@Configuration
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final RestAuthenticationEntryPoint authenticationEntryPoint;
    private final RestAccessDeniedHandler accessDeniedHandler;

    public SecurityConfig(
            JwtAuthenticationFilter jwtAuthenticationFilter,
            RestAuthenticationEntryPoint authenticationEntryPoint,
            RestAccessDeniedHandler accessDeniedHandler
    ) {
        this.jwtAuthenticationFilter =
                jwtAuthenticationFilter;

        this.authenticationEntryPoint =
                authenticationEntryPoint;

        this.accessDeniedHandler =
                accessDeniedHandler;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http
    ) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .cors(cors -> {
                })

                .formLogin(form -> form.disable())

                .httpBasic(basic -> basic.disable())

                .logout(logout -> logout.disable())

                .sessionManagement(session ->
                        session.sessionCreationPolicy(
                                SessionCreationPolicy.STATELESS
                        )
                )

                .exceptionHandling(exceptions -> exceptions
                    .authenticationEntryPoint(
                        authenticationEntryPoint
                    )
                    .accessDeniedHandler(
                        accessDeniedHandler
                    )
                )

                .authorizeHttpRequests(auth -> auth

                    // Public endpoints
                    .requestMatchers(
                        HttpMethod.POST,
                        "/api/auth/login"
                    ).permitAll()

                        .requestMatchers(
                            HttpMethod.GET,
                            "/api/hello"
                        ).permitAll()

                        // Customer can retrieve only their own accounts
                        .requestMatchers(
                            HttpMethod.GET,
                            "/api/accounts/me"
                        ).hasRole("CUSTOMER")

                        // Admin-only customer management
                        .requestMatchers(
                            "/api/customers/**"
                        ).hasRole("ADMIN")

                        // Admin-only account creation and full listing
                        .requestMatchers(
                            HttpMethod.POST,
                            "/api/accounts"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                            HttpMethod.GET,
                            "/api/accounts"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                            HttpMethod.GET,
                            "/api/accounts/customer/**"
                        ).hasRole("ADMIN")

                        .requestMatchers(
                            HttpMethod.DELETE,
                            "/api/accounts/**"
                        ).hasRole("ADMIN")

                        // Banking operations are available to authenticated
                        // users, with ownership checked inside AccountService
                        .requestMatchers(
                            "/api/accounts/**"
                        ).authenticated()

                        .anyRequest().authenticated()
                )

                .addFilterBefore(
                    jwtAuthenticationFilter,
                    UsernamePasswordAuthenticationFilter.class
                );

                return http.build();
    }
}