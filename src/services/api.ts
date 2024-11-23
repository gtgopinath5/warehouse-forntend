import { mockProducts, mockComponents } from './mockData';

const API_BASE_URL = 'https://eureka.innotrat.in';
const USE_MOCK_DATA = true;

let localProducts = [...mockProducts];
let localComponents = { ...mockComponents };

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  if (USE_MOCK_DATA) {
    return mockApiCall(endpoint, options);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

async function mockApiCall<T>(endpoint: string, options?: RequestInit): Promise<T> {
  await new Promise(resolve => setTimeout(resolve, 500));

  // GET all products
  if (endpoint === '/products' && (!options || options.method === 'GET')) {
    return localProducts as T;
  }

  // GET single product
  if (endpoint.match(/\/products\/[\w-]+$/) && (!options || options.method === 'GET')) {
    const productId = endpoint.split('/').pop();
    const product = localProducts.find(p => p._id === productId);
    if (!product) throw new Error('Product not found');
    return product as T;
  }

  // GET product components
  if (endpoint.match(/\/products\/[\w-]+\/components$/) && (!options || options.method === 'GET')) {
    const productId = endpoint.split('/')[2];
    return (localComponents[productId] || []) as T;
  }

  // CREATE product
  if (endpoint === '/products/createProduct' && options?.method === 'POST') {
    const newProduct = JSON.parse(options.body as string);
    const product = {
      _id: `p${Date.now()}`,
      ...newProduct,
      isActive: true,
    };
    localProducts.push(product);
    return product as T;
  }

  // DELETE product
  if (endpoint.match(/\/products\/[\w-]+$/) && options?.method === 'DELETE') {
    const productId = endpoint.split('/').pop()!;
    localProducts = localProducts.filter(p => p._id !== productId);
    delete localComponents[productId];
    return {} as T;
  }

  // CREATE component
  if (endpoint.match(/\/products\/[\w-]+\/components$/) && options?.method === 'POST') {
    const productId = endpoint.split('/')[2];
    const newComponent = JSON.parse(options.body as string);
    const component = {
      _id: `c${Date.now()}`,
      ...newComponent,
      productId,
      temperature: generateRandomData(7, 20, 25),
      humidity: generateRandomData(7, 45, 55),
      gasLevel: generateRandomData(7, 380, 420),
      timestamps: Array(7).fill(0).map((_, i) => 
        new Date(Date.now() - (6 - i) * 3600000).toISOString()
      ),
    };
    
    if (!localComponents[productId]) {
      localComponents[productId] = [];
    }
    localComponents[productId].push(component);
    return component as T;
  }

  // DELETE component
  if (endpoint.match(/\/products\/[\w-]+\/components\/[\w-]+$/) && options?.method === 'DELETE') {
    const [, , productId, , componentId] = endpoint.split('/');
    if (localComponents[productId]) {
      localComponents[productId] = localComponents[productId].filter(
        (c: any) => c._id !== componentId
      );
    }
    return {} as T;
  }

  // TOGGLE product
  if (endpoint.match(/\/products\/[\w-]+\/toggle$/) && options?.method === 'PUT') {
    const productId = endpoint.split('/')[2];
    const product = localProducts.find(p => p._id === productId);
    if (!product) throw new Error('Product not found');
    product.isActive = !product.isActive;
    return product as T;
  }

  throw new Error(`Unhandled mock endpoint: ${endpoint}`);
}

function generateRandomData(length: number, min: number, max: number): number[] {
  return Array(length).fill(0).map(() => 
    Number((Math.random() * (max - min) + min).toFixed(1))
  );
}