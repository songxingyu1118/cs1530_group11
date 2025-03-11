package com.example.cs1530.dto.category;

import java.time.LocalDateTime;
import java.util.List;

import com.example.cs1530.dto.menuitem.MenuItemDto;
import com.example.cs1530.entity.Category;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "The DTO for a category")
public class CategoryDto {
    @Schema(description = "UID for the category", example = "1")
    private Long id;

    @Schema(description = "Name of the category", example = "Appetizers", maxLength = 100)
    private String name;

    @Schema(description = "Description of the category", example = "...", maxLength = 1000)
    private String description;

    @Schema(description = "Associated menu items", example = "[]")
    private List<MenuItemDto> menuItems = List.of();

    @Schema(description = "Associated menu item IDs", example = "[1, 3, 2]")
    private List<Long> menuItemIds;

    @Schema(description = "Timestamp when the category was first added to the system", example = "2025-03-01T00:00:00")
    private LocalDateTime createdAt;

    @Schema(description = "Timestamp when the category was last modified", example = "2025-03-01T00:00:00")
    private LocalDateTime updatedAt;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public CategoryDto(Category category) {
        this(category, false);
    }

    public CategoryDto(Category category, boolean includeMenuItems) {
        this.id = category.getId();
        this.name = category.getName();
        this.description = category.getDescription();
        this.createdAt = category.getCreatedAt();
        this.updatedAt = category.getUpdatedAt();

        this.menuItemIds = category.getMenuItems().stream().map(menuItem -> menuItem.getId()).toList();
        if (includeMenuItems) {
            this.menuItems = category.getMenuItems().stream().map(MenuItemDto::new).toList();
        }
    }
}
