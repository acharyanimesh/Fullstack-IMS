import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button, Input, Alert, Loading } from '../components/ui';
import ApiService from '../service/ApiService';

const CategoryFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [initialLoading, setInitialLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchCategory();
    }
  }, [id, isEdit]);

  const fetchCategory = async () => {
    try {
      setInitialLoading(true);
      const response = await ApiService.getCategoryById(id);
      
      if (response.status === 200 && response.category) {
        setFormData({
          name: response.category.name || '',
          description: response.category.description || ''
        });
      } else {
        setError('Category not found');
        setTimeout(() => navigate('/categories'), 2000);
      }
    } catch (error) {
      console.error('Error fetching category:', error);
      setError(error.message || 'Failed to fetch category');
      setTimeout(() => navigate('/categories'), 2000);
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

    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Category name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Category name must be less than 100 characters';
    }

    if (formData.description && formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
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

      const categoryData = {
        name: formData.name.trim(),
        description: formData.description.trim()
      };

      let response;
      if (isEdit) {
        response = await ApiService.updateCategory(id, categoryData);
      } else {
        response = await ApiService.createCategory(categoryData);
      }

      if (response.status === 200 || response.status === 201) {
        setSuccess(`Category ${isEdit ? 'updated' : 'created'} successfully!`);
        setTimeout(() => {
          navigate('/categories');
        }, 1500);
      } else {
        setError(response.message || `Failed to ${isEdit ? 'update' : 'create'} category`);
      }
    } catch (error) {
      console.error('Error saving category:', error);
      
      if (error.validationErrors) {
        setErrors(error.validationErrors);
      } else {
        setError(error.message || `Failed to ${isEdit ? 'update' : 'create'} category`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/categories');
  };

  if (initialLoading) {
    return (
      <Layout>
        <Loading fullScreen text="Loading category..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Category' : 'Add New Category'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Update category information' : 'Create a new product category'}
          </p>
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
              {/* Category Name */}
              <Input
                label="Category Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter category name"
                error={errors.name}
                required
                disabled={loading}
              />

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter category description (optional)"
                  rows={4}
                  disabled={loading}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                    errors.description
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.description.length}/500 characters
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
                loading={loading}
                disabled={loading}
              >
                {isEdit ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CategoryFormPage;
