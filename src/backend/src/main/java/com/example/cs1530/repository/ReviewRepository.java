package com.example.cs1530.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cs1530.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByMenuItemId(Long menuItemId);
}