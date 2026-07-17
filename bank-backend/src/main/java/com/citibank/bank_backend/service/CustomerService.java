package com.citibank.bank_backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.citibank.bank_backend.model.Customer;
import com.citibank.bank_backend.repository.CustomerRepository;
import com.citibank.bank_backend.exception.ResourceNotFoundException;
import com.citibank.bank_backend.dto.CustomerResponse;
import com.citibank.bank_backend.model.Account;
import com.citibank.bank_backend.repository.AccountRepository;
import com.citibank.bank_backend.repository.TransactionRepository;
import com.citibank.bank_backend.model.Role;

@Service
public class CustomerService {

    private final AccountRepository accountRepository;
    private final TransactionRepository transactionRepository;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;

    public CustomerService(
            CustomerRepository customerRepository,
            PasswordEncoder passwordEncoder, 
            TransactionRepository transactionRepository, 
            AccountRepository accountRepository
    ) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.transactionRepository = transactionRepository;
        this.accountRepository = accountRepository;
    }

    public CustomerResponse createCustomer(Customer customer) {

        if (customerRepository.existsByUsername(
                customer.getUsername()
        )) {
            throw new IllegalArgumentException(
                    "Username already exists."
            );
        }

        if (customer.getPassword() == null || customer.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        String hashedPassword = passwordEncoder.encode(customer.getPassword());

        customer.setPassword(hashedPassword);
        customer.setRole(Role.CUSTOMER);

        Customer savedCustomer = customerRepository.save(customer);

        return new CustomerResponse(savedCustomer);
    }

    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll()
            .stream()
            .map(CustomerResponse::new)
            .collect(Collectors.toList());
    }

    public CustomerResponse getCustomerById(String id) {

        Customer customer = customerRepository.findById(id)
            .orElseThrow(
                () -> new ResourceNotFoundException(
                    "Customer not found."
                )
            );

        return new CustomerResponse(customer);
    }

    public void deleteCustomer(String customerId) {
        if (!customerRepository.existsById(customerId)) {
            throw new ResourceNotFoundException("Customer was not found.");
        }

        List<Account> accounts = accountRepository.findByCustomerId(customerId);

        for (Account account : accounts) {
            transactionRepository.deleteAll(
                transactionRepository.findByAccountIdOrderByCreatedAtDesc(account.getId())
            );
        }

        accountRepository.deleteAll(accounts);
        customerRepository.deleteById(customerId);
    }
}
