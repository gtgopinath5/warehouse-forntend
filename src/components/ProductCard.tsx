import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onDelete: (id: string) => void;
}

export default function ProductCard({ product, onDelete }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{product.name}</h3>
          <p className="mt-2 text-gray-600">{product.description}</p>
        </div>
        <button
          onClick={() => onDelete(product._id)}
          className="text-red-500 hover:text-red-700 transition-colors"
          aria-label="Delete product"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      <button
        onClick={() => navigate(`/product/${product._id}`)}
        className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
      >
        Details <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}