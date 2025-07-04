package com.YourInventory.InventoryManagementSystem.services;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.YourInventory.InventoryManagementSystem.dtos.Response;
import com.YourInventory.InventoryManagementSystem.dtos.TransactionDTO;
import com.YourInventory.InventoryManagementSystem.dtos.TransactionRequest;
import com.YourInventory.InventoryManagementSystem.enums.TransactionStatus;
import com.YourInventory.InventoryManagementSystem.enums.TransactionType;
import com.YourInventory.InventoryManagementSystem.exceptions.NameValueRequiredException;
import com.YourInventory.InventoryManagementSystem.exceptions.NotFoundException;
import com.YourInventory.InventoryManagementSystem.model.Product;
import com.YourInventory.InventoryManagementSystem.model.Supplier;
import com.YourInventory.InventoryManagementSystem.model.Transaction;
import com.YourInventory.InventoryManagementSystem.model.User;
import com.YourInventory.InventoryManagementSystem.repositories.ProductRepository;
import com.YourInventory.InventoryManagementSystem.repositories.SupplierRepository;
import com.YourInventory.InventoryManagementSystem.repositories.TransactionRepository;
import com.YourInventory.InventoryManagementSystem.repositories.UserRepository;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ModelMapper modelMapper;

    public Response getAllTransactions(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Transaction> transactionPage = transactionRepository.findAll(pageable);

        List<TransactionDTO> transactionDTOs = transactionPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .message("Transactions retrieved successfully")
                .transactions(transactionDTOs)
                .totalPages(transactionPage.getTotalPages())
                .totalElements(transactionPage.getTotalElements())
                .build();
    }

    public Response getTransactionById(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new NotFoundException("Transaction not found with id: " + transactionId));

        TransactionDTO transactionDTO = convertToDTO(transaction);

        return Response.builder()
                .status(200)
                .message("Transaction retrieved successfully")
                .transaction(transactionDTO)
                .build();
    }

    public Response getTransactionsByType(TransactionType type, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Transaction> transactionPage = transactionRepository.findByTransactionType(type, pageable);

        List<TransactionDTO> transactionDTOs = transactionPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .message("Transactions retrieved successfully")
                .transactions(transactionDTOs)
                .totalPages(transactionPage.getTotalPages())
                .totalElements(transactionPage.getTotalElements())
                .build();
    }

    public Response purchaseProduct(TransactionRequest request) {
        // Validate request
        validateTransactionRequest(request);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new NotFoundException("Product not found with id: " + request.getProductId()));

        Supplier supplier = null;
        if (request.getSupplierId() != null) {
            supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new NotFoundException("Supplier not found with id: " + request.getSupplierId()));
        }

        User currentUser = getCurrentUser();

        // Calculate total price
        BigDecimal totalPrice = product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity()));

        // Create transaction
        Transaction transaction = Transaction.builder()
                .totalProduct(request.getQuantity())
                .totalPrice(totalPrice)
                .transactionType(TransactionType.PURCHASE)
                .transactionStatus(TransactionStatus.COMPLETED)
                .description(request.getDescription())
                .note(request.getNote())
                .product(product)
                .user(currentUser)
                .supplier(supplier)
                .updateAt(LocalDateTime.now())
                .build();

        // Update product stock
        product.setStockQuantity(product.getStockQuantity() + request.getQuantity());
        productRepository.save(product);

        Transaction savedTransaction = transactionRepository.save(transaction);
        TransactionDTO transactionDTO = convertToDTO(savedTransaction);

        return Response.builder()
                .status(200)
                .message("Purchase completed successfully")
                .transaction(transactionDTO)
                .build();
    }

    public Response sellProduct(TransactionRequest request) {
        // Validate request
        validateTransactionRequest(request);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new NotFoundException("Product not found with id: " + request.getProductId()));

        // Check if sufficient stock is available
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new NameValueRequiredException("Insufficient stock. Available: " + product.getStockQuantity() + 
                    ", Requested: " + request.getQuantity());
        }

        User currentUser = getCurrentUser();

        // Calculate total price
        BigDecimal totalPrice = product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity()));

        // Create transaction
        Transaction transaction = Transaction.builder()
                .totalProduct(request.getQuantity())
                .totalPrice(totalPrice)
                .transactionType(TransactionType.SALE)
                .transactionStatus(TransactionStatus.COMPLETED)
                .description(request.getDescription())
                .note(request.getNote())
                .product(product)
                .user(currentUser)
                .updateAt(LocalDateTime.now())
                .build();

        // Update product stock
        product.setStockQuantity(product.getStockQuantity() - request.getQuantity());
        productRepository.save(product);

        Transaction savedTransaction = transactionRepository.save(transaction);
        TransactionDTO transactionDTO = convertToDTO(savedTransaction);

        return Response.builder()
                .status(200)
                .message("Sale completed successfully")
                .transaction(transactionDTO)
                .build();
    }

    public Response returnToSupplier(TransactionRequest request) {
        // Validate request
        validateTransactionRequest(request);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new NotFoundException("Product not found with id: " + request.getProductId()));

        // Check if sufficient stock is available for return
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new NameValueRequiredException("Insufficient stock to return. Available: " + product.getStockQuantity() + 
                    ", Requested: " + request.getQuantity());
        }

        Supplier supplier = null;
        if (request.getSupplierId() != null) {
            supplier = supplierRepository.findById(request.getSupplierId())
                    .orElseThrow(() -> new NotFoundException("Supplier not found with id: " + request.getSupplierId()));
        }

        User currentUser = getCurrentUser();

        // Calculate total price (negative for return)
        BigDecimal totalPrice = product.getPrice().multiply(BigDecimal.valueOf(request.getQuantity())).negate();

        // Create transaction
        Transaction transaction = Transaction.builder()
                .totalProduct(request.getQuantity())
                .totalPrice(totalPrice)
                .transactionType(TransactionType.RETURN_TO_SUPPLIER)
                .transactionStatus(TransactionStatus.COMPLETED)
                .description(request.getDescription())
                .note(request.getNote())
                .product(product)
                .user(currentUser)
                .supplier(supplier)
                .updateAt(LocalDateTime.now())
                .build();

        // Update product stock
        product.setStockQuantity(product.getStockQuantity() - request.getQuantity());
        productRepository.save(product);

        Transaction savedTransaction = transactionRepository.save(transaction);
        TransactionDTO transactionDTO = convertToDTO(savedTransaction);

        return Response.builder()
                .status(200)
                .message("Return to supplier completed successfully")
                .transaction(transactionDTO)
                .build();
    }

    public Response updateTransactionStatus(Long transactionId, TransactionStatus status) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new NotFoundException("Transaction not found with id: " + transactionId));

        transaction.setTransactionStatus(status);
        transaction.setUpdateAt(LocalDateTime.now());

        Transaction updatedTransaction = transactionRepository.save(transaction);
        TransactionDTO transactionDTO = convertToDTO(updatedTransaction);

        return Response.builder()
                .status(200)
                .message("Transaction status updated successfully")
                .transaction(transactionDTO)
                .build();
    }

    private void validateTransactionRequest(TransactionRequest request) {
        if (request.getProductId() == null || request.getProductId() <= 0) {
            throw new NameValueRequiredException("Valid product ID is required");
        }
        if (request.getQuantity() == null || request.getQuantity() <= 0) {
            throw new NameValueRequiredException("Quantity must be greater than 0");
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("Current user not found"));
    }

    private TransactionDTO convertToDTO(Transaction transaction) {
        TransactionDTO dto = modelMapper.map(transaction, TransactionDTO.class);
        // Set nested DTOs to avoid circular references
        if (transaction.getProduct() != null) {
            dto.setProductDTO(modelMapper.map(transaction.getProduct(), com.YourInventory.InventoryManagementSystem.dtos.ProductDTO.class));
        }
        if (transaction.getUser() != null) {
            dto.setUserDTO(modelMapper.map(transaction.getUser(), com.YourInventory.InventoryManagementSystem.dtos.UserDTO.class));
        }
        if (transaction.getSupplier() != null) {
            dto.setSupplierDTO(modelMapper.map(transaction.getSupplier(), com.YourInventory.InventoryManagementSystem.dtos.SupplierDTO.class));
        }
        return dto;
    }
}
