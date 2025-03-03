package com.example.cs1530.dto.menuitem;

import java.time.LocalDateTime;
import java.util.List;

import com.example.cs1530.entity.MenuItem;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "The DTO for a menu item")
public class MenuItemDto {
    @Schema(description = "UID for the menu item", example = "1")
    private Long id;

    @Schema(description = "Name of the menu item", example = "Margherita Pizza", maxLength = 100)
    private String name;

    @Schema(description = "Detailed description of the menu item (e.g. ingredients)", example = "New York style pizza with fresh mozzarella, tomatoes, and basil", maxLength = 1000)
    private String description;

    @Schema(description = "Price of the menu item in the site's configured currency", example = "10.99", minimum = "0")
    private Double price;

    @Schema(description = "URL to the menu item's image", example = "/uploads/c0cb6122-8792-401e-b9c5-c55c0c1f51e6.png", maxLength = 255)
    private String imagePath;

    @Schema(description = "Timestamp when the menu item was first added to the system", example = "2025-03-01T00:00:00")
    private LocalDateTime createdAt;

    @Schema(description = "Timestamp when the menu item was last modified", example = "2025-03-01T00:00:00")
    private LocalDateTime updatedAt;

    @Schema(description = "List of category IDs that this menu item belongs to", example = "[]")
    private List<Long> categoryIds;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Double getPrice() {
        return price;
    }

    public String getImagePath() {
        return imagePath;
    }

    public List<Long> getCategoryIds() {
        return categoryIds;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public MenuItemDto(MenuItem menuItem) {
        this.id = menuItem.getId();
        this.name = menuItem.getName();
        this.description = menuItem.getDescription();
        this.imagePath = menuItem.getImagePath();
        this.price = menuItem.getPrice();
        this.categoryIds = menuItem.getCategories().stream().map(category -> category.getId()).toList();
        this.createdAt = menuItem.getCreatedAt();
        this.updatedAt = menuItem.getUpdatedAt();
    }
}
