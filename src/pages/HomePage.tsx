import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import Alert from '../components/Alert';
import { fetchApi } from '../services/api';
import type { Product, AlertType } from '../types';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '' });
  const [alert, setAlert] = useState<AlertType | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await fetchApi<Product[]>('/products');
      setProducts(data);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to load products. Please try again later.',
      });
    }
  };

  const handleCreateProduct = async () => {
    try {
      await fetchApi('/products/createProduct', {
        method: 'POST',
        body: JSON.stringify(newProduct),
      });
      
      setShowCreateModal(false);
      setNewProduct({ name: '', description: '' });
      fetchProducts();
      
      setAlert({
        type: 'success',
        message: 'Product created successfully!',
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to create product. Please try again.',
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await fetchApi(`/products/${id}`, {
        method: 'DELETE',
      });
      
      fetchProducts();
      
      setAlert({
        type: 'success',
        message: 'Product deleted successfully!',
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to delete product. Please try again.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Warehouse Temperature and Humidity Monitoring System
          </h1>
          <p className="text-xl text-gray-600">
            Monitor and manage your warehouse environment with ease
          </p>
        </div>

        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-800">Your Products</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" /> Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onDelete={handleDeleteProduct}
            />
          ))}
        </div>

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Create New Product</h3>
              <input
                type="text"
                placeholder="Product Name"
                className="w-full mb-4 p-2 border rounded"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <textarea
                placeholder="Description"
                className="w-full mb-4 p-2 border rounded"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProduct}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {alert && (
          <Alert
            alert={alert}
            onClose={() => setAlert(null)}
          />
        )}
      </div>
    </div>
  );
}
