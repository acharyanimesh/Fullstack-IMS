package com.YourInventory.InventoryManagementSystem.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.YourInventory.InventoryManagementSystem.dtos.Response;
import com.YourInventory.InventoryManagementSystem.enums.TransactionType;
import com.YourInventory.InventoryManagementSystem.model.Product;
import com.YourInventory.InventoryManagementSystem.model.Transaction;
import com.YourInventory.InventoryManagementSystem.repositories.CategoryRepository;
import com.YourInventory.InventoryManagementSystem.repositories.ProductRepository;
import com.YourInventory.InventoryManagementSystem.repositories.SupplierRepository;
import com.YourInventory.InventoryManagementSystem.repositories.TransactionRepository;
import com.YourInventory.InventoryManagementSystem.repositories.UserRepository;

@Service
public class DashboardService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private UserRepository userRepository;

    public Response getDashboardOverview() {
        Map<String, Object> dashboardData = new HashMap<>();

        // Basic counts
        dashboardData.put("totalProducts", productRepository.count());
        dashboardData.put("totalCategories", categoryRepository.count());
        dashboardData.put("totalSuppliers", supplierRepository.count());
        dashboardData.put("totalUsers", userRepository.count());
        dashboardData.put("totalTransactions", transactionRepository.count());

        // Stock statistics
        List<Product> allProducts = productRepository.findAll();
        int totalStock = allProducts.stream().mapToInt(Product::getStockQuantity).sum();
        dashboardData.put("totalStock", totalStock);

        // Low stock products (threshold: 10)
        int lowStockThreshold = 10;
        List<Product> lowStockProducts = allProducts.stream()
                .filter(product -> product.getStockQuantity() <= lowStockThreshold)
                .collect(Collectors.toList());
        dashboardData.put("lowStockCount", lowStockProducts.size());
        dashboardData.put("lowStockProducts", lowStockProducts.stream()
                .limit(5)
                .map(product -> {
                    Map<String, Object> productData = new HashMap<>();
                    productData.put("id", product.getId());
                    productData.put("name", product.getName());
                    productData.put("sku", product.getSku());
                    productData.put("stockQuantity", product.getStockQuantity());
                    return productData;
                })
                .collect(Collectors.toList()));

        // Recent transactions (last 7 days)
        LocalDateTime weekAgo = LocalDateTime.now().minus(7, ChronoUnit.DAYS);
        List<Transaction> recentTransactions = transactionRepository.findAll().stream()
                .filter(transaction -> transaction.getCreatedAt().isAfter(weekAgo))
                .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
                .limit(10)
                .collect(Collectors.toList());

        dashboardData.put("recentTransactionsCount", recentTransactions.size());
        dashboardData.put("recentTransactions", recentTransactions.stream()
                .map(transaction -> {
                    Map<String, Object> transactionData = new HashMap<>();
                    transactionData.put("id", transaction.getId());
                    transactionData.put("type", transaction.getTransactionType());
                    transactionData.put("productName", transaction.getProduct().getName());
                    transactionData.put("quantity", transaction.getTotalProduct());
                    transactionData.put("totalPrice", transaction.getTotalPrice());
                    transactionData.put("createdAt", transaction.getCreatedAt());
                    return transactionData;
                })
                .collect(Collectors.toList()));

        // Sales and purchase statistics
        BigDecimal totalSales = transactionRepository.findAll().stream()
                .filter(t -> t.getTransactionType() == TransactionType.SALE)
                .map(Transaction::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalPurchases = transactionRepository.findAll().stream()
                .filter(t -> t.getTransactionType() == TransactionType.PURCHASE)
                .map(Transaction::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        dashboardData.put("totalSales", totalSales);
        dashboardData.put("totalPurchases", totalPurchases);
        dashboardData.put("netProfit", totalSales.subtract(totalPurchases));

        // Transaction type distribution
        Map<TransactionType, Long> transactionTypeCount = transactionRepository.findAll().stream()
                .collect(Collectors.groupingBy(Transaction::getTransactionType, Collectors.counting()));
        dashboardData.put("transactionTypeDistribution", transactionTypeCount);

        // Top selling products (by quantity sold)
        Map<String, Integer> productSales = transactionRepository.findAll().stream()
                .filter(t -> t.getTransactionType() == TransactionType.SALE)
                .collect(Collectors.groupingBy(
                        t -> t.getProduct().getName(),
                        Collectors.summingInt(Transaction::getTotalProduct)
                ));

        List<Map<String, Object>> topSellingProducts = productSales.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(5)
                .map(entry -> {
                    Map<String, Object> productData = new HashMap<>();
                    productData.put("productName", entry.getKey());
                    productData.put("quantitySold", entry.getValue());
                    return productData;
                })
                .collect(Collectors.toList());

        dashboardData.put("topSellingProducts", topSellingProducts);

        // Monthly sales trend (last 6 months)
        LocalDateTime sixMonthsAgo = LocalDateTime.now().minus(6, ChronoUnit.MONTHS);
        Map<String, BigDecimal> monthlySales = transactionRepository.findAll().stream()
                .filter(t -> t.getTransactionType() == TransactionType.SALE && t.getCreatedAt().isAfter(sixMonthsAgo))
                .collect(Collectors.groupingBy(
                        t -> t.getCreatedAt().getYear() + "-" + String.format("%02d", t.getCreatedAt().getMonthValue()),
                        Collectors.reducing(BigDecimal.ZERO, Transaction::getTotalPrice, BigDecimal::add)
                ));

        dashboardData.put("monthlySalesTrend", monthlySales);

        return Response.builder()
                .status(200)
                .message("Dashboard data retrieved successfully")
                .data(dashboardData)
                .build();
    }

    public Response getInventoryAlerts() {
        Map<String, Object> alerts = new HashMap<>();

        // Low stock alerts
        int lowStockThreshold = 10;
        List<Product> lowStockProducts = productRepository.findAll().stream()
                .filter(product -> product.getStockQuantity() <= lowStockThreshold)
                .collect(Collectors.toList());

        alerts.put("lowStockAlerts", lowStockProducts.stream()
                .map(product -> {
                    Map<String, Object> alertData = new HashMap<>();
                    alertData.put("id", product.getId());
                    alertData.put("name", product.getName());
                    alertData.put("sku", product.getSku());
                    alertData.put("currentStock", product.getStockQuantity());
                    alertData.put("threshold", lowStockThreshold);
                    alertData.put("severity", product.getStockQuantity() == 0 ? "CRITICAL" : "WARNING");
                    return alertData;
                })
                .collect(Collectors.toList()));

        // Out of stock alerts
        List<Product> outOfStockProducts = productRepository.findAll().stream()
                .filter(product -> product.getStockQuantity() == 0)
                .collect(Collectors.toList());

        alerts.put("outOfStockAlerts", outOfStockProducts.stream()
                .map(product -> {
                    Map<String, Object> alertData = new HashMap<>();
                    alertData.put("id", product.getId());
                    alertData.put("name", product.getName());
                    alertData.put("sku", product.getSku());
                    return alertData;
                })
                .collect(Collectors.toList()));

        // Expiry alerts (products expiring in next 30 days)
        LocalDateTime thirtyDaysFromNow = LocalDateTime.now().plus(30, ChronoUnit.DAYS);
        List<Product> expiringProducts = productRepository.findAll().stream()
                .filter(product -> product.getExpiryDate() != null && 
                        product.getExpiryDate().isBefore(thirtyDaysFromNow))
                .collect(Collectors.toList());

        alerts.put("expiryAlerts", expiringProducts.stream()
                .map(product -> {
                    Map<String, Object> alertData = new HashMap<>();
                    alertData.put("id", product.getId());
                    alertData.put("name", product.getName());
                    alertData.put("sku", product.getSku());
                    alertData.put("expiryDate", product.getExpiryDate());
                    alertData.put("daysUntilExpiry", ChronoUnit.DAYS.between(LocalDateTime.now(), product.getExpiryDate()));
                    return alertData;
                })
                .collect(Collectors.toList()));

        return Response.builder()
                .status(200)
                .message("Inventory alerts retrieved successfully")
                .data(alerts)
                .build();
    }

    public Response getTopProducts(int limit) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("stockQuantity").descending());
        List<Product> topProducts = productRepository.findAll(pageable).getContent();

        List<Map<String, Object>> productData = topProducts.stream()
                .map(product -> {
                    Map<String, Object> data = new HashMap<>();
                    data.put("id", product.getId());
                    data.put("name", product.getName());
                    data.put("sku", product.getSku());
                    data.put("stockQuantity", product.getStockQuantity());
                    data.put("price", product.getPrice());
                    data.put("categoryName", product.getCategory() != null ? product.getCategory().getName() : "N/A");
                    return data;
                })
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .message("Top products retrieved successfully")
                .data(productData)
                .build();
    }
}
