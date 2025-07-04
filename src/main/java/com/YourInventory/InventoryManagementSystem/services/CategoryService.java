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

import com.YourInventory.InventoryManagementSystem.dtos.CategoryDTO;
import com.YourInventory.InventoryManagementSystem.dtos.Response;
import com.YourInventory.InventoryManagementSystem.exceptions.NameValueRequiredException;
import com.YourInventory.InventoryManagementSystem.exceptions.NotFoundException;
import com.YourInventory.InventoryManagementSystem.model.Category;
import com.YourInventory.InventoryManagementSystem.repositories.CategoryRepository;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ModelMapper modelMapper;

    public Response getAllCategories(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Category> categoryPage = categoryRepository.findAll(pageable);

        List<CategoryDTO> categoryDTOs = categoryPage.getContent().stream()
                .map(category -> modelMapper.map(category, CategoryDTO.class))
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .message("Categories retrieved successfully")
                .categories(categoryDTOs)
                .totalPages(categoryPage.getTotalPages())
                .totalElements(categoryPage.getTotalElements())
                .build();
    }

    public Response getAllCategoriesWithoutPagination() {
        List<Category> categories = categoryRepository.findAll(Sort.by("name").ascending());

        List<CategoryDTO> categoryDTOs = categories.stream()
                .map(category -> modelMapper.map(category, CategoryDTO.class))
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .message("Categories retrieved successfully")
                .categories(categoryDTOs)
                .build();
    }

    public Response getCategoryById(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category not found with id: " + categoryId));

        CategoryDTO categoryDTO = modelMapper.map(category, CategoryDTO.class);

        return Response.builder()
                .status(200)
                .message("Category retrieved successfully")
                .category(categoryDTO)
                .build();
    }

    public Response createCategory(CategoryDTO categoryDTO) {
        if (categoryDTO.getName() == null || categoryDTO.getName().trim().isEmpty()) {
            throw new NameValueRequiredException("Category name is required");
        }

        // Check if category with same name already exists
        if (categoryRepository.existsByNameIgnoreCase(categoryDTO.getName().trim())) {
            throw new NameValueRequiredException("Category with name '" + categoryDTO.getName() + "' already exists");
        }

        Category category = Category.builder()
                .name(categoryDTO.getName().trim())
                .build();

        Category savedCategory = categoryRepository.save(category);
        CategoryDTO savedCategoryDTO = modelMapper.map(savedCategory, CategoryDTO.class);

        return Response.builder()
                .status(200)
                .message("Category created successfully")
                .category(savedCategoryDTO)
                .build();
    }

    public Response updateCategory(Long categoryId, CategoryDTO categoryDTO) {
        Category existingCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category not found with id: " + categoryId));

        if (categoryDTO.getName() == null || categoryDTO.getName().trim().isEmpty()) {
            throw new NameValueRequiredException("Category name is required");
        }

        // Check if another category with same name already exists
        if (categoryRepository.existsByNameIgnoreCaseAndIdNot(categoryDTO.getName().trim(), categoryId)) {
            throw new NameValueRequiredException("Category with name '" + categoryDTO.getName() + "' already exists");
        }

        existingCategory.setName(categoryDTO.getName().trim());

        Category updatedCategory = categoryRepository.save(existingCategory);
        CategoryDTO updatedCategoryDTO = modelMapper.map(updatedCategory, CategoryDTO.class);

        return Response.builder()
                .status(200)
                .message("Category updated successfully")
                .category(updatedCategoryDTO)
                .build();
    }

    public Response deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new NotFoundException("Category not found with id: " + categoryId));

        // Check if category has products
        if (category.getProducts() != null && !category.getProducts().isEmpty()) {
            throw new NameValueRequiredException("Cannot delete category that has products. Please reassign or delete products first.");
        }

        categoryRepository.delete(category);

        return Response.builder()
                .status(200)
                .message("Category deleted successfully")
                .build();
    }
}
