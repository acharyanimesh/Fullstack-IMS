import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button, Alert, Loading } from '../components/ui';
import ApiService from '../service/ApiService';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getProductById(id);
      if (response.status === 200) {
        setProduct(response.product);
      } else {
        setError('Product not found');
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      setError('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await ApiService.deleteProduct(id);
        if (response.status === 200) {
          navigate('/products');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        setError('Failed to delete product');
      }
    }
  };

  if (loading) {
    return (
      <Layout>
        <Loading fullScreen text="Loading product details..." />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <Alert type="error" message={error} />
          <div className="mt-4">
            <Button onClick={() => navigate('/products')}>
              Back to Products
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto">
          <Alert type="error" message="Product not found" />
          <div className="mt-4">
            <Button onClick={() => navigate('/products')}>
              Back to Products
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (quantity < 10) return { text: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
    if (quantity < 50) return { text: 'Medium Stock', color: 'bg-blue-100 text-blue-800' };
    return { text: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const stockStatus = getStockStatus(product.stockQuantity);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600">Product Details</p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" onClick={() => navigate('/products')}>
              Back to Products
            </Button>
            <Link to={`/products/edit/${product.id}`}>
              <Button variant="secondary">Edit Product</Button>
            </Link>
            <Button variant="danger" onClick={handleDelete}>
              Delete Product
            </Button>
          </div>
        </div>

        {error && (
          <Alert type="error" message={error} onClose={() => setError('')} />
        )}

        {/* Product Details */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
            {/* Product Image */}
            <div className="lg:col-span-1">
              <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-center object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Product Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">SKU</h3>
                  <p className="mt-1 text-sm text-gray-900">{product.sku}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Price</h3>
                  <p className="mt-1 text-lg font-semibold text-green-600">${product.price}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Stock Quantity</h3>
                  <div className="mt-1 flex items-center space-x-2">
                    <span className="text-sm text-gray-900">{product.stockQuantity}</span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${stockStatus.color}`}>
                      {stockStatus.text}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Category</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {product.categoryId ? `Category ID: ${product.categoryId}` : 'No category assigned'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Supplier</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {product.suppliersId ? `Supplier ID: ${product.suppliersId}` : 'No supplier assigned'}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-500">Expiry Date</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {product.expiryDate 
                      ? new Date(product.expiryDate).toLocaleDateString()
                      : 'No expiry date'
                    }
                  </p>
                </div>
              </div>

              {product.description && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-sm text-gray-900">{product.description}</p>
                </div>
              )}

              <div>
                <h3 className="text-sm font-medium text-gray-500">Created At</h3>
                <p className="mt-1 text-sm text-gray-900">
                  {product.createdAt 
                    ? new Date(product.createdAt).toLocaleString()
                    : 'Unknown'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stock Management Actions */}
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Stock Management</h3>
          <div className="flex space-x-4">
            <Button 
              variant="success"
              onClick={() => {
                // TODO: Implement stock increase functionality
                alert('Stock increase functionality will be implemented');
              }}
            >
              Increase Stock
            </Button>
            <Button 
              variant="warning"
              onClick={() => {
                // TODO: Implement stock decrease functionality
                alert('Stock decrease functionality will be implemented');
              }}
            >
              Decrease Stock
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetailPage;
