package com.YourInventory.InventoryManagementSystem.repositories;


import org.springframework.data.jpa.repository.JpaRepository;

import com.YourInventory.InventoryManagementSystem.model.Category;

public interface CategoryRepository extends JpaRepository<Category , Long>{

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
