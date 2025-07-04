import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button, Table, Input, Modal, Alert, Loading } from '../components/ui';
import ApiService from '../service/ApiService';

const SupplierListPage = () => {
  const navigate = useNavigate();
  const [suppliers, setSuppliers] = useState([]);
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
  const [supplierToDelete, setSupplierToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchSuppliers();
  }, [currentPage]);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getAllSuppliers(currentPage, pageSize);
      
      if (response.status === 200) {
        setSuppliers(response.suppliers || []);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
      } else {
        setError('Failed to fetch suppliers');
      }
    } catch (error) {
      console.error('Error fetching suppliers:', error);
      setError(error.message || 'Failed to fetch suppliers');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phoneNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (supplier) => {
    navigate(`/suppliers/edit/${supplier.id}`);
  };

  const handleDelete = (supplier) => {
    setSupplierToDelete(supplier);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!supplierToDelete) return;

    try {
      setDeleteLoading(true);
      const response = await ApiService.deleteSupplier(supplierToDelete.id);
      
      if (response.status === 200) {
        setSuccess('Supplier deleted successfully');
        setShowDeleteModal(false);
        setSupplierToDelete(null);
        fetchSuppliers(); // Refresh the list
      } else {
        setError('Failed to delete supplier');
      }
    } catch (error) {
      console.error('Error deleting supplier:', error);
      setError(error.message || 'Failed to delete supplier');
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
      render: (supplier) => (
        <div className="font-medium text-gray-900">{supplier.name}</div>
      )
    },
    {
      key: 'email',
      header: 'Email',
      render: (supplier) => (
        <div className="text-gray-600">{supplier.email || 'N/A'}</div>
      )
    },
    {
      key: 'phoneNumber',
      header: 'Phone',
      render: (supplier) => (
        <div className="text-gray-600">{supplier.phoneNumber || 'N/A'}</div>
      )
    },
    {
      key: 'address',
      header: 'Address',
      render: (supplier) => (
        <div className="text-gray-600 max-w-xs truncate">
          {supplier.address || 'N/A'}
        </div>
      )
    },
    {
      key: 'productCount',
      header: 'Products',
      render: (supplier) => (
        <div className="text-center">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            {supplier.productCount || 0}
          </span>
        </div>
      )
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (supplier) => (
        <div className="text-sm text-gray-500">
          {supplier.createdAt ? new Date(supplier.createdAt).toLocaleDateString() : 'N/A'}
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (supplier) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(supplier)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(supplier)}
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
            <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
            <p className="text-gray-600">Manage your suppliers</p>
          </div>
          <Button onClick={() => navigate('/suppliers/new')}>
            Add Supplier
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
              placeholder="Search suppliers..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <div></div>
            <div className="flex items-center text-sm text-gray-600">
              Showing {filteredSuppliers.length} of {totalElements} suppliers
            </div>
          </div>
        </div>

        {/* Suppliers Table */}
        <Table
          columns={columns}
          data={filteredSuppliers}
          loading={loading}
          emptyMessage="No suppliers found"
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
          title="Delete Supplier"
          size="sm"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              Are you sure you want to delete the supplier "{supplierToDelete?.name}"? 
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

export default SupplierListPage;
