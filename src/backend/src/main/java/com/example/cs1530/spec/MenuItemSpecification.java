package com.example.cs1530.spec;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import com.example.cs1530.entity.Category;
import com.example.cs1530.entity.MenuItem;

import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

public class MenuItemSpecification {

    public static Specification<MenuItem> withFilters(String query, Long categoryId, Double priceMin,
            Double priceMax,
            int starsMin, int starsMax) {

        return (root, criteriaQuery, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search by query (name or description)
            if (query != null && !query.isEmpty()) {
                String likePattern = "%" + query + "%";
                Predicate namePredicate = criteriaBuilder.like(root.get("name"), likePattern);
                Predicate descriptionPredicate = criteriaBuilder.like(root.get("description"), likePattern);
                predicates.add(criteriaBuilder.or(namePredicate, descriptionPredicate));
            }

            // Filter by category
            if (categoryId != null) {
                Join<MenuItem, Category> categoryJoin = root.join("categories");
                predicates.add(criteriaBuilder.equal(categoryJoin.get("id"), categoryId));
            }

            // Filter by price range
            if (priceMin >= 0) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("price"), priceMin));
            }
            if (priceMax > 0) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("price"), priceMax));
            }

            // Filter by stars/rating
            if (starsMin > 0 || starsMax < 5) {
                Double starsMinDouble = (double) starsMin;
                Double starsMaxDouble = (double) starsMax;

                Subquery<Double> ratingSubquery = criteriaQuery.subquery(Double.class);
                Root<MenuItem> ratingRoot = ratingSubquery.correlate(root);
                Join<Object, Object> reviewsJoin = ratingRoot.join("reviews");
                ratingSubquery.select(criteriaBuilder.avg(reviewsJoin.get("rating")));

                if (starsMin > 0) {
                    predicates.add(criteriaBuilder.greaterThanOrEqualTo(ratingSubquery, starsMinDouble));
                }
                if (starsMax < 5) {
                    predicates.add(criteriaBuilder.lessThanOrEqualTo(ratingSubquery, starsMaxDouble));
                }
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
