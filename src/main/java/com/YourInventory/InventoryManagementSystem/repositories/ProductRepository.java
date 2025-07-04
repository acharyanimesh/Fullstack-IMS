package com.YourInventory.InventoryManagementSystem.repositories;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.YourInventory.InventoryManagementSystem.model.Category;
import com.YourInventory.InventoryManagementSystem.model.Product;

public interface ProductRepository extends JpaRepository<Product , Long>{

    List<Product> findByNameContainingOrDescriptionContaining(String name , String description);

    boolean existsBySkuIgnoreCase(String sku);

    boolean existsBySkuIgnoreCaseAndIdNot(String sku, Long id);

    Page<Product> findByCategory(Category category, Pageable pageable);

    Page<Product> findByStockQuantityLessThanEqual(Integer threshold, Pageable pageable);
}
