package com.example.cs1530.dto.Auth;

import java.time.LocalDateTime;

import com.example.cs1530.entity.User;

import io.swagger.v3.oas.annotations.media.Schema;

/**
 * Data Transfer Object for User entities
 */
public class UserDto {
    @Schema(description = "Unique identifier of the user")
    private Long id;

    @Schema(description = "Email address of the user")
    private String email;

    @Schema(description = "Full name of the user")
    private String name;

    @Schema(description = "Whether the user has admin privileges")
    private boolean isAdmin;

    @Schema(description = "When the user account was created")
    private LocalDateTime createdAt;

    @Schema(description = "When the user account was last updated")
    private LocalDateTime updatedAt;

    public UserDto(User user) {
        this.id = user.getId();
        this.email = user.getEmail();
        this.name = user.getName();
        this.isAdmin = user.isAdmin();
        this.createdAt = user.getCreatedAt();
        this.updatedAt = user.getUpdatedAt();
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getName() {
        return name;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}

