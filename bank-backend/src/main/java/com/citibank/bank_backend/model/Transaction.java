package com.citibank.bank_backend.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "transactions")
public class Transaction {
    
    @Id
    private String id;

    private String accountId;
    private TransactionType type;
    private BigDecimal amount;
    private BigDecimal balanceAfterTransaction;
    private LocalDateTime createdAt;

    public Transaction(
        String accountId,
        TransactionType type,
        BigDecimal amount,
        BigDecimal balanceAfterTransaction
    ) {
        this.accountId = accountId;
        this.type = type;
        this.amount = amount;
        this.balanceAfterTransaction = balanceAfterTransaction;
        this.createdAt = LocalDateTime.now();
    }

    public String getId() {
        return id;
    }

    public String getAccountId() {
        return accountId;
    }

    public TransactionType getType() {
        return type;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public BigDecimal getBalanceAfterTransaction() {
        return balanceAfterTransaction;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
