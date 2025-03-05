package com.example.cs1530.dto.Auth;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Request object for updating user profile
 */
public class UpdateUserRequest {
    @Schema(description = "Updated name for the user")
    private String name;

    @Schema(description = "Updated email address for the user")
    private String email;

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }
}
