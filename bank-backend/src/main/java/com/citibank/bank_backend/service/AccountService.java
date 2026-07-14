package com.citibank.bank_backend.service;

import java.math.BigDecimal;
import java.util.List;

import org.apache.tomcat.websocket.TransformationResult;
import org.springframework.stereotype.Service;

import com.citibank.bank_backend.dto.CreateAccountRequest;
import com.citibank.bank_backend.dto.TransferRequest;
import com.citibank.bank_backend.model.Account;
import com.citibank.bank_backend.repository.AccountRepository;
import com.citibank.bank_backend.repository.CustomerRepository;
import com.citibank.bank_backend.model.Transaction;
import com.citibank.bank_backend.model.TransactionType;
import com.citibank.bank_backend.repository.TransactionRepository;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;

    public AccountService(
            AccountRepository accountRepository,
            CustomerRepository customerRepository,
            TransactionRepository transactionRepository
    ) {
        this.accountRepository = accountRepository;
        this.customerRepository = customerRepository;
        this.transactionRepository = transactionRepository;
    }

    public Account createAccount(
            CreateAccountRequest request
    ) {

        if (request.getCustomerId() == null
                || request.getCustomerId().isBlank()) {
            throw new IllegalArgumentException(
                    "Customer ID is required."
            );
        }

        if (!customerRepository.existsById(
                request.getCustomerId()
        )) {
            throw new IllegalArgumentException(
                    "Customer was not found."
            );
        }

        if (request.getAccountType() == null) {
            throw new IllegalArgumentException(
                    "Account type is required."
            );
        }

        BigDecimal startingBalance =
                request.getStartingBalance();

        if (startingBalance == null) {
            startingBalance = BigDecimal.ZERO;
        }

        if (startingBalance.compareTo(
                BigDecimal.ZERO
        ) < 0) {
            throw new IllegalArgumentException(
                    "Starting balance cannot be negative."
            );
        }

        Account account = new Account(
                request.getCustomerId(),
                request.getAccountType(),
                startingBalance
        );

        return accountRepository.save(account);
    }

    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    public Account getAccountById(String accountId) {
        return accountRepository.findById(accountId)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Account was not found."
                        )
                );
    }

    public List<Account> getAccountsByCustomerId(
            String customerId
    ) {

        if (!customerRepository.existsById(customerId)) {
            throw new IllegalArgumentException(
                    "Customer was not found."
            );
        }

        return accountRepository.findByCustomerId(
                customerId
        );
    }

    public Account deposit(String accountId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Deposit amount must be greater than zero.");
        }

        Account account = accountRepository
                    .findById(accountId)
                    .orElseThrow(
                            () -> new IllegalArgumentException("Account was not found.")
                    );
        
        BigDecimal newBalance = account.getBalance().add(amount);

        account.setBalance(newBalance);

        Account savedAccount = accountRepository.save(account);

        Transaction transaction = new Transaction(
            savedAccount.getId(), 
            TransactionType.DEPOSIT, 
            amount, 
            savedAccount.getBalance()
        );

        transactionRepository.save(transaction);

        return savedAccount;
    }

    public Account withdraw(String accountId, BigDecimal amount) {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Withdrawal amount must be greater than zero.");
        }

        Account account = accountRepository
                    .findById(accountId)
                    .orElseThrow(
                            () -> new IllegalArgumentException("Account was not found.")
                    );

        if (amount.compareTo(account.getBalance()) > 0) {
            throw new IllegalArgumentException("Insuffient funds.");
        }

        BigDecimal newBalance = account.getBalance().subtract(amount);

        account.setBalance(newBalance);

        Account savedAccount = accountRepository.save(account);

        Transaction transaction = new Transaction(
            savedAccount.getId(),
            TransactionType.WITHDRAWAL,
            amount,
            savedAccount.getBalance()
        );

        transactionRepository.save(transaction);

        return savedAccount;
    }

    public List<Transaction> getTransactions(
        String accountId
    ) {
        if (!accountRepository.existsById(accountId)) {
            throw new IllegalArgumentException("Account was not found.");
        }

        return transactionRepository
                    .findByAccountIdOrderByCreatedAtDesc(accountId);
    }

    public void transfer(TransferRequest request) {

    if (request.getAmount() == null
            || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
        throw new IllegalArgumentException(
                "Transfer amount must be greater than zero."
        );
    }

    Account fromAccount = accountRepository
            .findById(request.getFromAccountId())
            .orElseThrow(() ->
                    new IllegalArgumentException("Source account not found."));

    Account toAccount = accountRepository
            .findById(request.getToAccountId())
            .orElseThrow(() ->
                    new IllegalArgumentException("Destination account not found."));

    if (fromAccount.getId().equals(toAccount.getId())) {
        throw new IllegalArgumentException(
                "Cannot transfer to the same account."
        );
    }

    if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
        throw new IllegalArgumentException(
                "Insufficient funds."
        );
    }

    fromAccount.setBalance(
            fromAccount.getBalance().subtract(request.getAmount()));

    toAccount.setBalance(
            toAccount.getBalance().add(request.getAmount()));

    accountRepository.save(fromAccount);
    accountRepository.save(toAccount);

    transactionRepository.save(
            new Transaction(
                    fromAccount.getId(),
                    TransactionType.TRANSFER_OUT,
                    request.getAmount(),
                    fromAccount.getBalance()));

    transactionRepository.save(
            new Transaction(
                    toAccount.getId(),
                    TransactionType.TRANSFER_IN,
                    request.getAmount(),
                    toAccount.getBalance()));
    }
}

