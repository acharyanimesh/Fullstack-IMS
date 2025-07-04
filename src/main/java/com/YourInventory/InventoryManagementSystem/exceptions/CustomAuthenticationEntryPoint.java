package com.YourInventory.InventoryManagementSystem.exceptions;

import java.io.IOException;


import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;


import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            org.springframework.security.core.AuthenticationException authException)
            throws IOException, ServletException {

        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getWriter().write("{\"status\": 401, \"message\": \"Unauthorized access - Invalid or missing token\"}");
    }
}
