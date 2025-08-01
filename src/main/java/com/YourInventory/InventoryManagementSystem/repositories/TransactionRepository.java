package com.YourInventory.InventoryManagementSystem.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.YourInventory.InventoryManagementSystem.enums.TransactionType;
import com.YourInventory.InventoryManagementSystem.model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction , Long>, JpaSpecificationExecutor<Transaction>{

    Page<Transaction> findByTransactionType(TransactionType transactionType, Pageable pageable);

    List<Transaction> findByProductId(Long productId);
}
