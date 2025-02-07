package com.example.cs1530.dto.menuitem;

import java.math.BigDecimal;
import java.util.Set;

import io.swagger.v3.oas.annotations.media.Schema;

public class CreateMenuItemRequest {
    @Schema(description = "Name of the menu item", required = true)
    private String name;

    @Schema(description = "Description of the menu item")
    private String description;

    @Schema(description = "Price of the menu item", required = true)
    private BigDecimal price;

    @Schema(description = "Set of category IDs that the menu item belongs to")
    private Set<Long> categoryIds;

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
}