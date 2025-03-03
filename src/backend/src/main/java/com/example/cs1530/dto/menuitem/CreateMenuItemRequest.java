package com.example.cs1530.dto.menuitem;

import java.util.List;

import io.swagger.v3.oas.annotations.media.Schema;

public class CreateMenuItemRequest {
    @Schema(description = "Name of the menu item", required = true)
    private String name;

    @Schema(description = "Description of the menu item", required = false)
    private String description;

    @Schema(description = "Price of the menu item", required = true)
    private Double price;

    @Schema(description = "Set of category IDs that the menu item belongs to", required = true)
    private List<Long> categoryIds;

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public Double getPrice() {
        return price;
    }

    public List<Long> getCategoryIds() {
        return categoryIds;
    }
}
