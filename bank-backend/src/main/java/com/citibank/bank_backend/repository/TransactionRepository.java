package com.citibank.bank_backend.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.citibank.bank_backend.model.Transaction;

public interface TransactionRepository extends MongoRepository<Transaction, String> {
    List<Transaction> findByAccountIdOrderByCreatedAtDesc(String accountId);
}
