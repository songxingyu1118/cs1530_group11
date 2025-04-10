package com.example.cs1530.controller;

import java.util.List;

import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
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

import com.example.cs1530.dto.category.CategoryDto;
import com.example.cs1530.dto.menuitem.MenuItemDto;
import com.example.cs1530.entity.Category;
import com.example.cs1530.entity.MenuItem;
import com.example.cs1530.service.FileStorageService;
import com.example.cs1530.service.MenuItemService;
import com.example.cs1530.service.OpenAIService;

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
    private OpenAIService openAIService;

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
            @Parameter(description = "Maximum star rating for filtered items (range: 2-10)", example = "8", schema = @Schema(minimum = "2", maximum = "10")) @RequestParam(required = false) Integer starsMax,
            @Parameter(description = "Whether to include category DTOs in the response", example = "false") @RequestParam(required = false) boolean includeCategories) {
        try {
            List<MenuItemDto> items = menuItemService
                    .filterMenuItems(query, categoryId, priceMin, priceMax, starsMin, starsMax)
                    .stream()
                    .map(m -> m.toDto(includeCategories))
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

    @Operation(summary = "Get all categories", description = "Retrieves a list of all menu categories")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully retrieved categories", content = @Content(schema = @Schema(implementation = CategoryDto.class))),
            @ApiResponse(responseCode = "500", description = "Server error")
    })
    @GetMapping("/categories")
    public ResponseEntity<List<CategoryDto>> getAllCategories(
            @Parameter(description = "Whether to include menu items in the response", example = "false") @RequestParam(required = false) boolean includeMenuItems) {
        try {
            List<CategoryDto> categories = menuItemService.getAllCategories().stream()
                    .map(c -> c.toDto(includeMenuItems))
                    .toList();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error retrieving categories: " + e.getMessage(), e);
        }
    }

    @Operation(summary = "Get a single category by ID", description = "Retrieves a specific menu category")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category found", content = @Content(schema = @Schema(implementation = CategoryDto.class))),
            @ApiResponse(responseCode = "404", description = "Category not found")
    })
    @GetMapping("/categories/{id}")
    public ResponseEntity<CategoryDto> getCategory(
            @Parameter(description = "ID of the category to retrieve", required = true, example = "1") @PathVariable Long id) {
        try {
            return ResponseEntity.ok(menuItemService.getCategory(id).toDto());
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found with id: " + id, e);
        }
    }

    @Operation(summary = "Delete a category by ID", description = "Removes a menu category from the database")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category deleted successfully"),
            @ApiResponse(responseCode = "404", description = "Category not found"),
            @ApiResponse(responseCode = "500", description = "Server error")
    })
    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(
            @Parameter(description = "ID of the category to delete", required = true, example = "1") @PathVariable Long id) {
        try {
            menuItemService.deleteCategory(id);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found with id: " + id, e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error deleting category: " + e.getMessage(), e);
        }
    }

    @Operation(summary = "Update a category by ID", description = "Updates an existing menu category with new data")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category updated successfully", content = @Content(schema = @Schema(implementation = CategoryDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "404", description = "Category not found"),
            @ApiResponse(responseCode = "500", description = "Server error")
    })
    @PutMapping("/categories/{id}")
    public ResponseEntity<CategoryDto> updateCategory(
            @Parameter(description = "ID of the category to update", required = true, example = "1") @PathVariable Long id,
            @Parameter(description = "Name of the category", required = false, example = "Pizza") @RequestParam("name") String name,
            @Parameter(description = "Description of the category", required = false, example = "Good pizza") @RequestParam(value = "description", required = false) String description) {
        try {
            Category updatedCategory = menuItemService.updateCategory(id, name, description);
            return ResponseEntity.ok(updatedCategory.toDto());
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found with id: " + id, e);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error updating category: " + e.getMessage(), e);
        }
    }

    @Operation(summary = "Create a new category", description = "Creates a new menu category")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Category created successfully", content = @Content(schema = @Schema(implementation = CategoryDto.class))),
            @ApiResponse(responseCode = "400", description = "Invalid input data"),
            @ApiResponse(responseCode = "500", description = "Server error")
    })
    @PostMapping("/categories")
    public ResponseEntity<CategoryDto> createCategory(
            @Parameter(description = "Name of the category", required = true, example = "Pizza") @RequestParam("name") String name,
            @Parameter(description = "Description of the category", required = false, example = "Good pizza") @RequestParam(value = "description", required = false) String description) {
        try {
            Category createdCategory = menuItemService.saveCategory(name);
            return ResponseEntity.ok(createdCategory.toDto());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error creating category: " + e.getMessage(), e);
        }
    }

    @Operation(summary = "Generate a menu item's description using an OpenAI compatible LLM", description = "Uses the menu item's description and user reviews to generate a summary of the item and its reviews")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Successfully generated menu item description", content = @Content(schema = @Schema(implementation = String.class))),
            @ApiResponse(responseCode = "500", description = "Server error")
    })
    @GetMapping("/summary/{id}")
    public ResponseEntity<String> generateMenuItemSummary(
            @Parameter(description = "ID of the menu item to generate a summary for", required = true, example = "1") @PathVariable Long id) {
        try {
            MenuItem menuItem = menuItemService.getMenuItem(id);
            String description = menuItem.getDescription();
            String sentimentOverview = new StringBuilder()
                    .append("Average Rating: ")
                    .append(menuItem.getRating())
                    .append("\n")
                    .append("No. Reviews: ")
                    .append(menuItem.getReviews().size())
                    .toString();
            String reviews = menuItem.getReviews().stream()
                    .map(r -> new StringBuilder("Customer Review:\n\t")
                            .append("Rating: ")
                            .append(r.getStars())
                            .append(", ")
                            .append("Review Content: ")
                            .append(r.getContent())
                            .toString())
                    .reduce("", (a, b) -> a + "\n" + b);
            List<Message> messages = List.of(
                    new SystemMessage(
                            "Generate a description of the menu item by integrating its details and customer sentiment in a factual, concise manner, avoiding first-person or second-person pronouns, and summary phrases. Try to start with an aggrandized description of the menu item, followed by a neutral overview of the item's customer sentiment and reviews."),
                    new UserMessage(description),
                    new UserMessage(sentimentOverview),
                    new UserMessage(reviews));

            return ResponseEntity.ok(openAIService.complete(messages));
        } catch (EntityNotFoundException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Menu item not found with id: " + id, e);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR,
                    "Error generating menu item summary: " + e.getMessage(), e);
        }
    }
}
