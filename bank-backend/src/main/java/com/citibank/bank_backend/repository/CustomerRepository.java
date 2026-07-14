package com.citibank.bank_backend.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.citibank.bank_backend.model.Customer;
import java.util.List;


public interface CustomerRepository 
            extends MongoRepository<Customer, String> {
    Optional<Customer> findByUsername(String username);

    boolean existsByUsername(String username);

} 
