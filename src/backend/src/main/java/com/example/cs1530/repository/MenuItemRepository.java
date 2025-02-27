package com.example.cs1530.repository;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.cs1530.entity.MenuItem;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    @Query("SELECT m FROM MenuItem m WHERE m.price >= :priceMin AND m.price <= :priceMax")
    List<MenuItem> findByPriceBetween(Double priceMin, Double priceMax);

    @Query("SELECT m FROM MenuItem m WHERE m.name LIKE %:query% OR m.description LIKE %:query%")
    List<MenuItem> findBySearchQuery(String query);

    @Query("SELECT m FROM MenuItem m WHERE m.reviews.size > 0 AND AVG(m.reviews.rating) >= :starsMin AND AVG(m.reviews.rating) <= :starsMax")
    List<MenuItem> findByStarsBetween(int starsMin, int starsMax);

    @Query("SELECT m FROM MenuItem m JOIN m.categories c WHERE c.id = :categoryId")
    List<MenuItem> findByCategory(Long categoryId);

    List<MenuItem> find(Specification<MenuItem> spec);
}