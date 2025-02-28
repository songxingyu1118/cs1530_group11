package com.example.cs1530.repository;

import java.util.List;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.cs1530.entity.MenuItem;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
    List<MenuItem> findAll();

    List<MenuItem> findAll(Specification<MenuItem> spec);

    @Query("SELECT m FROM MenuItem m JOIN m.categories c WHERE c.id = :categoryId")
    List<MenuItem> findByCategory(Long categoryId);
}