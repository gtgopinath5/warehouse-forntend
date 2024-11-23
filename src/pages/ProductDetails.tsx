import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Home, Plus } from 'lucide-react';
import ComponentCard from '../components/ComponentCard';
import Graph from '../components/Graph';
import Alert from '../components/Alert';
import { fetchApi } from '../services/api';
import type { Product, Component, AlertType } from '../types';

export default function ProductDetails() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGraphModal, setShowGraphModal] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<Component | null>(null);
  const [newComponent, setNewComponent] = useState({ name: '', description: '' });
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
      fetchComponents();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setIsLoading(true);
      const data = await fetchApi<Product>(`/products/${productId}`);
      setProduct(data);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to load product details. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchComponents = async () => {
    try {
      const data = await fetchApi<Component[]>(`/products/${productId}/components`);
      setComponents(data);
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to load components. Please try again later.',
      });
    }
  };

  const handleCreateComponent = async () => {
    try {
      await fetchApi(`/products/${productId}/components`, {
        method: 'POST',
        body: JSON.stringify(newComponent),
      });
      
      setShowCreateModal(false);
      setNewComponent({ name: '', description: '' });
      fetchComponents();
      
      setAlert({
        type: 'success',
        message: 'Component created successfully!',
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to create component. Please try again.',
      });
    }
  };

  const handleDeleteComponent = async (id: string) => {
    try {
      await fetchApi(`/products/${productId}/components/${id}`, {
        method: 'DELETE',
      });
      
      fetchComponents();
      
      setAlert({
        type: 'success',
        message: 'Component deleted successfully!',
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to delete component. Please try again.',
      });
    }
  };

  const handleToggleProduct = async () => {
    if (!product) return;
    
    try {
      await fetchApi(`/products/${productId}/toggle`, {
        method: 'PUT',
      });
      
      fetchProductDetails();
      
      setAlert({
        type: 'success',
        message: `Product ${product.isActive ? 'deactivated' : 'activated'} successfully!`,
      });
    } catch (error) {
      setAlert({
        type: 'error',
        message: 'Failed to toggle product status. Please try again.',
      });
    }
  };

  const handleViewGraph = (component: Component) => {
    setSelectedComponent(component);
    setShowGraphModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Product not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <p className="text-gray-600 mt-2">{product.description}</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <Home className="w-5 h-5" /> Home
            </button>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={product.isActive}
                onChange={handleToggleProduct}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              <span className="ml-3 text-sm font-medium text-gray-900">
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
            </label>
          </div>
        </div>

        {product.isActive && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-800">Components</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" /> Add Component
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {components.map((component) => (
                <ComponentCard
                  key={component._id}
                  component={component}
                  onEdit={() => {}}
                  onDelete={handleDeleteComponent}
                  onViewGraph={handleViewGraph}
                />
              ))}
            </div>
          </>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold mb-4">Create New Component</h3>
              <input
                type="text"
                placeholder="Component Name"
                className="w-full mb-4 p-2 border rounded"
                value={newComponent.name}
                onChange={(e) => setNewComponent({ ...newComponent, name: e.target.value })}
              />
              <textarea
                placeholder="Description"
                className="w-full mb-4 p-2 border rounded"
                value={newComponent.description}
                onChange={(e) => setNewComponent({ ...newComponent, description: e.target.value })}
              />
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateComponent}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {showGraphModal && selectedComponent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">
                  {selectedComponent.name} - Monitoring Data
                </h3>
                <button
                  onClick={() => setShowGraphModal(false)}
                  className="text-gray-600 hover:text-gray-800"
                >
                  ✕
                </button>
              </div>
              <Graph component={selectedComponent} />
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