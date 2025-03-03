package com.example.cs1530.service;

import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import com.example.cs1530.entity.Category;
import com.example.cs1530.entity.MenuItem;
import com.example.cs1530.entity.Review;
import com.example.cs1530.repository.CategoryRepository;
import com.example.cs1530.repository.MenuItemRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.criteria.Subquery;

@Service
public class MenuItemService {
    @Autowired
    private MenuItemRepository menuItemRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    public List<MenuItem> filterMenuItems(String query, Long categoryId, Double priceMin, Double priceMax,
            Integer starsMin, Integer starsMax) {
        Specification<MenuItem> spec = Specification.where(null);

        if (query != null && !query.trim().isEmpty()) {
            spec = spec.and((root, criteriaQuery, cb) -> cb.or(
                    cb.like(cb.lower(root.get("name")), "%" + query.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("description")), "%" + query.toLowerCase() + "%")));
        }

        if (categoryId != null) {
            categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new EntityNotFoundException(
                            this.getClass().getName() + ": Category not found with ID " + categoryId));
            spec = spec.and((root, criteriaQuery, cb) -> cb.isMember(categoryId, root.get("categories")));
        }

        if (priceMin != null) {
            spec = spec.and((root, criteriaQuery, cb) -> cb.greaterThanOrEqualTo(root.get("price"), priceMin));
        }

        if (priceMax != null) {
            spec = spec.and((root, criteriaQuery, cb) -> cb.lessThanOrEqualTo(root.get("price"), priceMax));
        }

        if (starsMin != null) {
            spec = spec.and((root, criteriaQuery, cb) -> {
                criteriaQuery.distinct(true);

                Subquery<Double> subquery = criteriaQuery.subquery(Double.class);
                Root<MenuItem> subRoot = subquery.from(MenuItem.class);
                Join<Object, Object> reviewJoin = subRoot.join("reviews");

                subquery.select(cb.avg(reviewJoin.get("stars")))
                        .where(cb.equal(subRoot.get("id"), root.get("id")));

                return cb.greaterThanOrEqualTo(subquery, starsMin.doubleValue());
            });
        }

        if (starsMax != null) {
            spec = spec.and((root, criteriaQuery, cb) -> {
                criteriaQuery.distinct(true);

                Subquery<Double> subquery = criteriaQuery.subquery(Double.class);
                Root<MenuItem> subRoot = subquery.from(MenuItem.class);
                Join<Object, Object> reviewJoin = subRoot.join("reviews");

                subquery.select(cb.avg(reviewJoin.get("stars")))
                        .where(cb.equal(subRoot.get("id"), root.get("id")));

                return cb.lessThanOrEqualTo(subquery, starsMax.doubleValue());
            });
        }

        return menuItemRepository.findAll(spec);
    }

    public MenuItem saveMenuItem(String name, String description, String imagePath, Double price,
            List<Long> categoryIds) {
        MenuItem menuItem = new MenuItem();
        menuItem.setName(name);
        menuItem.setDescription(description);
        menuItem.setImagePath(imagePath);
        menuItem.setPrice(price);

        List<Category> categories = categoryRepository.findById(categoryIds);
        menuItem.setCategories(categories);

        return menuItemRepository.save(menuItem);
    }

    public MenuItem getMenuItem(Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        this.getClass().getName() + ": Menu item not found with id " + id));
    }

    public MenuItem updateMenuItem(Long id, String name, String description, String imagePath, Double price,
            List<Long> categoryIds) {
        MenuItem menuItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(
                        this.getClass().getName() + ": Menu item not found with id " + id));

        if (name != null) {
            menuItem.setName(name);
        }
        if (description != null) {
            menuItem.setDescription(description);
        }
        if (imagePath != null) {
            menuItem.setImagePath(imagePath);
        }
        if (price != null) {
            menuItem.setPrice(price);
        }
        if (categoryIds != null) {
            List<Category> categories = categoryRepository.findById(categoryIds);
            menuItem.setCategories(categories);
        }

        validateMenuItem(menuItem);

        menuItem.setUpdatedAt(LocalDateTime.now(ZoneOffset.UTC));

        return menuItemRepository.save(menuItem);
    }

    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new EntityNotFoundException(this.getClass().getName() + ": Menu item not found with id " + id);
        }
        menuItemRepository.deleteById(id);
    }

    public List<MenuItem> getMenuItemsByCategory(Long categoryId) {
        return menuItemRepository.findByCategory(categoryId);
    }

    public Double getAverageRating(Long menuItemId) {
        MenuItem menuItem = getMenuItem(menuItemId);
        if (menuItem.getReviews().isEmpty()) {
            return 0.0;
        }

        return menuItem.getReviews().stream()
                .mapToInt(Review::getStars)
                .average()
                .orElse(0.0);
    }

    private void validateMenuItem(MenuItem menuItem) {
        if (menuItem.getName() == null || menuItem.getName().trim().isEmpty()) {
            throw new IllegalArgumentException(this.getClass().getName() + ": Menu item name cannot be empty");
        }
        if (menuItem.getPrice() == null || menuItem.getPrice() <= 0) {
            throw new IllegalArgumentException(this.getClass().getName() + ": Menu item price must be non-negative");
        }
    }
}