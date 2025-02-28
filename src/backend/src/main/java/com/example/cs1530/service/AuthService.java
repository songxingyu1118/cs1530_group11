package com.example.cs1530.service;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.cs1530.entity.User;
import com.example.cs1530.repository.UserRepository;
import com.example.cs1530.security.JwtTokenProvider;

import jakarta.persistence.EntityNotFoundException;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    // =============== Authentication Methods ===============

    /**
     * Register a new user with the given credentials
     */
    public User registerUser(String email, String password, String name) {
        // Check if user already exists
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("User with email " + email + " already exists");
        }

        User user = new User();
        user.setEmail(email);
        user.setPasswordHash(passwordEncoder.encode(password));
        user.setName(name);
        user.setAdmin(false); // Default value

        return userRepository.save(user);
    }

    /**
     * Authenticate a user and return a JWT token
     */
    public String loginUser(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        // For development only - remove in production!
        boolean passwordMatches = true; // passwordEncoder.matches(password, user.getPasswordHash());

        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password");
        }

        return tokenProvider.generateToken(user);
    }

    /**
     * Logout the current user (invalidate token)
     */
    public void logoutUser() {
        // In a stateless JWT implementation, this might add the current token
        // to a blacklist or implement token invalidation
        // For simplicity, we'll leave this empty as token invalidation
        // would be handled on the client side
    }

    // =============== User Management Methods ===============
    /**
     * Get the currently authenticated user from the token parameter
     */
    public User getCurrentUser(String token) {
        if (token == null || token.isEmpty()) {
            throw new RuntimeException("No authentication token provided");
        }

        // Validate and extract user email from token
        String email = tokenProvider.getUserEmailFromToken(token);
        if (email == null) {
            throw new RuntimeException("Invalid token");
        }

        // Find the user by email
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
    }

    /**
     * Update the current user's profile
     */
    public User updateUser(String name, String email, String token) {
        User currentUser = getCurrentUser(token);

        // Check if new email is already taken by another user
        if (!currentUser.getEmail().equals(email) && userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email is already in use");
        }

        // Update user fields
        currentUser.setName(name);
        currentUser.setEmail(email);

        return userRepository.save(currentUser);
    }

    /**
     * Get a user by ID
     */
    public User getUserById(Long id, String token) {
        // Optionally verify the token first
        getCurrentUser(token);

        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + id));
    }
}