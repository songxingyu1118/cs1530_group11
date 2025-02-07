package com.example.cs1530.service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.cs1530.entity.MenuItem;
import com.example.cs1530.entity.Review;
import com.example.cs1530.repository.MenuItemRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class MenuItemService {
    @Autowired
    private MenuItemRepository menuItemRepository;

    public List<MenuItem> getAllMenuItems() {
        return menuItemRepository.findAll();
    }

    public MenuItem saveMenuItem(String name, String description, BigDecimal price, Set<Long> categoryIds) {
        MenuItem menuItem = new MenuItem();
        menuItem.setName(name);
        menuItem.setDescription(description);
        menuItem.setPrice(price);
        // TODO: set categories

        return menuItemRepository.save(menuItem);
    }

    public MenuItem getMenuItemById(Long id) {
        return menuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Menu item not found with id: " + id));
    }

    public MenuItem updateMenuItem(Long id, MenuItem updatedItem) {
        validateMenuItem(updatedItem);

        MenuItem existingItem = menuItemRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Menu item not found with id: " + id));

        existingItem.setName(updatedItem.getName());
        existingItem.setDescription(updatedItem.getDescription());
        existingItem.setPrice(updatedItem.getPrice());

        if (updatedItem.getCategories() != null) {
            existingItem.setCategories(updatedItem.getCategories());
        }

        return menuItemRepository.save(existingItem);
    }

    public void deleteMenuItem(Long id) {
        if (!menuItemRepository.existsById(id)) {
            throw new EntityNotFoundException("Menu item not found with id: " + id);
        }
        menuItemRepository.deleteById(id);
    }

    public List<MenuItem> getMenuItemsByCategory(Long categoryId) {
        return menuItemRepository.findByCategoriesId(categoryId);
    }

    public double getAverageRating(Long menuItemId) {
        MenuItem menuItem = getMenuItemById(menuItemId);
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
            throw new IllegalArgumentException("Menu item name cannot be empty");
        }
        if (menuItem.getPrice() == null || menuItem.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Menu item price must be non-negative");
        }
    }
}