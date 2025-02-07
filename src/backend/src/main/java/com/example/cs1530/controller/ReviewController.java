package com.example.cs1530.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cs1530.dto.review.CreateReviewRequest;
import com.example.cs1530.dto.review.ReviewDto;
import com.example.cs1530.entity.Review;
import com.example.cs1530.service.ReviewService;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {
    @Autowired
    private ReviewService reviewService;

    @PostMapping
    public ResponseEntity<ReviewDto> createReview(CreateReviewRequest request) {
        Review savedReview = reviewService.saveReview(request.getContent(), request.getStars(),
                request.getMenuItemId());
        return ResponseEntity.ok(savedReview.toDto());
    }
}