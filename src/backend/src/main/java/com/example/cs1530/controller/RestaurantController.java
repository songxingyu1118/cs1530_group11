package com.example.cs1530.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cs1530.entity.MenuItem;
import com.example.cs1530.entity.Review;
import com.example.cs1530.service.MenuItemService;
import com.example.cs1530.service.ReviewService;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class RestaurantController {

    @Autowired
    private MenuItemService menuItemService;

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/menu/items")
    public ResponseEntity<List<MenuItem>> getAllMenuItems() {
        return ResponseEntity.ok(menuItemService.getAllMenuItems());
    }

    @PostMapping("/menu/items")
    public ResponseEntity<MenuItem> createMenuItem(@RequestBody MenuItem menuItem) {
        MenuItem savedMenuItem = menuItemService.saveMenuItem(menuItem);
        return ResponseEntity.ok(savedMenuItem);
    }

    @PostMapping("/reviews")
    public ResponseEntity<Review> addReview(@RequestBody Review review) {
        Review savedReview = reviewService.addReview(review);
        return ResponseEntity.ok(savedReview);
    }
}