package com.YourInventory.InventoryManagementSystem.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.YourInventory.InventoryManagementSystem.dtos.LoginRequest;
import com.YourInventory.InventoryManagementSystem.dtos.RegisterRequest;
import com.YourInventory.InventoryManagementSystem.dtos.Response;
import com.YourInventory.InventoryManagementSystem.services.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<Response> register(@Valid @RequestBody RegisterRequest registerRequest) {
        Response response = authService.register(registerRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Response> login(@Valid @RequestBody LoginRequest loginRequest) {
        Response response = authService.login(loginRequest);
        return ResponseEntity.ok(response);
    }
}
