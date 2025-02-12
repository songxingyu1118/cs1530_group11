package com.example.cs1530.controller;

import com.example.cs1530.dto.Auth.LoginRequest;
import com.example.cs1530.dto.Auth.RegisterRequest;
import com.example.cs1530.entity.User;
import com.example.cs1530.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(request.getPassword());

        User createdUser = userService.createUser(user);
        createdUser.setPasswordHash(null);
        return ResponseEntity.ok(createdUser);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            User user = userService.getUserByEmail(request.getEmail());

            if (!userService.validatePassword(request.getPassword(), user.getPasswordHash())) {
                return ResponseEntity.badRequest().body("Invalid credentials");
            }

            return ResponseEntity.ok("Login successful");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Invalid credentials");
        }
    }

}