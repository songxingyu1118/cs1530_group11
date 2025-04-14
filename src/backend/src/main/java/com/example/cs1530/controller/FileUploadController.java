package com.example.cs1530.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.example.cs1530.entity.User;
import com.example.cs1530.service.AuthService;
import com.example.cs1530.service.FileStorageService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/upload")
@CrossOrigin(origins = "*")
@Tag(name = "File Upload", description = "API for uploading files")
public class FileUploadController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private AuthService authService;

    /**
     * Helper method to validate admin authentication
     */
    private void validateAdminAuth(String token) {
        if (token == null || token.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required");
        }

        User currentUser = authService.getCurrentUser(token);
        if (!currentUser.isAdmin()) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin privileges required");
        }
    }

    @Operation(summary = "Upload a file", description = "Uploads a file and returns the file path")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "File uploaded successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid file"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "403", description = "Forbidden - Admin access required"),
            @ApiResponse(responseCode = "500", description = "Server error")
    })
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadFile(
            @Parameter(description = "File to upload", required = true) @RequestParam("file") MultipartFile file,
            @Parameter(description = "Authentication token", required = true) @RequestParam("token") String token) {

        try {
            // Validate admin authentication
            validateAdminAuth(token);
            // Store the file
            String filePath = fileStorageService.storeFile(file);
            // Return the file path
            return ResponseEntity.ok(Map.of("imagePath", filePath));
        } catch (ResponseStatusException e) {
            // Pass through status exceptions
            throw e;
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error uploading file: " + e.getMessage(), e);
        }
    }
}