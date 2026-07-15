package com.citibank.bank_backend.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class TransferRequest {
    @NotBlank(message = "Source account ID is required.")
    private String fromAccountId;

    @NotBlank(message = "Destination account ID is required.")
    private String toAccountId;

    @NotNull(message = "Transfer amount is required.")
    @DecimalMin(value = "0.01", message = "Transfer amount must be greater than zero.")
    private BigDecimal amount;

    public TransferRequest() {
    }

    public String getFromAccountId() {
        return fromAccountId;
    }

    public void setFromAccountId(String fromAccountId) {
        this.fromAccountId = fromAccountId;
    }

    public String getToAccountId() {
        return toAccountId;
    }

    public void setToAccountId(String toAccountId) {
        this.toAccountId = toAccountId;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
