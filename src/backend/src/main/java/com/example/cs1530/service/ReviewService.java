package com.example.cs1530.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import com.example.cs1530.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.cs1530.entity.Review;
import com.example.cs1530.repository.ReviewRepository;

@Service
public class ReviewService {
    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MenuItemService menuItemService;

    @Autowired
    private UserRepository userRepository; //for user validation

    /**
     * Save a new review with optional user ID
     */
    public Review saveReview(String content, Integer stars, Long menuItemId, Long userId) {
        Review review = new Review();
        review.setContent(content);
        review.setStars(stars);
        review.setMenuItem(menuItemService.getMenuItem(menuItemId));

        // Set user if userId is provided
        if (userId != null) {
            // Optional: Validate that user exists
            userRepository.findById(userId)
                    .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));
            review.setUser(userRepository.getReferenceById(userId));
        }

        return reviewRepository.save(review);
    }

    public List<Review> getReviewsByMenuItemId(Long menuItemId) {
        return reviewRepository.findByMenuItemId(menuItemId);
    }

    public List<Review> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserId(userId);
    }

    public Double getAverageRatingForMenuItem(Long menuItemId) {
        List<Review> reviews = getReviewsByMenuItemId(menuItemId);
        if (reviews.isEmpty()) {
            return 0.0;
        }

        Double sum = reviews.stream()
                .mapToDouble(Review::getStars)
                .sum();
        return sum / reviews.size();
    }

    public Integer getReviewCountForMenuItem(Long menuItemId) {
        return getReviewsByMenuItemId(menuItemId).size();
    }

    public Review updateReview(Long id, Review updatedReview) {
        Optional<Review> existingReview = reviewRepository.findById(id);

        if (existingReview.isPresent()) {
            Review review = existingReview.get();
            review.setStars(updatedReview.getStars());
            review.setContent(updatedReview.getContent());
            review.setUpdatedAt(LocalDateTime.now());
            return reviewRepository.save(review);
        } else {
            throw new RuntimeException("Review not found with id: " + id);
        }
    }

    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new RuntimeException("Review not found with id: " + id);
        }
        reviewRepository.deleteById(id);
    }

    public Review getReviewById(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + id));
    }
}