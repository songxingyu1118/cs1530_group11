package com.example.cs1530.entity;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import com.example.cs1530.dto.Auth.UserDto;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique integer identifier of the user")
    private Long id;

    @NotNull
    @Email
    @Column(nullable = false, unique = true)
    @Schema(description = "Unique email address of the user")
    private String email;

    @Column(name = "password_hash", nullable = false, length = 60) // BCrypt hash length
    @Schema(description = "BCrypt hash of the user's password")
    private String passwordHash;

    @Column(nullable = false)
    @Schema(description = "Name of the user")
    private String name;

    @Column(name = "is_admin")
    @Schema(description = "Flag indicating if the user is an admin")
    private boolean isAdmin = false;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL)
    @Schema(description = "Set of reviews created by the user")
    private Set<Review> reviews = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at")
    @Schema(description = "Datetime when the user was created")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @Schema(description = "Datetime when the user was last updated")
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isAdmin() {
        return isAdmin;
    }

    public void setAdmin(boolean admin) {
        isAdmin = admin;
    }

    public Set<Review> getReviews() {
        return reviews;
    }

    public void setReviews(Set<Review> reviews) {
        this.reviews = reviews;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    /**
     * Convert this User entity to its DTO representation
     * @return The DTO representation
     */
    public UserDto toDto() {
        return new UserDto(this);
    }
}