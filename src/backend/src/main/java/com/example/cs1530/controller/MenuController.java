package com.example.cs1530.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.cs1530.dto.menuitem.CreateMenuItemRequest;
import com.example.cs1530.dto.menuitem.MenuItemDto;
import com.example.cs1530.entity.MenuItem;
import com.example.cs1530.service.MenuItemService;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
public class MenuController {
    @Autowired
    private MenuItemService menuItemService;

    @Operation(summary = "Get all menu items")
    @GetMapping("/items")
    public ResponseEntity<List<MenuItemDto>> getAllMenuItems() {
        return ResponseEntity.ok(menuItemService.getAllMenuItems().stream().map(MenuItem::toDto).toList());
    }

    @Operation(summary = "Create a new menu item")
    @PostMapping("/items")
    public ResponseEntity<MenuItemDto> createMenuItem(CreateMenuItemRequest request) {
        MenuItem savedMenuItem = menuItemService.saveMenuItem(request.getName(), request.getDescription(),
                request.getPrice(), request.getCategoryIds());
        return ResponseEntity.ok(savedMenuItem.toDto());
    }
}