package com.example.cs1530.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

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

    public Review saveReview(String content, Integer stars, Long menuItemId) {
        Review review = new Review();
        review.setContent(content);
        review.setStars(stars);
        review.setMenuItem(menuItemService.getMenuItemById(menuItemId));
        return reviewRepository.save(review);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    public List<Review> getReviewsByMenuItemId(Long menuItemId) {
        return reviewRepository.findByMenuItemId(menuItemId);
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