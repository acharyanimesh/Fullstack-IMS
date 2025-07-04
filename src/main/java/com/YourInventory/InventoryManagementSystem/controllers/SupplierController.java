package com.YourInventory.InventoryManagementSystem.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.YourInventory.InventoryManagementSystem.dtos.Response;
import com.YourInventory.InventoryManagementSystem.dtos.SupplierDTO;
import com.YourInventory.InventoryManagementSystem.services.SupplierService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
public class SupplierController {

    @Autowired
    private SupplierService supplierService;

    @GetMapping
    public ResponseEntity<Response> getAllSuppliers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Response response = supplierService.getAllSuppliers(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<Response> getAllSuppliersWithoutPagination() {
        Response response = supplierService.getAllSuppliersWithoutPagination();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{supplierId}")
    public ResponseEntity<Response> getSupplierById(@PathVariable Long supplierId) {
        Response response = supplierService.getSupplierById(supplierId);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Response> createSupplier(@Valid @RequestBody SupplierDTO supplierDTO) {
        Response response = supplierService.createSupplier(supplierDTO);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{supplierId}")
    public ResponseEntity<Response> updateSupplier(@PathVariable Long supplierId, @Valid @RequestBody SupplierDTO supplierDTO) {
        Response response = supplierService.updateSupplier(supplierId, supplierDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{supplierId}")
    public ResponseEntity<Response> deleteSupplier(@PathVariable Long supplierId) {
        Response response = supplierService.deleteSupplier(supplierId);
        return ResponseEntity.ok(response);
    }
}
