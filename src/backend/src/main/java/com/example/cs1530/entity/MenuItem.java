package com.example.cs1530.entity;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import com.example.cs1530.dto.menuitem.MenuItemDto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "menu_items")
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "Unique integer identifier of the menu item")
    private Long id;

    @Column(nullable = false, length = 100)
    @Schema(description = "Name of the menu item, up to 100 characters")
    private String name;

    @Column(length = 1000)
    @Schema(description = "Description of the menu item, up to 1000 characters")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    @Schema(description = "Price of the menu item")
    private BigDecimal price;

    @OneToMany(mappedBy = "menuItem", cascade = CascadeType.ALL)
    @Schema(description = "Set of reviews for the menu item")
    private Set<Review> reviews = new HashSet<>();

    @ManyToMany
    @JoinTable(name = "menu_item_categories", joinColumns = @JoinColumn(name = "menu_item_id"), inverseJoinColumns = @JoinColumn(name = "category_id"))
    @Schema(description = "Set of categories that the menu item belongs to")
    private Set<Category> categories = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at")
    @Schema(description = "Datetime when the user was created")
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    @Schema(description = "Datetime when the user was last updated")
    private LocalDateTime updatedAt;

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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Set<Review> getReviews() {
        return reviews;
    }

    public void setReviews(Set<Review> reviews) {
        this.reviews = reviews;
    }

    public Set<Category> getCategories() {
        return categories;
    }

    public void setCategories(Set<Category> categories) {
        this.categories = categories;
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

    public MenuItemDto toDto() {
        return new MenuItemDto(this);
    }
}