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
    }
}