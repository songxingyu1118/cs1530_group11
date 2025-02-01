package com.example.cs1530.service;

import com.example.cs1530.entity.Dish;
import com.example.cs1530.repository.DishRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DishService {

    @Autowired
    private DishRepository dishRepository;

    public List<Dish> getAllDishes() {
        return dishRepository.findAll();
    }

    public Dish getDishById(Long id) {
        return dishRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dish not found with id: " + id));
    }

    public Dish saveDish(Dish dish) {
        return dishRepository.save(dish);
    }

    public void updateDishAverageRating(Dish dish) {
        double averageStars = dish.getComments().stream()
                .mapToInt(comment -> comment.getStars())
                .average()
                .orElse(0.0);
        dish.setAverageStars(averageStars);
        dishRepository.save(dish);
    }
}