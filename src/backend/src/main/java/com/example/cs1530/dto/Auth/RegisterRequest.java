package com.example.cs1530.dto.Auth;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Request object for user registration
 */
public class RegisterRequest {
    @Schema(description = "User email address", required = true)
    private String email;

    @Schema(description = "User password", required = true)
    private String password;

    @Schema(description = "User full name", required = true)
    private String name;

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getName() {
        return name;
    }
}
