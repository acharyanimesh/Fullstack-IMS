package com.YourInventory.InventoryManagementSystem.model;

import java.time.LocalDateTime;
import java.util.List;

import com.YourInventory.InventoryManagementSystem.enums.UserRole;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.Data;

@Entity
@AllArgsConstructor
@NoArgsConstructor 
@Table(name = "users")
@Data
@Builder

public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    private String name;

    @Column(unique = true)
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "PhoneNumber is required")
    @Column(name ="phone_number")
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @OneToMany(mappedBy = "user")
    private List<Transaction> transaction;

    @Column(name = "created_at")
    private final LocalDateTime createdAt = LocalDateTime.now() ;
    
    @Override
    public String toString(){
        return "User{" +
            "id=" + id +
            ", name='" + name + '\'' +
            ", email='" + email + '\'' +
            ", password='" + password + '\'' +
            ", phoneNumber='" + phoneNumber + '\'' +
            ", role=" + role +
            ", createdAt=" + createdAt +
            '}';
    }

}
