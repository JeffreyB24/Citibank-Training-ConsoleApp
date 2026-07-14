package com.citibank.bank_backend.dto;

import java.math.BigDecimal;

import com.citibank.bank_backend.model.AccountType;

public class CreateAccountRequest {
    
    private String customerId;
    private AccountType accountType;
    private BigDecimal startingBalance;

    public CreateAccountRequest() {
    }

    public String getCustomerId() {
        return customerId;
    }

    public void setCustomerId(String customerId) {
        this.customerId = customerId;
    }

    public AccountType getAccountType() {
        return accountType;
    }

    public void setAccountType(AccountType accountType) {
        this.accountType = accountType;
    }

    public BigDecimal getStartingBalance() {
        return startingBalance;
    }

    public void setStartingBalance(BigDecimal startingBalance) {
        this.startingBalance = startingBalance;
    }
}
