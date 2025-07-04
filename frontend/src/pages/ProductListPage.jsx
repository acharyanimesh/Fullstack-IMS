import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button, Table, Input, Select, Alert, Pagination } from '../components/ui';
import ApiService from '../service/ApiService';

const ProductListPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [currentPage, selectedCategory]);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm !== '') {
        setCurrentPage(0);
        fetchProducts();
      } else if (searchTerm === '') {
        fetchProducts();
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      let response;
      
      if (selectedCategory) {
        response = await ApiService.getProductsByCategory(selectedCategory, currentPage, pageSize);
      } else {
        response = await ApiService.getAllProducts(currentPage, pageSize);
      }

      if (response.status === 200) {
        setProducts(response.products || []);
        setTotalPages(response.totalPages || 0);
        setTotalElements(response.totalElements || 0);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Failed to load products');
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

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await ApiService.deleteProduct(productId);
        if (response.status === 200) {
          fetchProducts();
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete product');
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      header: 'Name',
      accessor: 'name',
      render: (product) => (
        <div>
          <div className="font-medium text-gray-900">{product.name}</div>
          <div className="text-sm text-gray-500">SKU: {product.sku}</div>
        </div>
      )
    },
    {
      header: 'Price',
      accessor: 'price',
      render: (product) => (
        <span className="text-green-600 font-medium">${product.price}</span>
      )
    },
    {
      header: 'Stock',
      accessor: 'stockQuantity',
      render: (product) => (
        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          product.stockQuantity < 10 
            ? 'bg-red-100 text-red-800' 
            : product.stockQuantity < 50 
            ? 'bg-yellow-100 text-yellow-800' 
            : 'bg-green-100 text-green-800'
        }`}>
          {product.stockQuantity}
        </span>
      )
    },
    {
      header: 'Description',
      accessor: 'description',
      render: (product) => (
        <div className="max-w-xs truncate" title={product.description}>
          {product.description || 'No description'}
        </div>
      )
    },
    {
      header: 'Actions',
      render: (product) => (
        <div className="flex space-x-2">
          <Link to={`/products/${product.id}`}>
            <Button size="sm" variant="outline">View</Button>
          </Link>
          <Link to={`/products/edit/${product.id}`}>
            <Button size="sm" variant="secondary">Edit</Button>
          </Link>
          <Button 
            size="sm" 
            variant="danger" 
            onClick={() => handleDeleteProduct(product.id)}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name
  }));

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
            <p className="text-gray-600">Manage your product inventory</p>
          </div>
          <Link to="/products/new">
            <Button>Add New Product</Button>
          </Link>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              placeholder="All Categories"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={categoryOptions}
            />
            <div className="flex items-center text-sm text-gray-600">
              Showing {filteredProducts.length} of {totalElements} products
            </div>
          </div>
        </div>

        {/* Products Table */}
        <Table
          columns={columns}
          data={filteredProducts}
          loading={loading}
          emptyMessage="No products found"
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalElements={totalElements}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          showInfo={true}
          showSizeSelector={false}
        />
      </div>
    </Layout>
  );
};

export default ProductListPage;
