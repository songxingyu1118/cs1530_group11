package com.example.cs1530.controller;

import java.util.List;

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

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
@Tag(name = "Review Management", description = "APIs for managing menu item reviews")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @Operation(summary = "Create a new review", description = "Creates a new review for a menu item")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Review created successfully", content = @Content(schema = @Schema(implementation = ReviewDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "404", description = "Menu item not found"),
            @ApiResponse(responseCode = "500", description = "Server error")
    })
    @PostMapping("/")
    public ResponseEntity<ReviewDto> createReview(@Valid @RequestBody CreateReviewRequest request) {
        try {
            Review savedReview = reviewService.saveReview(request.getContent(), request.getStars(),
                    request.getMenuItemId());
            return ResponseEntity.ok(savedReview.toDto());
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
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
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
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
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
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
                    .map(Review::toDto)
                    .toList();
            return ResponseEntity.ok(reviews);
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
                    .map(Review::toDto)
                    .toList();
            return ResponseEntity.ok(reviews);
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
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error retrieving statistics: " + e.getMessage(), e);
        }
    }
}