package com.example.cs1530.controller;

package com.restaurant.review.controller;

import com.example.cs1530.entity.Comment;
import com.example.cs1530.entity.Dish;
import com.example.cs1530.service.CommentService;
import com.example.cs1530.service.DishService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class RestaurantController {

    @Autowired
    private DishService dishService;

    @Autowired
    private CommentService commentService;

    // Get all dishes with their comments
    @GetMapping("/dishes")
    public ResponseEntity<List<Dish>> getAllDishes() {
        return ResponseEntity.ok(dishService.getAllDishes());
    }

    // Add a new comment to a dish
    @PostMapping("/dishes/{dishId}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable Long dishId,
            @RequestBody Comment comment) {
        Comment savedComment = commentService.addComment(comment, dishId);
        return ResponseEntity.ok(savedComment);
    }
}