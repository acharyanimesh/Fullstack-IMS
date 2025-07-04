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

import com.YourInventory.InventoryManagementSystem.dtos.ProductDTO;
import com.YourInventory.InventoryManagementSystem.dtos.Response;
import com.YourInventory.InventoryManagementSystem.services.ProductService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public ResponseEntity<Response> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Response response = productService.getAllProducts(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{productId}")
    public ResponseEntity<Response> getProductById(@PathVariable Long productId) {
        Response response = productService.getProductById(productId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Response> getProductsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Response response = productService.getProductsByCategory(categoryId, page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/low-stock")
    public ResponseEntity<Response> getLowStockProducts(
            @RequestParam(defaultValue = "10") int threshold,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Response response = productService.getLowStockProducts(threshold, page, size);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Response> createProduct(@Valid @RequestBody ProductDTO productDTO) {
        Response response = productService.createProduct(productDTO);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{productId}")
    public ResponseEntity<Response> updateProduct(@PathVariable Long productId, @Valid @RequestBody ProductDTO productDTO) {
        Response response = productService.updateProduct(productId, productDTO);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{productId}/stock")
    public ResponseEntity<Response> updateStock(
            @PathVariable Long productId,
            @RequestParam Integer quantity,
            @RequestParam String operation) {
        Response response = productService.updateStock(productId, quantity, operation);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Response> deleteProduct(@PathVariable Long productId) {
        Response response = productService.deleteProduct(productId);
        return ResponseEntity.ok(response);
    }
}
