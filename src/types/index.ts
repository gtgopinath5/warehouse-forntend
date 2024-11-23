export interface Product {
  _id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Component {
  _id: string;
  name: string;
  description: string;
  productId: string;
  temperature: number[];
  humidity: number[];
  gasLevel: number[];
  timestamps: string[];
}

export interface AlertType {
  type: 'success' | 'error' | 'warning';
  message: string;
}