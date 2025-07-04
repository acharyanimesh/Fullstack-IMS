import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button, Input, Alert, Loading } from '../components/ui';
import ApiService from '../service/ApiService';

const UserProfilePage = () => {
  const navigate = useNavigate();
  
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    role: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState({});
  const [initialLoading, setInitialLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      setInitialLoading(true);
      const response = await ApiService.getCurrentUser();
      
      if (response.status === 200 && response.user) {
        const userData = response.user;
        setUser(userData);
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          phoneNumber: userData.phoneNumber || '',
          role: userData.role || ''
        });
      } else {
        setError('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError(error.message || 'Failed to fetch user profile');
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
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'Name must be less than 100 characters';
    }

    // Phone validation (optional)
    if (formData.phoneNumber && formData.phoneNumber.trim()) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(formData.phoneNumber.trim().replace(/[\s\-\(\)]/g, ''))) {
        newErrors.phoneNumber = 'Please enter a valid phone number';
      }
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

      const updateData = {
        name: formData.name.trim(),
        phoneNumber: formData.phoneNumber.trim() || null
      };

      const response = await ApiService.updateCurrentUser(updateData);

      if (response.status === 200) {
        setSuccess('Profile updated successfully!');
        setUser(response.user);
        setIsEditing(false);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      
      if (error.validationErrors) {
        setErrors(error.validationErrors);
      } else {
        setError(error.message || 'Failed to update profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        role: user.role || ''
      });
    }
    setIsEditing(false);
    setErrors({});
  };

  const handleLogout = () => {
    ApiService.logout();
    navigate('/login');
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      ADMIN: 'bg-red-100 text-red-800',
      MANAGER: 'bg-blue-100 text-blue-800',
      USER: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[role] || 'bg-gray-100 text-gray-800'}`}>
        {role}
      </span>
    );
  };

  if (initialLoading) {
    return (
      <Layout>
        <Loading fullScreen text="Loading profile..." />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
            <p className="text-gray-600">Manage your account information</p>
          </div>
          <div className="flex space-x-3">
            {!isEditing && (
              <Button
                variant="outline"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
            <Button
              variant="danger"
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
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

        {/* Profile Card */}
        <div className="bg-white shadow rounded-lg">
          {!isEditing ? (
            // View Mode
            <div className="p-6">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-indigo-600">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">{user?.name || 'N/A'}</h2>
                    <p className="text-gray-600">{user?.email || 'N/A'}</p>
                    <div className="mt-1">
                      {getRoleBadge(user?.role)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name
                    </label>
                    <p className="text-gray-900">{user?.name || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <p className="text-gray-900">{user?.email || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <p className="text-gray-900">{user?.phoneNumber || 'Not provided'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <div>{getRoleBadge(user?.role)}</div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Member Since
                    </label>
                    <p className="text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Updated
                    </label>
                    <p className="text-gray-900">
                      {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            // Edit Mode
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-6">
                {/* Name */}
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  error={errors.name}
                  required
                  disabled={loading}
                />

                {/* Email (Read-only) */}
                <Input
                  label="Email Address"
                  name="email"
                  value={formData.email}
                  placeholder="Email cannot be changed"
                  disabled={true}
                />

                {/* Phone Number */}
                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number (optional)"
                  error={errors.phoneNumber}
                  disabled={loading}
                />

                {/* Role (Read-only) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <div className="mt-1">
                    {getRoleBadge(formData.role)}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">Role cannot be changed</p>
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
                  Save Changes
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UserProfilePage;
