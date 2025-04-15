package com.example.cs1530.controller;

import com.example.cs1530.dto.Auth.*;
import com.example.cs1530.dto.Auth.EncryptedLoginRequest;
import com.example.cs1530.entity.User;
import com.example.cs1530.security.SecurityManager;
import com.example.cs1530.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Authentication", description = "Authentication and User Management API")
public class AuthController {
    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @Autowired
    private AuthService authService;

    @Autowired
    private SecurityManager securityManager;

    @Autowired
    private ObjectMapper objectMapper;

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
            summary = "Secure login with ECDH encryption",
            description = "Authenticate using AES-GCM encrypted credentials (requires prior ECDH handshake)",
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
            ),
            @ApiResponse(
                    responseCode = "400",
                    description = "Invalid session or encryption error"
            )
    })
    @PostMapping("/login")
    public ResponseEntity<?> loginSecure(@RequestBody EncryptedLoginRequest request) {
        try {
            // Verify session is valid
            if (!securityManager.isSessionValid(request.getSessionId())) {
                logger.warn("Invalid or expired session: {}", request.getSessionId());
                return ResponseEntity.status(400)
                        .body(Map.of("error", "invalid_session", "message", "Session expired or invalid"));
            }
            // Decrypt the credentials
            String decryptedData = securityManager.decrypt(request.getSessionId(), request.getEncryptedCredentials());
            // Parse the JSON credentials
            LoginRequest loginRequest = objectMapper.readValue(decryptedData, LoginRequest.class);
            try {
                // Authenticate user
                String token = authService.loginUser(loginRequest.getEmail(), loginRequest.getPassword());
                // Encrypt the token
                String encryptedToken = securityManager.encrypt(request.getSessionId(), token);
                // Return the encrypted token
                return ResponseEntity.ok(new LoginResponse(encryptedToken));
            } catch (RuntimeException e) {
                //invalid email/password
                logger.warn("Authentication failed: {}", e.getMessage());
                return ResponseEntity.status(401)
                        .body(Map.of("error", "invalid_credentials", "message", "Invalid email or password"));
            }
        } catch (Exception e) {
            logger.error("Secure login failed: {}", e.getMessage(), e);
            return ResponseEntity.status(400)
                    .body(Map.of("error", "encryption_error", "message", "Error processing encrypted request"));
        }
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


    @Operation(
            summary = "Check if user is admin",
            description = "Verifies if the current user has admin privileges",
            tags = {"Authentication"}
    )
    @ApiResponses(value = {
            @ApiResponse(
                    responseCode = "200",
                    description = "Admin status checked successfully"
            ),
            @ApiResponse(
                    responseCode = "401",
                    description = "Not authenticated"
            )
    })
    @GetMapping("/users/isAdmin")
    public ResponseEntity<?> checkIfAdmin(
            @RequestParam(required = false) String token,
            @RequestBody(required = false) EncryptedRequestDto encryptedRequest) {
        try {
            // Check if this is an encrypted request
            if (encryptedRequest != null && encryptedRequest.getSessionId() != null) {
                // Verify session is valid
                if (!securityManager.isSessionValid(encryptedRequest.getSessionId())) {
                    logger.warn("Invalid or expired session: {}", encryptedRequest.getSessionId());
                    return ResponseEntity.badRequest().build();
                }
                // Decrypt the token
                String decryptedToken = null;
                if (encryptedRequest.getEncryptedData() != null) {
                    decryptedToken = securityManager.decrypt(
                            encryptedRequest.getSessionId(),
                            encryptedRequest.getEncryptedData());
                }
                // Get the current user
                User user = authService.getCurrentUser(decryptedToken);
                // Encrypt and return the admin status
                String adminStatus = objectMapper.writeValueAsString(Map.of("isAdmin", user.isAdmin()));
                String encryptedData = securityManager.encrypt(
                        encryptedRequest.getSessionId(),
                        adminStatus);
                // Return encrypted response
                return ResponseEntity.ok(new EncryptedResponseDto(encryptedData));
            } else {
                // Handle as regular non-encrypted request
                User user = authService.getCurrentUser(token);
                return ResponseEntity.ok(Map.of("isAdmin", user.isAdmin()));
            }
        } catch (Exception e) {
            logger.error("Check admin status failed: {}", e.getMessage(), e);
            return ResponseEntity.status(401).body(Map.of("isAdmin", false, "error", e.getMessage()));
        }
    }

    // =============== User Management Endpoints ===============
    @GetMapping("/users/me")
    public ResponseEntity<?> getCurrentUser(
            @RequestParam(required = false) String token,
            @RequestBody(required = false) EncryptedRequestDto encryptedRequest) {
        try {
            // Check if this is an encrypted request
            if (encryptedRequest != null && encryptedRequest.getSessionId() != null) {
                // Verify session is valid
                if (!securityManager.isSessionValid(encryptedRequest.getSessionId())) {
                    logger.warn("Invalid or expired session: {}", encryptedRequest.getSessionId());
                    return ResponseEntity.badRequest().build();
                }
                // Decrypt the token if provided in encryptedData
                String decryptedToken = null;
                if (encryptedRequest.getEncryptedData() != null) {
                    decryptedToken = securityManager.decrypt(
                            encryptedRequest.getSessionId(),
                            encryptedRequest.getEncryptedData());
                }
                // Get the current user
                User user = authService.getCurrentUser(decryptedToken);
                // Convert to DTO and then to JSON
                String userData = objectMapper.writeValueAsString(user.toDto());
                // Encrypt the user data
                String encryptedData = securityManager.encrypt(
                        encryptedRequest.getSessionId(),
                        userData);
                // Return encrypted response
                return ResponseEntity.ok(new EncryptedResponseDto(encryptedData));
            } else {
                // Handle as regular non-encrypted request
                User user = authService.getCurrentUser(token);
                return ResponseEntity.ok(user.toDto());
            }
        } catch (Exception e) {
            logger.error("Get current user failed: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/users/me")
    public ResponseEntity<?> updateCurrentUser(
            @RequestBody(required = false) UpdateUserRequest plainRequest,
            @RequestBody(required = false) EncryptedRequestDto encryptedRequest,
            @RequestParam(required = false) String token) {
        try {
            // Check if this is an encrypted request
            if (encryptedRequest != null && encryptedRequest.getSessionId() != null) {
                // Verify session is valid
                if (!securityManager.isSessionValid(encryptedRequest.getSessionId())) {
                    logger.warn("Invalid or expired session: {}", encryptedRequest.getSessionId());
                    return ResponseEntity.badRequest().build();
                }
                // Decrypt the request data
                String decryptedData = securityManager.decrypt(
                        encryptedRequest.getSessionId(),
                        encryptedRequest.getEncryptedData());
                // Parse as a combined object containing user data and token
                UpdateUserEncryptedData updateData = objectMapper.readValue(
                        decryptedData,
                        UpdateUserEncryptedData.class);
                // Update the user
                User updatedUser = authService.updateUser(
                        updateData.getName(),
                        updateData.getEmail(),
                        updateData.getToken()
                );
                // Convert to DTO and then to JSON
                String userData = objectMapper.writeValueAsString(updatedUser.toDto());
                // Encrypt the user data
                String encryptedData = securityManager.encrypt(
                        encryptedRequest.getSessionId(),
                        userData);
                // Return encrypted response
                return ResponseEntity.ok(new EncryptedResponseDto(encryptedData));
            } else {
                // Handle as regular non-encrypted request
                User updatedUser = authService.updateUser(
                        plainRequest.getName(),
                        plainRequest.getEmail(),
                        token
                );
                return ResponseEntity.ok(updatedUser.toDto());
            }
        } catch (Exception e) {
            logger.error("Update current user failed: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/users/{id}")
    public ResponseEntity<?> getUserById(
            @PathVariable Long id,
            @RequestParam(required = false) String token,
            @RequestBody(required = false) EncryptedRequestDto encryptedRequest) {
        try {
            // Check if this is an encrypted request
            if (encryptedRequest != null && encryptedRequest.getSessionId() != null) {
                // Verify session is valid
                if (!securityManager.isSessionValid(encryptedRequest.getSessionId())) {
                    logger.warn("Invalid or expired session: {}", encryptedRequest.getSessionId());
                    return ResponseEntity.badRequest().build();
                }
                // Decrypt the token if provided in encryptedData
                String decryptedToken = null;
                if (encryptedRequest.getEncryptedData() != null) {
                    decryptedToken = securityManager.decrypt(
                            encryptedRequest.getSessionId(),
                            encryptedRequest.getEncryptedData());
                }
                // Get the user by ID
                User user = authService.getUserById(id, decryptedToken);

                // Convert to DTO and then to JSON
                String userData = objectMapper.writeValueAsString(user.toDto());

                // Encrypt the user data
                String encryptedData = securityManager.encrypt(
                        encryptedRequest.getSessionId(),
                        userData);
                // Return encrypted response
                return ResponseEntity.ok(new EncryptedResponseDto(encryptedData));
            } else {
                // Handle as regular non-encrypted request
                User user = authService.getUserById(id, token);
                return ResponseEntity.ok(user.toDto());
            }
        } catch (Exception e) {
            logger.error("Get user by ID failed: {}", e.getMessage(), e);
            return ResponseEntity.badRequest().build();
        }
    }
}