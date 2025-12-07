package com.example.edumanager.dto;

import java.util.Set;

/**
 * DTO for login response.
 * Contains JWT token and user information.
 */
public class LoginResponse {

    private String token;
    private String type = "Bearer";
    private String username;
    private Set<String> roles;

    // Default constructor
    public LoginResponse() {
    }

    // Constructor with fields
    public LoginResponse(String token, String username, Set<String> roles) {
        this.token = token;
        this.username = username;
        this.roles = roles;
    }

    // Getters and Setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Set<String> getRoles() {
        return roles;
    }

    public void setRoles(Set<String> roles) {
        this.roles = roles;
    }
}

