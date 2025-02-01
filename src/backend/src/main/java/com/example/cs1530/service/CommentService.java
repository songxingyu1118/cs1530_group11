package com.example.cs1530.service;

import com.example.cs1530.entity.Comment;
import com.example.cs1530.entity.Dish;
import com.example.cs1530.repository.CommentRepository;
import com.example.cs1530.repository.DishRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CommentService {
    private static final Logger logger = LoggerFactory.getLogger(CommentService.class);

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private DishRepository dishRepository;

    @Autowired
    private DishService dishService;

    @Transactional
    public Comment addComment(Comment comment) {
        logger.info("Attempting to add comment for dish name: {}", comment.getDishName());

        if (comment.getDishName() == null || comment.getDishName().trim().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dish name cannot be empty");
        }

        // Find dish by name
        Dish dish = dishRepository.findFirstByNameIgnoreCase(comment.getDishName())
                .orElseThrow(() -> {
                    logger.error("Dish not found with name: {}", comment.getDishName());
                    return new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Dish not found with name: " + comment.getDishName());
                });

        logger.info("Found dish: {}", dish.getName());

        comment.setDish(dish);
        Comment savedComment = commentRepository.save(comment);
        logger.info("Saved comment with ID: {}", savedComment.getId());

        // Update dish average rating
        dishService.updateDishAverageRating(dish);

        return savedComment;
    }
}