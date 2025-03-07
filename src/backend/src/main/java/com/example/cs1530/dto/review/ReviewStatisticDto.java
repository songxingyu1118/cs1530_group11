package com.example.cs1530.dto.review;

public class ReviewStatisticDto {
    private Double averageRating;
    private Integer reviewCount;

    public ReviewStatisticDto(Double averageRating, Integer reviewCount) {
        this.averageRating = averageRating;
        this.reviewCount = reviewCount;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public Integer getReviewCount() {
        return reviewCount;
    }
}
