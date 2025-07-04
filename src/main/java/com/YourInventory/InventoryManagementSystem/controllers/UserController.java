package com.YourInventory.InventoryManagementSystem.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.YourInventory.InventoryManagementSystem.dtos.Response;
import com.YourInventory.InventoryManagementSystem.dtos.UserDTO;
import com.YourInventory.InventoryManagementSystem.services.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Response response = userService.getAllUsers(page, size);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response> getUserById(@PathVariable Long userId) {
        Response response = userService.getUserById(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/profile")
    public ResponseEntity<Response> getCurrentUser() {
        Response response = userService.getCurrentUser();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response> updateUser(@PathVariable Long userId, @RequestBody UserDTO userDTO) {
        Response response = userService.updateUser(userId, userDTO);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<Response> updateCurrentUser(@RequestBody UserDTO userDTO) {
        Response response = userService.updateCurrentUser(userDTO);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Response> deleteUser(@PathVariable Long userId) {
        Response response = userService.deleteUser(userId);
        return ResponseEntity.ok(response);
    }
}
