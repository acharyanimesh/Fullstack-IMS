package com.YourInventory.InventoryManagementSystem.services;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.YourInventory.InventoryManagementSystem.dtos.LoginRequest;
import com.YourInventory.InventoryManagementSystem.dtos.RegisterRequest;
import com.YourInventory.InventoryManagementSystem.dtos.Response;
import com.YourInventory.InventoryManagementSystem.dtos.UserDTO;
import com.YourInventory.InventoryManagementSystem.enums.UserRole;
import com.YourInventory.InventoryManagementSystem.exceptions.InavlidCredentialsException;
import com.YourInventory.InventoryManagementSystem.exceptions.NameValueRequiredException;
import com.YourInventory.InventoryManagementSystem.model.User;
import com.YourInventory.InventoryManagementSystem.repositories.UserRepository;
import com.YourInventory.InventoryManagementSystem.utils.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private ModelMapper modelMapper;

    public Response register(RegisterRequest registerRequest) {
        try {
            // Check if user already exists
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                throw new NameValueRequiredException("User with email " + registerRequest.getEmail() + " already exists");
            }

            // Set default role if not provided
            if (registerRequest.getRole() == null) {
                registerRequest.setRole(UserRole.MANAGER);
            }

            // Create new user
            User user = User.builder()
                    .name(registerRequest.getName())
                    .email(registerRequest.getEmail())
                    .password(passwordEncoder.encode(registerRequest.getPassword()))
                    .phoneNumber(registerRequest.getPhoneNumber())
                    .role(registerRequest.getRole())
                    .build();

            User savedUser = userRepository.save(user);
            UserDTO userDTO = modelMapper.map(savedUser, UserDTO.class);

            return Response.builder()
                    .status(200)
                    .message("User registered successfully")
                    .user(userDTO)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Error occurred during registration: " + e.getMessage());
        }
    }

    public Response login(LoginRequest loginRequest) {
        try {
            // Authenticate user
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            // Get user details
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new InavlidCredentialsException("Invalid email or password"));

            // Generate JWT token
            String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());

            return Response.builder()
                    .status(200)
                    .message("Login successful")
                    .token(token)
                    .role(user.getRole())
                    .expirationTime(jwtUtil.getExpirationTime())
                    .build();

        } catch (Exception e) {
            throw new InavlidCredentialsException("Invalid email or password");
        }
    }
}
