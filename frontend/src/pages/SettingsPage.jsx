import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button, Alert } from '../components/ui';
import ApiService from '../service/ApiService';

const SettingsPage = () => {
  const navigate = useNavigate();
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    ApiService.logout();
    navigate('/login');
  };

  const handleClearCache = () => {
    try {
      // Clear any cached data (if we had any)
      setSuccess('Cache cleared successfully!');
    } catch (error) {
      setError('Failed to clear cache');
    }
  };

  const handleExportData = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // This would typically call an API endpoint to export user data
      // For now, we'll just show a success message
      setSuccess('Data export feature will be available soon!');
    } catch (error) {
      setError('Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const settingSections = [
    {
      title: 'Account',
      description: 'Manage your account settings',
      items: [
        {
          title: 'Profile Information',
          description: 'Update your personal information and contact details',
          action: () => navigate('/profile'),
          buttonText: 'Edit Profile',
          variant: 'primary'
        },
        {
          title: 'Logout',
          description: 'Sign out of your account',
          action: handleLogout,
          buttonText: 'Logout',
          variant: 'danger'
        }
      ]
    },
    {
      title: 'Data & Privacy',
      description: 'Manage your data and privacy settings',
      items: [
        {
          title: 'Export Data',
          description: 'Download a copy of your data',
          action: handleExportData,
          buttonText: 'Export Data',
          variant: 'outline',
          loading: loading
        },
        {
          title: 'Clear Cache',
          description: 'Clear locally stored cache data',
          action: handleClearCache,
          buttonText: 'Clear Cache',
          variant: 'outline'
        }
      ]
    },
    {
      title: 'System Information',
      description: 'Information about the system',
      items: [
        {
          title: 'Version',
          description: 'Inventory Management System v1.0.0',
          action: null,
          buttonText: null
        },
        {
          title: 'Backend API',
          description: `Connected to: ${ApiService.BASE_URL}`,
          action: null,
          buttonText: null
        }
      ]
    }
  ];

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your application preferences and account settings</p>
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

        {/* Settings Sections */}
        <div className="space-y-6">
          {settingSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">{section.title}</h2>
                <p className="text-sm text-gray-600">{section.description}</p>
              </div>
              <div className="divide-y divide-gray-200">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="px-6 py-4 flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    {item.action && item.buttonText && (
                      <div className="ml-4">
                        <Button
                          variant={item.variant || 'primary'}
                          size="sm"
                          onClick={item.action}
                          loading={item.loading}
                          disabled={item.loading}
                        >
                          {item.buttonText}
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* User Information Card */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Current Session Information
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Role: <span className="font-medium">{ApiService.getRole() || 'Unknown'}</span></p>
                <p>Authentication: <span className="font-medium">{ApiService.isAuthenticated() ? 'Active' : 'Inactive'}</span></p>
                <p>Admin Access: <span className="font-medium">{ApiService.isAdmin() ? 'Yes' : 'No'}</span></p>
              </div>
            </div>
          </div>
        </div>

        {/* Help Section */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Need Help?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="text-sm">
              <h4 className="font-medium text-gray-900 mb-2">Quick Actions</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• View and manage products in the Products section</li>
                <li>• Process purchases and sales in Transactions</li>
                <li>• Monitor inventory levels on the Dashboard</li>
              </ul>
            </div>
            <div className="text-sm">
              <h4 className="font-medium text-gray-900 mb-2">Admin Features</h4>
              <ul className="space-y-1 text-gray-600">
                <li>• Manage categories (Admin only)</li>
                <li>• Add and edit suppliers</li>
                <li>• View system-wide analytics</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
