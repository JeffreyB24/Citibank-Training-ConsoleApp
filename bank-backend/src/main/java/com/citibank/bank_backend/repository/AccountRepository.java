package com.citibank.bank_backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.citibank.bank_backend.model.Account;

public interface AccountRepository extends MongoRepository<Account, String> {
    List<Account> findByCustomerId(String customerId);
}
