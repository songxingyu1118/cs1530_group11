package com.example.cs1530.dto.Auth;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Response object for successful login
 */
public class LoginResponse {
    @Schema(description = "JWT token for API authorization")
    private String token;

    public LoginResponse(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }
}
