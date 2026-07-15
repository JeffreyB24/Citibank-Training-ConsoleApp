package com.citibank.bank_backend.dto;

import com.citibank.bank_backend.model.Customer;

public class CustomerResponse {

    private String id;
    private String firstName;
    private String lastName;
    private String username;

    public CustomerResponse(Customer customer) {
        this.id = customer.getId();
        this.firstName = customer.getFirstName();
        this.lastName = customer.getLastName();
        this.username = customer.getUsername();
    }
    
    public String getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getUsername() {
        return username;
    }
}
