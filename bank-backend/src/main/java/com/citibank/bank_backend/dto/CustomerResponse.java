package com.citibank.bank_backend.dto;

import com.citibank.bank_backend.model.Customer;
import com.citibank.bank_backend.model.Role;

public class CustomerResponse {

    private String id;
    private String firstName;
    private String lastName;
    private String username;
    private Role role;

    public CustomerResponse(Customer customer) {
        this.id = customer.getId();
        this.firstName = customer.getFirstName();
        this.lastName = customer.getLastName();
        this.username = customer.getUsername();
        this.role = customer.getRole();
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

    public Role getRole() {
        return role;
    }
}
