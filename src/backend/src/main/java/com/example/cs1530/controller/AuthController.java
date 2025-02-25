package com.example.cs1530.controller;

import com.example.cs1530.dto.Auth.LoginResponse;
import com.example.cs1530.dto.Auth.RegisterRequest;
import com.example.cs1530.dto.Auth.UpdateUserRequest;
import com.example.cs1530.dto.Auth.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cs1530.dto.auth.LoginRequest;
import com.example.cs1530.entity.User;
import com.example.cs1530.service.AuthService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Authentication", description = "Authentication and User Management API")
public class AuthController {

    @Autowired
    private AuthService authService;

    // =============== Authentication Endpoints ===============

    @Operation(
            summary = "Register a new user",
            description = "Create a new user account with email and password",
            tags = {"Authentication"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "User registered successfully",
                    content = @Content(schema = @Schema(implementation = UserDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input data"
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "User already exists with this email"
            )
    })
    @PostMapping("/register")
    public ResponseEntity<UserDto> register(
            @Parameter(
                    description = "User registration details",
                    required = true,
                    schema = @Schema(implementation = RegisterRequest.class)
            )
            @RequestBody RegisterRequest request
    ) {
        User user = authService.registerUser(request.getEmail(), request.getPassword(), request.getName());
        return ResponseEntity.ok(user.toDto());
    }

    @Operation(
            summary = "Login user",
            description = "Authenticate user and return JSON web token",
            tags = {"Authentication"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Authentication successful",
                    content = @Content(schema = @Schema(implementation = LoginResponse.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Invalid credentials"
            )
    })
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Parameter(
                    description = "Login credentials",
                    required = true,
                    schema = @Schema(implementation = LoginRequest.class)
            )
            @RequestBody LoginRequest request
    ) {
        String token = authService.loginUser(request.getEmail(), request.getPassword());
        return ResponseEntity.ok(new LoginResponse(token));
    }

    @Operation(
            summary = "Logout user",
            description = "Clear user's auth token",
            tags = {"Authentication"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Logged out successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Not authenticated"
            )
    })
    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        authService.logoutUser();
        return ResponseEntity.ok().build();
    }

    // =============== User Management Endpoints ===============

    @Operation(
            summary = "Get current user profile",
            description = "Get current user's profile information",
            tags = {"User Management"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Profile retrieved successfully",
                    content = @Content(schema = @Schema(implementation = UserDto.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Not authenticated"
            )
    })
    @GetMapping("/users/me")
    public ResponseEntity<UserDto> getCurrentUser() {
        User user = authService.getCurrentUser();
        return ResponseEntity.ok(user.toDto());
    }

    @Operation(
            summary = "Update user profile",
            description = "Update current user's profile details",
            tags = {"User Management"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Profile updated successfully",
                    content = @Content(schema = @Schema(implementation = UserDto.class))
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid input data"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Not authenticated"
            ),
            @ApiResponse(
                    responseCode = "409",
                    description = "Email already in use by another user"
            )
    })
    @PutMapping("/users/me")
    public ResponseEntity<UserDto> updateCurrentUser(
            @Parameter(
                    description = "User profile update details",
                    required = true,
                    schema = @Schema(implementation = UpdateUserRequest.class)
            )
            @RequestBody UpdateUserRequest request
    ) {
        User updatedUser = authService.updateUser(
                request.getName(),
                request.getEmail()
        );
        return ResponseEntity.ok(updatedUser.toDto());
    }

    @Operation(
            summary = "Get user by ID",
            description = "Get a specific user's profile by ID",
            tags = {"User Management"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "User found",
                    content = @Content(schema = @Schema(implementation = UserDto.class))
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Not authenticated"
            ),
            @ApiResponse(
                    responseCode = "404",
                    description = "User not found"
            )
    })
    @GetMapping("/users/{id}")
    public ResponseEntity<UserDto> getUserById(
            @Parameter(
                    description = "ID of the user to retrieve",
                    required = true
            )
            @PathVariable Long id
    ) {
        User user = authService.getUserById(id);
        return ResponseEntity.ok(user.toDto());
    }
}