package com.citibank.bank_backend.dto;

import com.citibank.bank_backend.model.Role;

public class LoginResponse {
    
    private String token;
    private String customerId;
    private String username;
    private Role role;

    public LoginResponse(String token, String customerId, String username, Role role) {
        this.token = token;
        this.customerId = customerId;
        this.username = username;
        this.role = role;
    }

    public String getToken() {
        return token;
    }

    public String getCustomerId() {
        return customerId;
    }

    public String getUsername() {
        return username;
    }

    public Role getRole() {
        return role;
    }
}
