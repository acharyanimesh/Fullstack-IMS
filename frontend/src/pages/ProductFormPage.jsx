import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button, Input, Select, Alert } from '../components/ui';
import ApiService from '../service/ApiService';

const ProductFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    stockQuantity: '',
    description: '',
    categoryId: '',
    suppliersId: '',
    imageUrl: '',
    expiryDate: ''
  });

  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchSuppliers();
    if (isEdit) {
      fetchProduct();
    }
  }, [id, isEdit]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getProductById(id);
      if (response.status === 200) {
        const product = response.product;
        setFormData({
          name: product.name || '',
          sku: product.sku || '',
          price: product.price || '',
          stockQuantity: product.stockQuantity || '',
          description: product.description || '',
          categoryId: product.categoryId || '',
          suppliersId: product.suppliersId || '',
          imageUrl: product.imageUrl || '',
          expiryDate: product.expiryDate ? product.expiryDate.split('T')[0] : ''
        });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await ApiService.getAllCategories(0, 100);
      if (response.status === 200) {
        setCategories(response.categories || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSuppliers = async () => {
    try {
      const response = await ApiService.getAllSuppliers(0, 100);
      if (response.status === 200) {
        setSuppliers(response.suppliers || []);
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
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

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'SKU is required';
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }

    if (!formData.stockQuantity || parseInt(formData.stockQuantity) < 0) {
      newErrors.stockQuantity = 'Valid stock quantity is required';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        categoryId: parseInt(formData.categoryId),
        suppliersId: formData.suppliersId ? parseInt(formData.suppliersId) : null,
        expiryDate: formData.expiryDate || null
      };

      let response;
      if (isEdit) {
        response = await ApiService.updateProduct(id, productData);
      } else {
        response = await ApiService.createProduct(productData);
      }

      if (response.status === 200 || response.status === 201) {
        setSuccess(`Product ${isEdit ? 'updated' : 'created'} successfully!`);
        setTimeout(() => {
          navigate('/products');
        }, 1500);
      } else {
        setError(response.message || `Failed to ${isEdit ? 'update' : 'create'} product`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      setError(error.message || `Failed to ${isEdit ? 'update' : 'create'} product`);
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name
  }));

  const supplierOptions = suppliers.map(supplier => ({
    value: supplier.id,
    label: supplier.name
  }));

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Product' : 'Add New Product'}
            </h1>
            <p className="text-gray-600">
              {isEdit ? 'Update product information' : 'Create a new product in your inventory'}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}

        {success && (
          <Alert type="success" message={success} />
        )}

        {/* Form */}
        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                error={errors.name}
                required
                placeholder="Enter product name"
              />

              <Input
                label="SKU"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                error={errors.sku}
                required
                placeholder="Enter SKU"
              />

              <Input
                label="Price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                error={errors.price}
                required
                placeholder="0.00"
              />

              <Input
                label="Stock Quantity"
                name="stockQuantity"
                type="number"
                value={formData.stockQuantity}
                onChange={handleInputChange}
                error={errors.stockQuantity}
                required
                placeholder="0"
              />

              <Select
                label="Category"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                options={categoryOptions}
                error={errors.categoryId}
                required
                placeholder="Select a category"
              />

              <Select
                label="Supplier"
                name="suppliersId"
                value={formData.suppliersId}
                onChange={handleInputChange}
                options={supplierOptions}
                placeholder="Select a supplier (optional)"
              />

              <Input
                label="Image URL"
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />

              <Input
                label="Expiry Date"
                name="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter product description"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/products')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                loading={loading}
                disabled={loading}
              >
                {isEdit ? 'Update Product' : 'Create Product'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default ProductFormPage;
