package com.example.cs1530.controller;

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
@CrossOrigin(origins = "*")
public class RestaurantController {

    @Autowired
    private DishService dishService;

    @Autowired
    private CommentService commentService;

    @GetMapping("/dishes")
    public ResponseEntity<List<Dish>> getAllDishes() {
        return ResponseEntity.ok(dishService.getAllDishes());
    }

    @PostMapping("/dishes")
    public ResponseEntity<Dish> createDish(@RequestBody Dish dish) {
        Dish savedDish = dishService.saveDish(dish);
        return ResponseEntity.ok(savedDish);
    }

    @PostMapping("/comments")
    public ResponseEntity<Comment> addComment(@RequestBody Comment comment) {
        Comment savedComment = commentService.addComment(comment);
        return ResponseEntity.ok(savedComment);
    }
}