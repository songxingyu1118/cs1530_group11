package com.example.cs1530.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import com.example.cs1530.dto.menuitem.MenuItemDto;
import com.example.cs1530.entity.MenuItem;
import com.example.cs1530.service.FileStorageService;
import com.example.cs1530.service.MenuItemService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/api/menu")
@CrossOrigin(origins = "*")
@Tag(name = "Menu Management", description = "APIs for managing restaurant menu items")
public class MenuController {
    @Autowired
    private MenuItemService menuItemService;

    @Autowired
    private FileStorageService fileStorageService;

    @Operation(summary = "Create a new menu item", description = "Creates a new menu item with the provided data and image")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Menu item created successfully", content = @Content(schema = @Schema(implementation = MenuItemDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "500", description = "Server error")
    })
    @PostMapping(value = "/", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MenuItemDto> createMenuItem(
            @Parameter(description = "Name of the menu item", required = true, example = "Margherita Pizza") @RequestParam("name") String name,
            @Parameter(description = "Detailed description of the menu item (e.g. ingredients)", example = "New York style pizza with fresh mozzarella, tomatoes, and basil") @RequestParam(value = "description", required = false) String description,
            @Parameter(description = "URL to the menu item's image") @RequestPart(value = "image", required = false) MultipartFile imageFile,
            @Parameter(description = "Price of the menu item", required = true, example = "10.99") @RequestParam("price") Double price,
            @Parameter(description = "List of category IDs that this menu item belongs to", example = "[]") @RequestParam(value = "categoryIds", required = false) List<Long> categoryIds) {

        try {
            String imagePath = null;
            if (imageFile != null) {
                imagePath = fileStorageService.storeFile(imageFile);
            }

            MenuItem savedMenuItem = menuItemService.saveMenuItem(name, description, imagePath, price, categoryIds);
            return ResponseEntity.ok(savedMenuItem.toDto());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error creating menu item: " + e.getMessage(), e);
        }
    }

    @Operation(summary = "Get a single menu item by ID", description = "Retrieves a specific menu item")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Menu item found", content = @Content(schema = @Schema(implementation = MenuItemDto.class))),
            @ApiResponse(responseCode = "404", description = "Menu item not found")
    })
    @GetMapping("/{id}")
    public ResponseEntity<MenuItemDto> getMenuItem(
            @Parameter(description = "ID of the menu item to retrieve", required = true, example = "1") @PathVariable Long id) {
        try {
            return ResponseEntity.ok(menuItemService.getMenuItem(id).toDto());
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu item not found with id: " + id, e);
        }
    }

    @Operation(summary = "Update a menu item by ID", description = "Updates an existing menu item with new data")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Menu item updated successfully", content = @Content(schema = @Schema(implementation = MenuItemDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "404", description = "Menu item not found"),
            @ApiResponse(responseCode = "500", description = "Server error")
    })
    @PutMapping("/{id}")
    public ResponseEntity<MenuItemDto> updateMenuItem(
            @Parameter(description = "UID of the menu item to update", required = true, example = "1") @PathVariable Long id,
            @Parameter(description = "Name of the menu item", required = true, example = "Margherita Pizza") @RequestParam("name") String name,
            @Parameter(description = "Detailed description of the menu item (e.g. ingredients)", example = "New York style pizza with fresh mozzarella, tomatoes, and basil") @RequestParam(value = "description", required = false) String description,
            @Parameter(description = "URL to the menu item's image") @RequestPart(value = "image", required = false) MultipartFile imageFile,
            @Parameter(description = "Price of the menu item", required = true, example = "10.99") @RequestParam("price") Double price,
            @Parameter(description = "List of category IDs that this menu item belongs to", example = "[]") @RequestParam(value = "categoryIds", required = false) List<Long> categoryIds) {

        try {
            String imagePath = null;
            if (imageFile != null) {
                imagePath = fileStorageService.storeFile(imageFile);
            }

            MenuItem updatedMenuItem = menuItemService.updateMenuItem(id, name, description, imagePath, price,
                    categoryIds);
            return ResponseEntity.ok(updatedMenuItem.toDto());
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu item not found with id: " + id, e);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error updating menu item: " + e.getMessage(), e);
        }
    }

    @Operation(summary = "Delete a menu item by ID", description = "Removes a menu item from the database")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Menu item deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Menu item not found"),
            @ApiResponse(responseCode = "500", description = "Server error")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenuItem(
            @Parameter(description = "ID of the menu item to delete", required = true, example = "1") @PathVariable Long id) {
        try {
            menuItemService.deleteMenuItem(id);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu item not found with id: " + id, e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error deleting menu item: " + e.getMessage(), e);
        }
    }

    @Operation(summary = "Get all menu items with filtering", description = "Retrieves a list of menu items with optional filtering by various fields")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved menu items", content = @Content(schema = @Schema(implementation = MenuItemDto.class))),
            @ApiResponse(responseCode = "404", description = "Categories not found"),
            @ApiResponse(responseCode = "500", description = "Server error")
    })
    @GetMapping("/items")
    public ResponseEntity<List<MenuItemDto>> getAllMenuItems(
            @Parameter(description = "Wildcard search query to filter names and descriptions with", example = "pizza") @RequestParam(required = false) String query,
            @Parameter(description = "Category ID to filter by", example = "3") @RequestParam(required = false) Long categoryId,
            @Parameter(description = "Minimum price for filtered items", example = "5.00", schema = @Schema(minimum = "0")) @RequestParam(required = false) Double priceMin,
            @Parameter(description = "Maximum price for filtered items", example = "20.00", schema = @Schema(minimum = "0")) @RequestParam(required = false) Double priceMax,
            @Parameter(description = "Minimum star rating for filtered items (range: 2-10)", example = "4", schema = @Schema(minimum = "2", maximum = "10")) @RequestParam(required = false) Integer starsMin,
            @Parameter(description = "Maximum star rating for filtered items (range: 2-10)", example = "8", schema = @Schema(minimum = "2", maximum = "10")) @RequestParam(required = false) Integer starsMax) {
        try {
            List<MenuItemDto> items = menuItemService
                    .filterMenuItems(query, categoryId, priceMin, priceMax, starsMin, starsMax)
                    .stream()
                    .map(m -> m.toDto(false))
                    .toList();
            return ResponseEntity.ok(items);
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND,
                    "The requested categories were not found: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error retrieving menu items: " + e.getMessage(), e);
        }
    }
}
