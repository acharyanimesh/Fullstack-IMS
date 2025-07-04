package com.YourInventory.InventoryManagementSystem.services;

import java.util.List;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.YourInventory.InventoryManagementSystem.dtos.ProductDTO;
import com.YourInventory.InventoryManagementSystem.dtos.Response;
import com.YourInventory.InventoryManagementSystem.exceptions.NameValueRequiredException;
import com.YourInventory.InventoryManagementSystem.exceptions.NotFoundException;
import com.YourInventory.InventoryManagementSystem.model.Category;
import com.YourInventory.InventoryManagementSystem.model.Product;
import com.YourInventory.InventoryManagementSystem.repositories.CategoryRepository;
import com.YourInventory.InventoryManagementSystem.repositories.ProductRepository;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ModelMapper modelMapper;

    public Response getAllProducts(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Product> productPage = productRepository.findAll(pageable);

        List<ProductDTO> productDTOs = productPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .message("Products retrieved successfully")
                .products(productDTOs)
                .totalPages(productPage.getTotalPages())
                .totalElements(productPage.getTotalElements())
                .build();
    }

    public Response getProductById(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found with id: " + productId));

        ProductDTO productDTO = convertToDTO(product);

        return Response.builder()
                .status(200)
                .message("Product retrieved successfully")
                .product(productDTO)
                .build();
    }

    public Response getProductsByCategory(Long categoryId, int page, int size) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category not found with id: " + categoryId));

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<Product> productPage = productRepository.findByCategory(category, pageable);

        List<ProductDTO> productDTOs = productPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .message("Products retrieved successfully")
                .products(productDTOs)
                .totalPages(productPage.getTotalPages())
                .totalElements(productPage.getTotalElements())
                .build();
    }

    public Response getLowStockProducts(int threshold, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("stockQuantity").ascending());
        Page<Product> productPage = productRepository.findByStockQuantityLessThanEqual(threshold, pageable);

        List<ProductDTO> productDTOs = productPage.getContent().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .message("Low stock products retrieved successfully")
                .products(productDTOs)
                .totalPages(productPage.getTotalPages())
                .totalElements(productPage.getTotalElements())
                .build();
    }

    public Response createProduct(ProductDTO productDTO) {
        validateProductDTO(productDTO);

        // Check if product with same SKU already exists
        if (productRepository.existsBySkuIgnoreCase(productDTO.getSku().trim())) {
            throw new NameValueRequiredException("Product with SKU '" + productDTO.getSku() + "' already exists");
        }

        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Category not found with id: " + productDTO.getCategoryId()));

        Product product = Product.builder()
                .name(productDTO.getName().trim())
                .sku(productDTO.getSku().trim().toUpperCase())
                .price(productDTO.getPrice())
                .stockQuantity(productDTO.getStockQuantity())
                .description(productDTO.getDescription() != null ? productDTO.getDescription().trim() : null)
                .expiryDate(productDTO.getExpiryDate())
                .imageUrl(productDTO.getImageUrl())
                .category(category)
                .build();

        Product savedProduct = productRepository.save(product);
        ProductDTO savedProductDTO = convertToDTO(savedProduct);

        return Response.builder()
                .status(200)
                .message("Product created successfully")
                .product(savedProductDTO)
                .build();
    }

    public Response updateProduct(Long productId, ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found with id: " + productId));

        validateProductDTO(productDTO);

        // Check if another product with same SKU already exists
        if (productRepository.existsBySkuIgnoreCaseAndIdNot(productDTO.getSku().trim(), productId)) {
            throw new NameValueRequiredException("Product with SKU '" + productDTO.getSku() + "' already exists");
        }

        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new NotFoundException("Category not found with id: " + productDTO.getCategoryId()));

        existingProduct.setName(productDTO.getName().trim());
        existingProduct.setSku(productDTO.getSku().trim().toUpperCase());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setStockQuantity(productDTO.getStockQuantity());
        existingProduct.setDescription(productDTO.getDescription() != null ? productDTO.getDescription().trim() : null);
        existingProduct.setExpiryDate(productDTO.getExpiryDate());
        existingProduct.setImageUrl(productDTO.getImageUrl());
        existingProduct.setCategory(category);

        Product updatedProduct = productRepository.save(existingProduct);
        ProductDTO updatedProductDTO = convertToDTO(updatedProduct);

        return Response.builder()
                .status(200)
                .message("Product updated successfully")
                .product(updatedProductDTO)
                .build();
    }

    public Response deleteProduct(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found with id: " + productId));

        productRepository.delete(product);

        return Response.builder()
                .status(200)
                .message("Product deleted successfully")
                .build();
    }

    public Response updateStock(Long productId, Integer quantity, String operation) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new NotFoundException("Product not found with id: " + productId));

        int currentStock = product.getStockQuantity();
        int newStock;

        switch (operation.toLowerCase()) {
            case "add":
                newStock = currentStock + quantity;
                break;
            case "subtract":
                newStock = currentStock - quantity;
                if (newStock < 0) {
                    throw new NameValueRequiredException("Insufficient stock. Available: " + currentStock + ", Requested: " + quantity);
                }
                break;
            case "set":
                newStock = quantity;
                break;
            default:
                throw new NameValueRequiredException("Invalid operation. Use 'add', 'subtract', or 'set'");
        }

        product.setStockQuantity(newStock);
        Product updatedProduct = productRepository.save(product);
        ProductDTO updatedProductDTO = convertToDTO(updatedProduct);

        return Response.builder()
                .status(200)
                .message("Stock updated successfully")
                .product(updatedProductDTO)
                .build();
    }

    private void validateProductDTO(ProductDTO productDTO) {
        if (productDTO.getName() == null || productDTO.getName().trim().isEmpty()) {
            throw new NameValueRequiredException("Product name is required");
        }
        if (productDTO.getSku() == null || productDTO.getSku().trim().isEmpty()) {
            throw new NameValueRequiredException("Product SKU is required");
        }
        if (productDTO.getPrice() == null || productDTO.getPrice().compareTo(java.math.BigDecimal.ZERO) <= 0) {
            throw new NameValueRequiredException("Product price must be greater than 0");
        }
        if (productDTO.getStockQuantity() == null || productDTO.getStockQuantity() < 0) {
            throw new NameValueRequiredException("Stock quantity cannot be negative");
        }
        if (productDTO.getCategoryId() == null) {
            throw new NameValueRequiredException("Category is required");
        }
    }

    private ProductDTO convertToDTO(Product product) {
        ProductDTO productDTO = modelMapper.map(product, ProductDTO.class);
        if (product.getCategory() != null) {
            productDTO.setCategoryId(product.getCategory().getId());
        }
        return productDTO;
    }
}
