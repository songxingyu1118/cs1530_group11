package com.example.cs1530.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.example.cs1530.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    List<Category> findAll();

    @Query("SELECT c FROM Category c WHERE c.id IN :ids")
    List<Category> findById(List<Long> ids);
}