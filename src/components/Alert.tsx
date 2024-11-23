import React from 'react';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import type { AlertType } from '../types';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
};

const colors = {
  success: 'bg-green-50 text-green-800 border-green-200',
  error: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-yellow-50 text-yellow-800 border-yellow-200',
};

interface AlertProps {
  alert: AlertType;
  onClose: () => void;
}

export default function Alert({ alert, onClose }: AlertProps) {
  const Icon = icons[alert.type];
  
  return (
    <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg border ${colors[alert.type]} flex items-center gap-3 shadow-lg max-w-md`}>
      <Icon className="w-5 h-5" />
      <p className="flex-1">{alert.message}</p>
      <button
        onClick={onClose}
        className="text-current hover:opacity-70"
        aria-label="Close alert"
      >
        <XCircle className="w-5 h-5" />
      </button>
    </div>
  );
}