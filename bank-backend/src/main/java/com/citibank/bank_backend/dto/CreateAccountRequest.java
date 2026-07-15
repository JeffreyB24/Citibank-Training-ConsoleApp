package com.citibank.bank_backend.dto;

import java.math.BigDecimal;

import com.citibank.bank_backend.model.AccountType;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateAccountRequest {
    
    @NotBlank(message = "Customer ID is required.")
    private String customerId;

    @NotNull(message = "Account type is required.")
    private AccountType accountType;

    @DecimalMin(value = "0.00", message = "Starting balance cannot be negative.")
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
