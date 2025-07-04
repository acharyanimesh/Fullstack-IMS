import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button, Table, Input, Select, Alert, Loading } from '../components/ui';
import ApiService from '../service/ApiService';

const TransactionListPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [pageSize] = useState(10);

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, selectedType, selectedStatus]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      let response;

      if (selectedType) {
        response = await ApiService.getTransactionsByType(selectedType, currentPage, pageSize);
      } else if (selectedStatus) {
        response = await ApiService.getTransactionsByStatus(selectedStatus, currentPage, pageSize);
      } else {
        response = await ApiService.getAllTransactions(currentPage, pageSize);
      }
      
      if (response.status === 200) {
        setTransactions(response.transactions || []);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
      } else {
        setError('Failed to fetch transactions');
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError(error.message || 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeFilter = (e) => {
    setSelectedType(e.target.value);
    setSelectedStatus(''); // Clear status filter when type is selected
    setCurrentPage(0);
  };

  const handleStatusFilter = (e) => {
    setSelectedStatus(e.target.value);
    setSelectedType(''); // Clear type filter when status is selected
    setCurrentPage(0);
  };

  const filteredTransactions = transactions.filter(transaction =>
    transaction.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.transactionType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.transactionStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.id?.toString().includes(searchTerm)
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      PROCESSING: 'bg-blue-100 text-blue-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    const typeColors = {
      PURCHASE: 'bg-blue-100 text-blue-800',
      SALE: 'bg-green-100 text-green-800',
      RETURN: 'bg-orange-100 text-orange-800'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColors[type] || 'bg-gray-100 text-gray-800'}`}>
        {type}
      </span>
    );
  };

  const typeOptions = [
    { value: '', label: 'All Types' },
    { value: 'PURCHASE', label: 'Purchase' },
    { value: 'SALE', label: 'Sale' },
    { value: 'RETURN', label: 'Return' }
  ];

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'PENDING', label: 'Pending' },
    { value: 'PROCESSING', label: 'Processing' },
    { value: 'COMPLETED', label: 'Completed' },
    { value: 'CANCELLED', label: 'Cancelled' }
  ];

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (transaction) => (
        <div className="font-medium text-gray-900">#{transaction.id}</div>
      )
    },
    {
      key: 'product',
      header: 'Product',
      render: (transaction) => (
        <div>
          <div className="font-medium text-gray-900">{transaction.product?.name || 'N/A'}</div>
          <div className="text-sm text-gray-500">SKU: {transaction.product?.sku || 'N/A'}</div>
        </div>
      )
    },
    {
      key: 'type',
      header: 'Type',
      render: (transaction) => getTypeBadge(transaction.transactionType)
    },
    {
      key: 'quantity',
      header: 'Quantity',
      render: (transaction) => (
        <div className="text-center font-medium">{transaction.quantity}</div>
      )
    },
    {
      key: 'unitPrice',
      header: 'Unit Price',
      render: (transaction) => (
        <div className="font-medium">${transaction.unitPrice?.toFixed(2) || '0.00'}</div>
      )
    },
    {
      key: 'totalAmount',
      header: 'Total',
      render: (transaction) => (
        <div className="font-bold text-gray-900">${transaction.totalAmount?.toFixed(2) || '0.00'}</div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (transaction) => getStatusBadge(transaction.transactionStatus)
    },
    {
      key: 'date',
      header: 'Date',
      render: (transaction) => (
        <div className="text-sm text-gray-500">
          {transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : 'N/A'}
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
            <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
            <p className="text-gray-600">View and manage all transactions</p>
          </div>
          <div className="flex space-x-3">
            <Button 
              variant="success" 
              onClick={() => navigate('/purchase')}
            >
              Purchase
            </Button>
            <Button 
              variant="primary" 
              onClick={() => navigate('/sell')}
            >
              Sell
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

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <Select
              placeholder="Filter by type"
              value={selectedType}
              onChange={handleTypeFilter}
              options={typeOptions}
            />
            <Select
              placeholder="Filter by status"
              value={selectedStatus}
              onChange={handleStatusFilter}
              options={statusOptions}
            />
            <div className="flex items-center text-sm text-gray-600">
              Showing {filteredTransactions.length} of {totalElements} transactions
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <Table
          columns={columns}
          data={filteredTransactions}
          loading={loading}
          emptyMessage="No transactions found"
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
      </div>
    </Layout>
  );
};

export default TransactionListPage;
