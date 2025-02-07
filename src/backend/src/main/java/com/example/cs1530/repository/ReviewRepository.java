package com.example.cs1530.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.cs1530.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}