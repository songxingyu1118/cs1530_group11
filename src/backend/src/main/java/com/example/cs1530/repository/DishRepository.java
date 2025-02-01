package com.example.cs1530.repository;

import com.example.cs1530.entity.Dish;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface DishRepository extends JpaRepository<Dish, Long> {
    Optional<Dish> findFirstByNameIgnoreCase(String name);
}