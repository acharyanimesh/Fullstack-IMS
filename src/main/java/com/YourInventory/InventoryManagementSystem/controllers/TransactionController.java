package com.YourInventory.InventoryManagementSystem.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.YourInventory.InventoryManagementSystem.dtos.Response;
import com.YourInventory.InventoryManagementSystem.dtos.TransactionRequest;
import com.YourInventory.InventoryManagementSystem.enums.TransactionStatus;
import com.YourInventory.InventoryManagementSystem.enums.TransactionType;
import com.YourInventory.InventoryManagementSystem.services.TransactionService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @GetMapping
    public ResponseEntity<Response> getAllTransactions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Response response = transactionService.getAllTransactions(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<Response> getTransactionById(@PathVariable Long transactionId) {
        Response response = transactionService.getTransactionById(transactionId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<Response> getTransactionsByType(
            @PathVariable TransactionType type,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Response response = transactionService.getTransactionsByType(type, page, size);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/purchase")
    public ResponseEntity<Response> purchaseProduct(@Valid @RequestBody TransactionRequest request) {
        Response response = transactionService.purchaseProduct(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/sell")
    public ResponseEntity<Response> sellProduct(@Valid @RequestBody TransactionRequest request) {
        Response response = transactionService.sellProduct(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/return")
    public ResponseEntity<Response> returnToSupplier(@Valid @RequestBody TransactionRequest request) {
        Response response = transactionService.returnToSupplier(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{transactionId}/status")
    public ResponseEntity<Response> updateTransactionStatus(
            @PathVariable Long transactionId,
            @RequestParam TransactionStatus status) {
        Response response = transactionService.updateTransactionStatus(transactionId, status);
        return ResponseEntity.ok(response);
    }
}
