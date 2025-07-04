package com.YourInventory.InventoryManagementSystem.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.YourInventory.InventoryManagementSystem.model.Supplier;

public interface SupplierRepository extends JpaRepository<Supplier , Long>{

    boolean existsByNameIgnoreCase(String name);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);
}
