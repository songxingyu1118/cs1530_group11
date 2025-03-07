package com.example.cs1530.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.cs1530.entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query("SELECT r FROM Review r WHERE r.menuItem.id = :menuItemId")
    List<Review> findByMenuItemId(Long menuItemId);

    @Query("SELECT r FROM Review r WHERE r.user.id = :userId")
    List<Review> findByUserId(Long userId);
}