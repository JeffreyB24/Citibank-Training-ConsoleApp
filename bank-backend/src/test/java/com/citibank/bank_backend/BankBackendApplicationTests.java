package com.citibank.bank_backend;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.math.BigDecimal;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.citibank.bank_backend.dto.CreateAccountRequest;
import com.citibank.bank_backend.dto.CustomerResponse;
import com.citibank.bank_backend.dto.TransferRequest;
import com.citibank.bank_backend.model.Account;
import com.citibank.bank_backend.model.AccountType;
import com.citibank.bank_backend.model.Customer;
import com.citibank.bank_backend.repository.AccountRepository;
import com.citibank.bank_backend.repository.CustomerRepository;
import com.citibank.bank_backend.repository.TransactionRepository;
import com.citibank.bank_backend.service.AccountService;
import com.citibank.bank_backend.service.CustomerService;

@ExtendWith(MockitoExtension.class)
class BankBackendApplicationTests {

    @Mock
    private CustomerRepository customerRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private CustomerService customerService;
    private AccountService accountService;

    @BeforeEach
    void setUp() {
        customerService = new CustomerService(
                customerRepository,
				passwordEncoder,
                transactionRepository,
				accountRepository
        );

        accountService = new AccountService(
                accountRepository,
                customerRepository,
                transactionRepository
        );
    }

    @Test
    void createCustomerShouldSaveCustomer() {
        Customer customer = new Customer(
                "Jeffrey",
                "Berdeal",
                "jeff24",
                "password123"
        );

        when(customerRepository.existsByUsername("jeff24"))
                .thenReturn(false);

        when(passwordEncoder.encode("password123"))
                .thenReturn("hashed-password");

        when(customerRepository.save(any(Customer.class)))
                .thenAnswer(invocation -> {
                    Customer saved = invocation.getArgument(0);
                    saved.setId("customer-1");
                    return saved;
                });

        CustomerResponse result =
                customerService.createCustomer(customer);

        assertEquals("customer-1", result.getId());
        assertEquals("jeff24", result.getUsername());

        verify(customerRepository).save(customer);
    }

    @Test
    void createCustomerShouldRejectDuplicateUsername() {
        Customer customer = new Customer(
                "Jeffrey",
                "Berdeal",
                "jeff24",
                "password123"
        );

        when(customerRepository.existsByUsername("jeff24"))
                .thenReturn(true);

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> customerService.createCustomer(customer)
        );

        assertEquals(
                "Username already exists.",
                exception.getMessage()
        );
    }

    @Test
    void createAccountShouldSaveAccount() {
        CreateAccountRequest request =
                new CreateAccountRequest();

        request.setCustomerId("customer-1");
        request.setAccountType(AccountType.CHECKING);
        request.setStartingBalance(
                new BigDecimal("1000.00")
        );

        when(customerRepository.existsById("customer-1"))
                .thenReturn(true);

        when(accountRepository.save(any(Account.class)))
                .thenAnswer(invocation -> {
                    Account saved = invocation.getArgument(0);
                    saved.setId("account-1");
                    return saved;
                });

        Account result =
                accountService.createAccount(request);

        assertEquals("account-1", result.getId());

        assertEquals(
                new BigDecimal("1000.00"),
                result.getBalance()
        );
    }

    @Test
    void depositShouldIncreaseBalance() {
        Account account = new Account(
                "customer-1",
                AccountType.CHECKING,
                new BigDecimal("1000.00")
        );

        account.setId("account-1");

        when(accountRepository.findById("account-1"))
                .thenReturn(Optional.of(account));

        when(accountRepository.save(any(Account.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        Account result = accountService.deposit(
                "account-1",
                new BigDecimal("250.00")
        );

        assertEquals(
                new BigDecimal("1250.00"),
                result.getBalance()
        );
    }

    @Test
    void depositShouldRejectNegativeAmount() {
        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> accountService.deposit(
                        "account-1",
                        new BigDecimal("-50.00")
                )
        );

        assertEquals(
                "Deposit amount must be greater than zero.",
                exception.getMessage()
        );
    }

    @Test
    void withdrawShouldDecreaseBalance() {
        Account account = new Account(
                "customer-1",
                AccountType.SAVINGS,
                new BigDecimal("1000.00")
        );

        account.setId("account-1");

        when(accountRepository.findById("account-1"))
                .thenReturn(Optional.of(account));

        when(accountRepository.save(any(Account.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        Account result = accountService.withdraw(
                "account-1",
                new BigDecimal("200.00")
        );

        assertEquals(
                new BigDecimal("800.00"),
                result.getBalance()
        );
    }

    @Test
    void withdrawShouldRejectInsufficientFunds() {
        Account account = new Account(
                "customer-1",
                AccountType.CHECKING,
                new BigDecimal("100.00")
        );

        account.setId("account-1");

        when(accountRepository.findById("account-1"))
                .thenReturn(Optional.of(account));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> accountService.withdraw(
                        "account-1",
                        new BigDecimal("500.00")
                )
        );

        assertEquals(
                "Insufficient funds.",
                exception.getMessage()
        );
    }

    @Test
    void transferShouldMoveMoneyBetweenAccounts() {
        Account source = new Account(
                "customer-1",
                AccountType.CHECKING,
                new BigDecimal("1000.00")
        );

        source.setId("source-1");

        Account destination = new Account(
                "customer-1",
                AccountType.SAVINGS,
                new BigDecimal("500.00")
        );

        destination.setId("destination-1");

        TransferRequest request =
                new TransferRequest();

        request.setFromAccountId("source-1");
        request.setToAccountId("destination-1");
        request.setAmount(
                new BigDecimal("300.00")
        );

        when(accountRepository.findById("source-1"))
                .thenReturn(Optional.of(source));

        when(accountRepository.findById("destination-1"))
                .thenReturn(Optional.of(destination));

        when(accountRepository.save(any(Account.class)))
                .thenAnswer(invocation ->
                        invocation.getArgument(0)
                );

        accountService.transfer(request);

        assertEquals(
                new BigDecimal("700.00"),
                source.getBalance()
        );

        assertEquals(
                new BigDecimal("800.00"),
                destination.getBalance()
        );
    }

    @Test
    void transferShouldRejectSameAccount() {
        Account account = new Account(
                "customer-1",
                AccountType.CHECKING,
                new BigDecimal("1000.00")
        );

        account.setId("account-1");

        TransferRequest request =
                new TransferRequest();

        request.setFromAccountId("account-1");
        request.setToAccountId("account-1");
        request.setAmount(
                new BigDecimal("100.00")
        );

        when(accountRepository.findById("account-1"))
                .thenReturn(Optional.of(account));

        IllegalArgumentException exception = assertThrows(
                IllegalArgumentException.class,
                () -> accountService.transfer(request)
        );

        assertEquals(
                "Cannot transfer to the same account.",
                exception.getMessage()
        );
    }
}
