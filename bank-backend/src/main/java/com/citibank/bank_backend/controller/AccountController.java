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
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import com.citibank.bank_backend.dto.CreateAccountRequest;
import com.citibank.bank_backend.model.Account;
import com.citibank.bank_backend.service.AccountService;
import com.citibank.bank_backend.dto.AmountRequest;
import com.citibank.bank_backend.model.Transaction;
import com.citibank.bank_backend.dto.TransferRequest;
import com.citibank.bank_backend.model.Role;

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

    @GetMapping("/me")
    public List<Account> getMyAccounts(
        Authentication authentication
    ) {
        return accountService.getAccountsByCustomerId(getLoggedInCustomerId(authentication));
    }

    @GetMapping("/{accountId}")
    public Account getAccountById(
            @PathVariable String accountId, Authentication authentication
    ) {
        return accountService.getAuthorizedAccountById(
            accountId,
            getLoggedInCustomerId(authentication),
            getLoggedInRole(authentication)
        );
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
    public Account withdraw(@PathVariable String accountId, @Valid @RequestBody AmountRequest request, Authentication authentication) {
        return accountService.withdrawAuthorized(
            accountId, 
            request.getAmount(),
            getLoggedInCustomerId(authentication),
            getLoggedInRole(authentication)
        );
    }

    @GetMapping("/{accountId}/transactions")
    public List<Transaction> getTransactions(@PathVariable String accountId, Authentication authentication) {
        return accountService.getAuthorizedTransactions(
            accountId,
            getLoggedInCustomerId(authentication),
            getLoggedInRole(authentication)
        );
    }

    @PostMapping("/transfer")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void transfer(@Valid @RequestBody TransferRequest request, Authentication authentication) {
        accountService.transferAuthorized(
            request,
            getLoggedInCustomerId(authentication),
            getLoggedInRole(authentication));
    }

    @DeleteMapping("/{accountId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAccount(
        @PathVariable String accountId
    ) {
        accountService.deleteAccount(accountId);
    }

    private String getLoggedInCustomerId(
        Authentication authentication
    ) {
        return authentication.getDetails().toString();
    }

    private Role getLoggedInRole(
        Authentication authentication
    ) {
        String authority = authentication
            .getAuthorities()
            .stream()
            .map(GrantedAuthority::getAuthority)
            .findFirst()
            .orElseThrow(
                () -> new SecurityException(
                    "User role was not found."
                )
            );
        
        return Role.valueOf(authority.replace("ROLE_", ""));
    }
} 
