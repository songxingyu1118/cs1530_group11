package com.example.cs1530.controller;

import java.util.List;

import com.example.cs1530.dto.Auth.EncryptedRequestDto;
import com.example.cs1530.dto.Auth.EncryptedResponseDto;
import com.example.cs1530.entity.User;
import com.example.cs1530.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.example.cs1530.dto.review.CreateReviewRequest;
import com.example.cs1530.dto.review.ReviewDto;
import com.example.cs1530.dto.review.ReviewStatisticDto;
import com.example.cs1530.entity.Review;
import com.example.cs1530.service.ReviewService;
import com.example.cs1530.security.SecurityManager;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;



@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
@Tag(name = "Review Management", description = "APIs for managing menu item reviews")
public class ReviewController {


    @Autowired
    private ReviewService reviewService;

    @Autowired
    private SecurityManager securityManager;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private AuthService authService;

    @Operation(summary = "Create a new review", description = "Creates a new review for a menu item")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review created successfully", content = @Content(schema = @Schema(implementation = ReviewDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "404", description = "Menu item not found"),
            @ApiResponse(responseCode = "409", description = "Constraint violation"),
            @ApiResponse(responseCode = "500", description = "Server error")
    })
    @PostMapping("/")
    public ResponseEntity<EncryptedResponseDto> createReview(@RequestBody EncryptedRequestDto request) {
        try {
            // Verify session is valid
            if (!securityManager.isSessionValid(request.getSessionId())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
            }
            // Decrypt the request data
            String decryptedData = securityManager.decrypt(request.getSessionId(), request.getEncryptedData());
            // Parse the JSON request
            CreateReviewRequest createRequest = objectMapper.readValue(decryptedData, CreateReviewRequest.class);
            // Get token from the request
            String token = createRequest.getToken();
            // Require authentication for reviews
            if (token == null || token.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new EncryptedResponseDto(
                                securityManager.encrypt(request.getSessionId(),
                                        "{\"error\":\"Authentication required to submit reviews\"}")
                        ));
            }
            // Authenticate the user
            Long userId;
            try {
                User currentUser = authService.getCurrentUser(token);
                userId = currentUser.getId();
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new EncryptedResponseDto(
                                securityManager.encrypt(request.getSessionId(),
                                        "{\"error\":\"Invalid authentication token\"}")
                        ));
            }
            // Process the review creation with user ID
            Review savedReview = reviewService.saveReview(
                    createRequest.getContent(),
                    createRequest.getStars(),
                    createRequest.getMenuItemId(),
                    userId
            );

            // Convert the review to a DTO and encrypt it for the response
            String reviewJson = objectMapper.writeValueAsString(savedReview.toDto());
            String encryptedResponse = securityManager.encrypt(request.getSessionId(), reviewJson);

            // Create and return the response
            EncryptedResponseDto responseDto = new EncryptedResponseDto(encryptedResponse);
            return ResponseEntity.ok(responseDto);
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Entity not found: " + e.getMessage(), e);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error creating review: " + e.getMessage(), e);
        }
    }

    @Operation(summary = "Get a single review by ID", description = "Retrieves a specific review")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review found", content = @Content(schema = @Schema(implementation = ReviewDto.class))),
            @ApiResponse(responseCode = "404", description = "Review not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ReviewDto> getReview(
            @Parameter(description = "ID of the review to retrieve", required = true, example = "1") @PathVariable Long id) {
        try {
            return ResponseEntity.ok(reviewService.getReviewById(id).toDto());
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found with ID: " + id, e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error retrieving review: " + e.getMessage(), e);
        }
    }

    @Operation(summary = "Delete a review by ID", description = "Removes a review from the database")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Review not found"),
            @ApiResponse(responseCode = "500", description = "Server error")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(
            @Parameter(description = "ID of the review to delete", required = true, example = "1") @PathVariable Long id) {
        try {
            reviewService.deleteReview(id);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Review not found with ID: " + id, e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error deleting review: " + e.getMessage(), e);
        }
    }

    @Operation(summary = "Get all reviews for a menu item", description = "Retrieves all reviews for a specific menu item")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved reviews", content = @Content(schema = @Schema(implementation = ReviewDto.class))),
            @ApiResponse(responseCode = "404", description = "Menu item not found"),
            @ApiResponse(responseCode = "500", description = "Server error")
    })
    @GetMapping("/menu-item/{id}")
    public ResponseEntity<List<ReviewDto>> getReviewsByMenuItem(
            @Parameter(description = "ID of the menu item to get reviews for", required = true, example = "1") @PathVariable Long id) {
        try {
            List<ReviewDto> reviews = reviewService.getReviewsByMenuItemId(id)
                    .stream()
                    .map(r -> r.toDto(true))
                    .toList();
            return ResponseEntity.ok(reviews);
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu item not found with ID: " + id, e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error retrieving reviews: " + e.getMessage(), e);
        }
    }

    @Operation(summary = "Get all reviews for a user", description = "Retrieves all reviews created by a specific user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved reviews", content = @Content(schema = @Schema(implementation = ReviewDto.class))),
            @ApiResponse(responseCode = "404", description = "User not found"),
            @ApiResponse(responseCode = "500", description = "Server error")
    })
    @GetMapping("/user/{id}")
    public ResponseEntity<List<ReviewDto>> getReviewsByUser(
            @Parameter(description = "ID of the user to get reviews for", required = true, example = "1") @PathVariable Long id) {
        try {
            List<ReviewDto> reviews = reviewService.getReviewsByUserId(id)
                    .stream()
                    .map(r -> r.toDto(true))
                    .toList();
            return ResponseEntity.ok(reviews);
        } catch (EntityNotFoundException e) { // TODO: needs to actually be implemented and thrown in the service
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found with ID: " + id, e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error retrieving reviews: " + e.getMessage(), e);
        }
    }

    @Operation(summary = "Get satatistics for a menu item", description = "Retrieves statistics for a specific menu item including average rating and number of reviews")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved statistics", content = @Content(schema = @Schema(implementation = ReviewStatisticDto.class))),
            @ApiResponse(responseCode = "404", description = "Menu item not found"),
            @ApiResponse(responseCode = "500", description = "Server error")
    })
    @GetMapping("/menu-item/{id}/statistics")
    public ResponseEntity<ReviewStatisticDto> getStatisticsForMenuItem(
            @Parameter(description = "ID of the menu item to get statistics for", required = true, example = "1") @PathVariable Long id) {
        try {
            Double averageRating = reviewService.getAverageRatingForMenuItem(id);
            Integer reviewCount = reviewService.getReviewCountForMenuItem(id);
            return ResponseEntity.ok(new ReviewStatisticDto(averageRating, reviewCount));
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu item not found with ID: " + id, e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error retrieving statistics: " + e.getMessage(), e);
        }
    }
}