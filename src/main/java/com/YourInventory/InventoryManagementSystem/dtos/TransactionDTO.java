package com.YourInventory.InventoryManagementSystem.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.YourInventory.InventoryManagementSystem.enums.TransactionType;
import com.YourInventory.InventoryManagementSystem.enums.TransactionStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(ignoreUnknown = true)

public class TransactionDTO {

    private Long id;

    private Integer totalProduct;

    private BigDecimal totalPrice;

    private TransactionType transactionType;

    private TransactionStatus transactionStatus;
    
    private String description;
    private String note;

    private final LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updateAt;

    private ProductDTO productDTO;

    private UserDTO userDTO;
    
    private SupplierDTO supplierDTO;

}
