package com.example.cs1530.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.cs1530.entity.Review;
import com.example.cs1530.repository.MenuItemRepository;
import com.example.cs1530.repository.ReviewRepository;

@Service
public class ReviewService {
    private static final Logger logger = LoggerFactory.getLogger(ReviewService.class);

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private MenuItemService menuItemService;

    @Transactional
    public Review addReview(Review review) {
        Review savedReview = reviewRepository.save(review);
        logger.info("Saved review with ID: {}", savedReview.getId());
        return savedReview;
    }
}