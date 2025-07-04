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

import com.YourInventory.InventoryManagementSystem.dtos.Response;
import com.YourInventory.InventoryManagementSystem.dtos.SupplierDTO;
import com.YourInventory.InventoryManagementSystem.exceptions.NameValueRequiredException;
import com.YourInventory.InventoryManagementSystem.exceptions.NotFoundException;
import com.YourInventory.InventoryManagementSystem.model.Supplier;
import com.YourInventory.InventoryManagementSystem.repositories.SupplierRepository;

@Service
public class SupplierService {

    @Autowired
    private SupplierRepository supplierRepository;

    @Autowired
    private ModelMapper modelMapper;

    public Response getAllSuppliers(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("name").ascending());
        Page<Supplier> supplierPage = supplierRepository.findAll(pageable);

        List<SupplierDTO> supplierDTOs = supplierPage.getContent().stream()
                .map(supplier -> modelMapper.map(supplier, SupplierDTO.class))
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .message("Suppliers retrieved successfully")
                .suppliers(supplierDTOs)
                .totalPages(supplierPage.getTotalPages())
                .totalElements(supplierPage.getTotalElements())
                .build();
    }

    public Response getAllSuppliersWithoutPagination() {
        List<Supplier> suppliers = supplierRepository.findAll(Sort.by("name").ascending());

        List<SupplierDTO> supplierDTOs = suppliers.stream()
                .map(supplier -> modelMapper.map(supplier, SupplierDTO.class))
                .collect(Collectors.toList());

        return Response.builder()
                .status(200)
                .message("Suppliers retrieved successfully")
                .suppliers(supplierDTOs)
                .build();
    }

    public Response getSupplierById(Long supplierId) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new NotFoundException("Supplier not found with id: " + supplierId));

        SupplierDTO supplierDTO = modelMapper.map(supplier, SupplierDTO.class);

        return Response.builder()
                .status(200)
                .message("Supplier retrieved successfully")
                .supplier(supplierDTO)
                .build();
    }

    public Response createSupplier(SupplierDTO supplierDTO) {
        if (supplierDTO.getName() == null || supplierDTO.getName().trim().isEmpty()) {
            throw new NameValueRequiredException("Supplier name is required");
        }

        if (supplierDTO.getContactInfo() == null || supplierDTO.getContactInfo().trim().isEmpty()) {
            throw new NameValueRequiredException("Supplier contact info is required");
        }

        // Check if supplier with same name already exists
        if (supplierRepository.existsByNameIgnoreCase(supplierDTO.getName().trim())) {
            throw new NameValueRequiredException("Supplier with name '" + supplierDTO.getName() + "' already exists");
        }

        Supplier supplier = Supplier.builder()
                .name(supplierDTO.getName().trim())
                .contactInfo(supplierDTO.getContactInfo().trim())
                .address(supplierDTO.getAddress() != null ? supplierDTO.getAddress().trim() : null)
                .build();

        Supplier savedSupplier = supplierRepository.save(supplier);
        SupplierDTO savedSupplierDTO = modelMapper.map(savedSupplier, SupplierDTO.class);

        return Response.builder()
                .status(200)
                .message("Supplier created successfully")
                .supplier(savedSupplierDTO)
                .build();
    }

    public Response updateSupplier(Long supplierId, SupplierDTO supplierDTO) {
        Supplier existingSupplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new NotFoundException("Supplier not found with id: " + supplierId));

        if (supplierDTO.getName() == null || supplierDTO.getName().trim().isEmpty()) {
            throw new NameValueRequiredException("Supplier name is required");
        }

        if (supplierDTO.getContactInfo() == null || supplierDTO.getContactInfo().trim().isEmpty()) {
            throw new NameValueRequiredException("Supplier contact info is required");
        }

        // Check if another supplier with same name already exists
        if (supplierRepository.existsByNameIgnoreCaseAndIdNot(supplierDTO.getName().trim(), supplierId)) {
            throw new NameValueRequiredException("Supplier with name '" + supplierDTO.getName() + "' already exists");
        }

        existingSupplier.setName(supplierDTO.getName().trim());
        existingSupplier.setContactInfo(supplierDTO.getContactInfo().trim());
        existingSupplier.setAddress(supplierDTO.getAddress() != null ? supplierDTO.getAddress().trim() : null);

        Supplier updatedSupplier = supplierRepository.save(existingSupplier);
        SupplierDTO updatedSupplierDTO = modelMapper.map(updatedSupplier, SupplierDTO.class);

        return Response.builder()
                .status(200)
                .message("Supplier updated successfully")
                .supplier(updatedSupplierDTO)
                .build();
    }

    public Response deleteSupplier(Long supplierId) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .orElseThrow(() -> new NotFoundException("Supplier not found with id: " + supplierId));

        supplierRepository.delete(supplier);

        return Response.builder()
                .status(200)
                .message("Supplier deleted successfully")
                .build();
    }
}
