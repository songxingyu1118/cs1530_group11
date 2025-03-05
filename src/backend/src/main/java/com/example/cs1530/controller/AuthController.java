package com.example.cs1530.controller;

import com.example.cs1530.dto.Auth.*;
import com.example.cs1530.entity.User;
import com.example.cs1530.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
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

    @GetMapping("/users/me")
    public ResponseEntity<UserDto> getCurrentUser(@RequestParam(required = false) String token) {
        User user = authService.getCurrentUser(token);
        return ResponseEntity.ok(user.toDto());
    }

    @PutMapping("/users/me")
    public ResponseEntity<UserDto> updateCurrentUser(
            @RequestBody UpdateUserRequest request,
            @RequestParam(required = false) String token
    ) {
        User updatedUser = authService.updateUser(
                request.getName(),
                request.getEmail(),
                token
        );
        return ResponseEntity.ok(updatedUser.toDto());
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<UserDto> getUserById(
            @PathVariable Long id,
            @RequestParam(required = false) String token
    ) {
        User user = authService.getUserById(id, token);
        return ResponseEntity.ok(user.toDto());
    }
}