package com.citibank.bank_backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.citibank.bank_backend.model.Customer;
import com.citibank.bank_backend.repository.CustomerRepository;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(
            CustomerRepository customerRepository
    ) {
        this.customerRepository = customerRepository;
    }

    public Customer createCustomer(Customer customer) {

        if (customerRepository.existsByUsername(
                customer.getUsername()
        )) {
            throw new IllegalArgumentException(
                    "Username already exists."
            );
        }

        return customerRepository.save(customer);
    }

    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    public Customer getCustomerById(String id) {
        return customerRepository.findById(id)
                .orElseThrow(
                        () -> new IllegalArgumentException(
                                "Customer not found."
                        )
                );
    }
}
