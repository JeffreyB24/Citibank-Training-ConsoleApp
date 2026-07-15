package com.citibank.bank_backend.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;

import com.citibank.bank_backend.dto.CreateAccountRequest;
import com.citibank.bank_backend.model.Account;
import com.citibank.bank_backend.service.AccountService;
import com.citibank.bank_backend.dto.AmountRequest;
import com.citibank.bank_backend.model.Transaction;
import com.citibank.bank_backend.dto.TransferRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/accounts")
public class AccountController {

    private final AccountService accountService;

    public AccountController(
            AccountService accountService
    ) {
        this.accountService = accountService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Account createAccount(
            @Valid @RequestBody CreateAccountRequest request
    ) {
        return accountService.createAccount(request);
    }

    @GetMapping
    public List<Account> getAllAccounts() {
        return accountService.getAllAccounts();
    }

    @GetMapping("/{accountId}")
    public Account getAccountById(
            @PathVariable String accountId
    ) {
        return accountService.getAccountById(accountId);
    }

    @GetMapping("/customer/{customerId}")
    public List<Account> getAccountsByCustomerId(
            @PathVariable String customerId
    ) {
        return accountService.getAccountsByCustomerId(
                customerId
        );
    }

    @PostMapping("/{accountId}/deposit")
    public Account deposit(@PathVariable String accountId, @Valid @RequestBody AmountRequest request) {
        return accountService.deposit(accountId, request.getAmount());
    }

    @PostMapping("/{accountId}/withdraw")
    public Account withdraw(@PathVariable String accountId, @Valid @RequestBody AmountRequest request) {
        return accountService.withdraw(accountId, request.getAmount());
    }

    @GetMapping("/{accountId}/transactions")
    public List<Transaction> getTransactions(@PathVariable String accountId) {
        return accountService.getTransactions(accountId);
    }

    @PostMapping("/transfer")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void transfer(@Valid @RequestBody TransferRequest request) {
        accountService.transfer(request);
    }

    @DeleteMapping("/{accountId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAccount(
        @PathVariable String accountId
    ) {
        accountService.deleteAccount(accountId);
    }
}
