package com.example.cs1530.dto.review;

import java.time.LocalDateTime;

import com.example.cs1530.dto.menuitem.MenuItemDto;
import com.example.cs1530.entity.Review;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "DTO representing a user review for a menu item")
public class ReviewDto {
    @Schema(description = "UID for the review", example = "1")
    private Long id;

    @Schema(description = "Rating given by the user (raw range of 2-10 but represented on a 1-5 scale)", example = "4", minimum = "2", maximum = "10")
    private Integer stars;

    @Schema(description = "The user's comments and review", example = "🍕🍕🍕 yum", maxLength = 1000)
    private String content;

    @Schema(description = "The menu item being reviewed")
    private MenuItemDto menuItem;

    @Schema(description = "ID of the menu item being reviewed", example = "42")
    private Long menuItemId;

    @Schema(description = "Timestamp when the review was first created", example = "2025-03-15T14:30:00")
    private LocalDateTime createdAt;

    @Schema(description = "Timestamp when the review was last modified", example = "2025-03-16T09:45:00")
    private LocalDateTime updatedAt; // TODO: remove ?

    public Long getId() {
        return id;
    }

    public Integer getStars() {
        return stars;
    }

    public String getContent() {
        return content;
    }

    public MenuItemDto getMenuItem() {
        return menuItem;
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
        this(review, false);
    }

    public ReviewDto(Review review, boolean includeMenuItem) {
        this.id = review.getId();
        this.stars = review.getStars();
        this.content = review.getContent();
        this.createdAt = review.getCreatedAt();
        this.updatedAt = review.getUpdatedAt();

        if (includeMenuItem) {
            this.menuItem = review.getMenuItem().toDto();
            this.menuItemId = this.menuItem.getId();
        } else {
            this.menuItemId = review.getMenuItem().getId();
        }
    }
}
