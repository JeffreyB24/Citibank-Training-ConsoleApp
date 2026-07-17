package com.citibank.bank_backend.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.citibank.bank_backend.dto.LoginRequest;
import com.citibank.bank_backend.dto.LoginResponse;
import com.citibank.bank_backend.model.Customer;
import com.citibank.bank_backend.repository.CustomerRepository;
import com.citibank.bank_backend.security.JwtService;

@Service
public class AuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            CustomerRepository customerRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public LoginResponse login(LoginRequest request) {

        if (request.getUsername() == null
                || request.getUsername().isBlank()) {
            throw new IllegalArgumentException(
                    "Username is required."
            );
        }

        if (request.getPassword() == null
                || request.getPassword().isBlank()) {
            throw new IllegalArgumentException(
                    "Password is required."
            );
        }

        Customer customer = customerRepository
                .findByUsername(request.getUsername())
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Invalid username or password."
                        )
                );

        boolean passwordMatches =
                passwordEncoder.matches(
                        request.getPassword(),
                        customer.getPassword()
                );

        if (!passwordMatches) {
            throw new IllegalArgumentException(
                    "Invalid username or password."
            );
        }

        if (customer.getRole() == null) {
            throw new IllegalArgumentException(
                    "Customer role has not been assigned."
            );
        }

        String token = jwtService.generateToken(customer);

        return new LoginResponse(
                token,
                customer.getId(),
                customer.getUsername(),
                customer.getRole()
        );
    }
}
