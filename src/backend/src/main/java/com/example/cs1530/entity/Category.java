package com.example.cs1530.entity;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.example.cs1530.dto.category.CategoryDto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique integer identifier of the category")
    private Long id;

    @Column(nullable = false, unique = true)
    @Schema(description = "Unique name of the category")
    private String name;

    @Column(length = 1000)
    @Schema(description = "Description of the category, up to 1000 characters")
    private String description;

    @CreationTimestamp
    @Column(name = "created_at")
    @Schema(description = "Datetime when the category was created")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @Schema(description = "Datetime when the category was last updated")
    private LocalDateTime updatedAt;

    @ManyToMany(mappedBy = "categories")
    @Schema(description = "Set of menu items that belong to the category")
    private List<MenuItem> menuItems = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<MenuItem> getMenuItems() {
        return menuItems;
    }

    public void setMenuItems(List<MenuItem> menuItems) {
        this.menuItems = menuItems;
    }

    public CategoryDto toDto() {
        return new CategoryDto(this);
    }

    public CategoryDto toDto(boolean includeMenuItems) {
        return new CategoryDto(this, includeMenuItems);
    }
}