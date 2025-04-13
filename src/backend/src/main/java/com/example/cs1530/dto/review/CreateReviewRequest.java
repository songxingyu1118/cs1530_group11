package com.example.cs1530.dto.review;

import io.swagger.v3.oas.annotations.media.Schema;

public class CreateReviewRequest {
    @Schema(description = "Number of stars given in the review", required = true, minimum = "2", maximum = "10", example = "4")
    private Integer stars;

    @Schema(description = "Content of the review, up to 1000 characters")
    private String content;

    @Schema(description = "ID of the menu item that the review is for", required = true)
    private Long menuItemId;

    @Schema(description = "Authentication token for the user (optional)")
    private String token;

    public Integer getStars() {
        return stars;
    }

    public String getContent() {
        return content;
    }

    public Long getMenuItemId() {
        return menuItemId;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}