import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button, Table, Input, Modal, Alert, Loading } from '../components/ui';
import ApiService from '../service/ApiService';

const CategoryListPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);
  
  // Delete modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [currentPage]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAllCategories(currentPage, pageSize);
      
      if (response.status === 200) {
        setCategories(response.categories || []);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
      } else {
        setError('Failed to fetch categories');
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError(error.message || 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredCategories = categories.filter(category =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (category) => {
    navigate(`/categories/edit/${category.id}`);
  };

  const handleDelete = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;

    try {
      setDeleteLoading(true);
      const response = await ApiService.deleteCategory(categoryToDelete.id);
      
      if (response.status === 200) {
        setSuccess('Category deleted successfully');
        setShowDeleteModal(false);
        setCategoryToDelete(null);
        fetchCategories(); // Refresh the list
      } else {
        setError('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      setError(error.message || 'Failed to delete category');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      key: 'name',
      header: 'Name',
      render: (category) => (
        <div className="font-medium text-gray-900">{category.name}</div>
      )
    },
    {
      key: 'description',
      header: 'Description',
      render: (category) => (
        <div className="text-gray-600 max-w-xs truncate">
          {category.description || 'No description'}
        </div>
      )
    },
    {
      key: 'productCount',
      header: 'Products',
      render: (category) => (
        <div className="text-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {category.productCount || 0}
          </span>
        </div>
      )
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (category) => (
        <div className="text-sm text-gray-500">
          {category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'N/A'}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (category) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(category)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(category)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600">Manage product categories</p>
          </div>
          <Button onClick={() => navigate('/categories/new')}>
            Add Category
          </Button>
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

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <div></div>
            <div className="flex items-center text-sm text-gray-600">
              Showing {filteredCategories.length} of {totalElements} categories
            </div>
          </div>
        </div>

        {/* Categories Table */}
        <Table
          columns={columns}
          data={filteredCategories}
          loading={loading}
          emptyMessage="No categories found"
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center space-x-2">
            <Button
              variant="outline"
              disabled={currentPage === 0}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </Button>
            <span className="flex items-center px-4 py-2 text-sm text-gray-700">
              Page {currentPage + 1} of {totalPages}
            </span>
            <Button
              variant="outline"
              disabled={currentPage >= totalPages - 1}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Delete Category"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete the category "{categoryToDelete?.name}"? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                loading={deleteLoading}
              >
                Delete
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default CategoryListPage;
