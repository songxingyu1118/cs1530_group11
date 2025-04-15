package com.example.cs1530.dto.Auth;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * DTO for encrypted update user requests that includes token
 */
public class UpdateUserEncryptedData {
    @Schema(description = "Updated name for the user")
    private String name;

    @Schema(description = "Updated email address for the user")
    private String email;

    @Schema(description = "Authentication token")
    private String token;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}