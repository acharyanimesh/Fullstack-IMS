import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button, Input, Alert, Loading } from '../components/ui';
import ApiService from '../service/ApiService';

const SupplierFormPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    address: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [initialLoading, setInitialLoading] = useState(isEdit);

  useEffect(() => {
    if (isEdit) {
      fetchSupplier();
    }
  }, [id, isEdit]);

  const fetchSupplier = async () => {
    try {
      setInitialLoading(true);
      const response = await ApiService.getSupplierById(id);
      
      if (response.status === 200 && response.supplier) {
        setFormData({
          name: response.supplier.name || '',
          email: response.supplier.email || '',
          phoneNumber: response.supplier.phoneNumber || '',
          address: response.supplier.address || ''
        });
      } else {
        setError('Supplier not found');
        setTimeout(() => navigate('/suppliers'), 2000);
      }
    } catch (error) {
      console.error('Error fetching supplier:', error);
      setError(error.message || 'Failed to fetch supplier');
      setTimeout(() => navigate('/suppliers'), 2000);
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

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Supplier name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Supplier name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Supplier name must be less than 100 characters';
    }

    // Email validation
    if (formData.email && formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (formData.phoneNumber && formData.phoneNumber.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.phoneNumber.trim().replace(/[\s\-\(\)]/g, ''))) {
        newErrors.phoneNumber = 'Please enter a valid phone number';
      }
    }

    // Address validation
    if (formData.address && formData.address.length > 500) {
      newErrors.address = 'Address must be less than 500 characters';
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

      const supplierData = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phoneNumber: formData.phoneNumber.trim() || null,
        address: formData.address.trim() || null
      };

      let response;
      if (isEdit) {
        response = await ApiService.updateSupplier(id, supplierData);
      } else {
        response = await ApiService.createSupplier(supplierData);
      }

      if (response.status === 200 || response.status === 201) {
        setSuccess(`Supplier ${isEdit ? 'updated' : 'created'} successfully!`);
        setTimeout(() => {
          navigate('/suppliers');
        }, 1500);
      } else {
        setError(response.message || `Failed to ${isEdit ? 'update' : 'create'} supplier`);
      }
    } catch (error) {
      console.error('Error saving supplier:', error);
      
      if (error.validationErrors) {
        setErrors(error.validationErrors);
      } else {
        setError(error.message || `Failed to ${isEdit ? 'update' : 'create'} supplier`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/suppliers');
  };

  if (initialLoading) {
    return (
      <Layout>
        <Loading fullScreen text="Loading supplier..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Supplier' : 'Add New Supplier'}
          </h1>
          <p className="text-gray-600">
            {isEdit ? 'Update supplier information' : 'Create a new supplier'}
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
              {/* Supplier Name */}
              <Input
                label="Supplier Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter supplier name"
                error={errors.name}
                required
                disabled={loading}
              />

              {/* Email */}
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address (optional)"
                error={errors.email}
                disabled={loading}
              />

              {/* Phone Number */}
              <Input
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                placeholder="Enter phone number (optional)"
                error={errors.phoneNumber}
                disabled={loading}
              />

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter supplier address (optional)"
                  rows={3}
                  disabled={loading}
                  className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${
                    errors.address
                      ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                      : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
                  } ${loading ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  {formData.address.length}/500 characters
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
                {isEdit ? 'Update Supplier' : 'Create Supplier'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default SupplierFormPage;
