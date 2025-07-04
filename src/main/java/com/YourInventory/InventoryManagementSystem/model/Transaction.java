package com.YourInventory.InventoryManagementSystem.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import com.YourInventory.InventoryManagementSystem.enums.TransactionType;
import com.YourInventory.InventoryManagementSystem.enums.TransactionStatus;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "transaction")
@Data
@Builder

public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer totalProduct;

    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    private TransactionType transactionType;//purchase, sale, return

    @Enumerated(EnumType.STRING)
    private TransactionStatus transactionStatus;//pending, completed, processing

    private String description;

    private String note;


    private final LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime updateAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    @Override
    public String toString(){
        return "Transaction{" +
                "id=" + id +
                ", totalProduct=" + totalProduct +
                ", totalPrice=" + totalPrice +
                ", transactionType=" + transactionType +
                ", transactionStatus=" + transactionStatus +
                ", description='" + description + '\'' +
                ", note='" + note + '\'' +
                ", createdAt=" + createdAt +
                ", updateAt=" + updateAt +
                '}';
    }

}
