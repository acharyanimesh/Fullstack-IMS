package com.YourInventory.InventoryManagementSystem.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.YourInventory.InventoryManagementSystem.dtos.Response;
import com.YourInventory.InventoryManagementSystem.services.DashboardService;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/overview")
    public ResponseEntity<Response> getDashboardOverview() {
        Response response = dashboardService.getDashboardOverview();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/alerts")
    public ResponseEntity<Response> getInventoryAlerts() {
        Response response = dashboardService.getInventoryAlerts();
        return ResponseEntity.ok(response);
    }

    @GetMapping("/top-products")
    public ResponseEntity<Response> getTopProducts(@RequestParam(defaultValue = "10") int limit) {
        Response response = dashboardService.getTopProducts(limit);
        return ResponseEntity.ok(response);
    }
}
