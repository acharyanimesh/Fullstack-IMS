package com.YourInventory.InventoryManagementSystem.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.Data;
import lombok.Builder;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "products")
@Data
@Builder

public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    private String name;
    
    @Column(unique = true)
    @NotBlank(message = "SKU is required")
    private String sku;

    @NotBlank(message = "Price is required")
    @Positive(message = "Product price must be Positive value")
    private BigDecimal price;

    @Min(value = 0, message = "Stock quantity cannot be negative")
    private Integer stockQuantity;

    private String description;

    private LocalDateTime expiryDate;

    private String imageUrl;

    private final LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    public String toString(){
        return "Product{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", sku='" + sku + '\'' +
                ", price=" + price +
                ", stockQuantity=" + stockQuantity +
                ", description='" + description + '\'' +
                ", expiryDate=" + expiryDate +
                ", imageUrl='" + imageUrl + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
