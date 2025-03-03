package com.example.cs1530.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.cs1530.dto.menuitem.MenuItemDto;
import com.example.cs1530.entity.MenuItem;
import com.example.cs1530.service.FileStorageService;
import com.example.cs1530.service.MenuItemService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
public class MenuController {
    @Autowired
    private MenuItemService menuItemService;

    @Autowired
    private FileStorageService fileStorageService;

    @PostMapping(value = "/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MenuItemDto> createMenuItem(
            @RequestParam("name") String name,
            @RequestParam(value = "description", required = false) String description,
            @RequestPart(value = "image", required = false) MultipartFile imageFile,
            @RequestParam("price") Double price,
            @RequestParam(value = "categoryIds", required = false) List<Long> categoryIds) {

        String imagePath = fileStorageService.storeFile(imageFile);

        MenuItem savedMenuItem = menuItemService.saveMenuItem(name, description, imagePath, price, categoryIds);

        return ResponseEntity.ok(savedMenuItem.toDto());
    }

    @Operation(summary = "Get a single menu item by ID")
    @GetMapping("/{id}")
    public ResponseEntity<MenuItemDto> getMenuItem(Long id) {
        return ResponseEntity.ok(menuItemService.getMenuItem(id).toDto());
    }

    }

    @Operation(summary = "Get all menu items with filtering")
    @GetMapping("/items")
    public ResponseEntity<List<MenuItemDto>> getAllMenuItems(@RequestParam(required = false) String query,
            @RequestParam(required = false) Long categoryId, @RequestParam(required = false) Double priceMin,
            @RequestParam(required = false) Double priceMax, @RequestParam(required = false) Integer starsMin,
            @RequestParam(required = false) Integer starsMax) {
        return ResponseEntity
                .ok(menuItemService.filterMenuItems(query, categoryId, priceMin, priceMax, starsMin, starsMax).stream()
                        .map(MenuItem::toDto).toList());
    }
}