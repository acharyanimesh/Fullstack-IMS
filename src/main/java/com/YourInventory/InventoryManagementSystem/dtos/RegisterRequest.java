package com.YourInventory.InventoryManagementSystem.dtos;

import com.YourInventory.InventoryManagementSystem.enums.UserRole;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class RegisterRequest {

    @NotBlank(message = "name is required")
    private String name;

    @NotBlank(message = "email is not required")
    private String email;

    @NotBlank(message = "password is required")
    private String password;

    @NotBlank(message = "phone number is required")
    private String phoneNumber;

    private UserRole role;


}
