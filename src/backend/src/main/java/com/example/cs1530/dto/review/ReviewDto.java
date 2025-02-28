package com.example.cs1530.dto.review;

import java.time.LocalDateTime;

import com.example.cs1530.entity.Review;

public class ReviewDto {
    private Long id;
    private Integer stars;
    private String content;
    private Long menuItemId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public Integer getStars() {
        return stars;
    }

    public String getContent() {
        return content;
    }

    public Long getMenuItemId() {
        return menuItemId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public ReviewDto(Review review) {
        this.id = review.getId();
        this.stars = review.getStars();
        this.content = review.getContent();
        this.menuItemId = review.getMenuItem().getId();
        this.createdAt = review.getCreatedAt();
        this.updatedAt = review.getUpdatedAt();
    }
}
