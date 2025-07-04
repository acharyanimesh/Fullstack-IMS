import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button, Input, Select, Alert, Loading } from '../components/ui';
import ApiService from '../service/ApiService';

const PurchasePage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    unitPrice: '',
    notes: ''
  });

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setInitialLoading(true);
      const response = await ApiService.getAllProducts(0, 1000); // Get all products
      
      if (response.status === 200) {
        setProducts(response.products || []);
      } else {
        setError('Failed to fetch products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Failed to fetch products');
    } finally {
      setInitialLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.productId) {
      newErrors.productId = 'Please select a product';
    }

    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required';
    } else if (parseInt(formData.quantity) <= 0) {
      newErrors.quantity = 'Quantity must be greater than 0';
    } else if (parseInt(formData.quantity) > 10000) {
      newErrors.quantity = 'Quantity cannot exceed 10,000';
    }

    if (!formData.unitPrice) {
      newErrors.unitPrice = 'Unit price is required';
    } else if (parseFloat(formData.unitPrice) <= 0) {
      newErrors.unitPrice = 'Unit price must be greater than 0';
    } else if (parseFloat(formData.unitPrice) > 1000000) {
      newErrors.unitPrice = 'Unit price cannot exceed $1,000,000';
    }

    if (formData.notes && formData.notes.length > 500) {
      newErrors.notes = 'Notes must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const transactionData = {
        productId: parseInt(formData.productId),
        quantity: parseInt(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice),
        notes: formData.notes.trim() || null
      };

      const response = await ApiService.purchaseProduct(transactionData);

      if (response.status === 200 || response.status === 201) {
        setSuccess('Purchase transaction created successfully!');
        setTimeout(() => {
          navigate('/transactions');
        }, 2000);
      } else {
        setError(response.message || 'Failed to create purchase transaction');
      }
    } catch (error) {
      console.error('Error creating purchase:', error);
      
      if (error.validationErrors) {
        setErrors(error.validationErrors);
      } else {
        setError(error.message || 'Failed to create purchase transaction');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/transactions');
  };

  const selectedProduct = products.find(p => p.id === parseInt(formData.productId));
  const totalAmount = formData.quantity && formData.unitPrice 
    ? (parseInt(formData.quantity) * parseFloat(formData.unitPrice)).toFixed(2)
    : '0.00';

  const productOptions = products.map(product => ({
    value: product.id,
    label: `${product.name} (SKU: ${product.sku}) - Current Stock: ${product.stockQuantity}`
  }));

  if (initialLoading) {
    return (
      <Layout>
        <Loading fullScreen text="Loading products..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Purchase Products</h1>
          <p className="text-gray-600">Add inventory by purchasing products</p>
        </div>

        {/* Alerts */}
        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError('')}
          />
        )}
        {success && (
          <Alert
            type="success"
            message={success}
            onClose={() => setSuccess('')}
          />
        )}

        {/* Form */}
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {/* Product Selection */}
              <Select
                label="Product"
                name="productId"
                value={formData.productId}
                onChange={handleInputChange}
                options={productOptions}
                placeholder="Select a product"
                error={errors.productId}
                required
                disabled={loading}
              />

              {/* Selected Product Info */}
              {selectedProduct && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">Product Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Name:</span>
                      <span className="ml-2 font-medium">{selectedProduct.name}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">SKU:</span>
                      <span className="ml-2 font-medium">{selectedProduct.sku}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Current Stock:</span>
                      <span className="ml-2 font-medium">{selectedProduct.stockQuantity}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Current Price:</span>
                      <span className="ml-2 font-medium">${selectedProduct.price?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity */}
              <Input
                label="Quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Enter quantity to purchase"
                error={errors.quantity}
                required
                disabled={loading}
                min="1"
                max="10000"
              />

              {/* Unit Price */}
              <Input
                label="Unit Price"
                name="unitPrice"
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={handleInputChange}
                placeholder="Enter unit price"
                error={errors.unitPrice}
                required
                disabled={loading}
                min="0.01"
                max="1000000"
              />

              {/* Total Amount Display */}
              {(formData.quantity && formData.unitPrice) && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-medium text-gray-900">Total Amount:</span>
                    <span className="text-2xl font-bold text-blue-600">${totalAmount}</span>
                  </div>
                </div>
              )}

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes (Optional)
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  placeholder="Enter any additional notes about this purchase"
                  rows={3}
                  disabled={loading}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                    errors.notes
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                />
                {errors.notes && (
                  <p className="mt-1 text-sm text-red-600">{errors.notes}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.notes.length}/500 characters
                </p>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="success"
                loading={loading}
                disabled={loading || !formData.productId}
              >
                Create Purchase
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PurchasePage;
