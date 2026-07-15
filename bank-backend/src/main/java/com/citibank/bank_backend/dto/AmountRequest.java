package com.citibank.bank_backend.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;

public class AmountRequest {
    @NotNull(message = "Amount is required.")
    @DecimalMin(value = "0.01", message = "Amount must be greater that zero.")
    private BigDecimal amount;

    public AmountRequest() {
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
}
