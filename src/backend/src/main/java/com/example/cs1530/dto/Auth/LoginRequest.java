package com.example.cs1530.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Request object for user login
 */
public class LoginRequest {
    @Schema(description = "User email for authentication", required = true)
    private String email;

    @Schema(description = "User password", required = true)
    private String password;

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }
}

