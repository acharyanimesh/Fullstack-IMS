package com.YourInventory.InventoryManagementSystem.dtos;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)

public class TransactionRequest {
    
    @Positive(message = "Product id must be greater than 0")
    private Long productId;

    @Positive(message = "Quantity must be greater than 0")
    private Integer quantity;

    private Long supplierId;

    private String description;

    private String note;
    
}
