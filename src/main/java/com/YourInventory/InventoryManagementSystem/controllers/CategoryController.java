package com.YourInventory.InventoryManagementSystem.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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

import com.YourInventory.InventoryManagementSystem.dtos.CategoryDTO;
import com.YourInventory.InventoryManagementSystem.dtos.Response;
import com.YourInventory.InventoryManagementSystem.services.CategoryService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public ResponseEntity<Response> getAllCategories(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Response response = categoryService.getAllCategories(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/all")
    public ResponseEntity<Response> getAllCategoriesWithoutPagination() {
        Response response = categoryService.getAllCategoriesWithoutPagination();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{categoryId}")
    public ResponseEntity<Response> getCategoryById(@PathVariable Long categoryId) {
        Response response = categoryService.getCategoryById(categoryId);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        Response response = categoryService.createCategory(categoryDTO);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response> updateCategory(@PathVariable Long categoryId, @Valid @RequestBody CategoryDTO categoryDTO) {
        Response response = categoryService.updateCategory(categoryId, categoryDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response> deleteCategory(@PathVariable Long categoryId) {
        Response response = categoryService.deleteCategory(categoryId);
        return ResponseEntity.ok(response);
    }
}
