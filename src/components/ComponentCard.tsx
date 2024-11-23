import React from 'react';
import { Pencil, Trash2, LineChart } from 'lucide-react';
import type { Component } from '../types';

interface ComponentCardProps {
  component: Component;
  onEdit: (component: Component) => void;
  onDelete: (id: string) => void;
  onViewGraph: (component: Component) => void;
}

export default function ComponentCard({ component, onEdit, onDelete, onViewGraph }: ComponentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">{component.name}</h3>
          <p className="mt-1 text-gray-600">{component.description}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(component)}
            className="text-blue-500 hover:text-blue-700 transition-colors"
            aria-label="Edit component"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(component._id)}
            className="text-red-500 hover:text-red-700 transition-colors"
            aria-label="Delete component"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewGraph(component)}
            className="text-green-500 hover:text-green-700 transition-colors"
            aria-label="View graphs"
          >
            <LineChart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}