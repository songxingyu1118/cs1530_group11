package com.example.cs1530.dto.menuitem;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Set;
import java.util.stream.Collectors;

import com.example.cs1530.entity.MenuItem;

import io.swagger.v3.oas.annotations.media.Schema;

public class MenuItemDto {
    @Schema(description = "Unique integer identifier of the menu item")
    private Long id;

    @Schema(description = "Name of the menu item")
    private String name;

    @Schema(description = "Description of the menu item")
    private String description;

    @Schema(description = "Price of the menu item")
    private BigDecimal price;

    @Schema(description = "Datetime when the menu item was created")
    private LocalDateTime createdAt;

    @Schema(description = "Datetime when the menu item was last updated")
    private LocalDateTime updatedAt;

    @Schema(description = "Set of category IDs that the menu item belongs to")
    private Set<Long> categoryIds;

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public Set<Long> getCategoryIds() {
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
        this.price = menuItem.getPrice();
        this.categoryIds = menuItem.getCategories().stream().map(category -> category.getId())
                .collect(Collectors.toSet());
        this.createdAt = menuItem.getCreatedAt();
        this.updatedAt = menuItem.getUpdatedAt();
    }
}
