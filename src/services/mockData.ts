export const mockProducts = [
  {
    _id: 'p1',
    name: 'Cold Storage Unit A',
    description: 'Main cold storage unit for perishable goods',
    isActive: true,
  },
  {
    _id: 'p2',
    name: 'Dry Storage Area B',
    description: 'Temperature controlled storage for dry goods',
    isActive: false,
  },
  {
    _id: 'p3',
    name: 'Freezer Unit C',
    description: 'Deep freezer storage for frozen products',
    isActive: true,
  },
];

export const mockComponents = {
  'p1': [
    {
      _id: 'c1',
      name: 'Section 1 Sensors',
      description: 'Primary monitoring sensors for section 1',
      productId: 'p1',
      temperature: [2, 3, 2.5, 2.8, 3.1, 2.9, 2.7],
      humidity: [65, 67, 66, 68, 67, 65, 66],
      gasLevel: [400, 410, 405, 415, 408, 402, 406],
      timestamps: Array(7).fill(0).map((_, i) => 
        new Date(Date.now() - (6 - i) * 3600000).toISOString()
      ),
    },
    {
      _id: 'c2',
      name: 'Section 2 Sensors',
      description: 'Secondary monitoring sensors for section 2',
      productId: 'p1',
      temperature: [3.1, 3.2, 3.0, 3.3, 3.2, 3.1, 3.0],
      humidity: [64, 65, 66, 65, 64, 65, 66],
      gasLevel: [395, 400, 398, 402, 399, 397, 398],
      timestamps: Array(7).fill(0).map((_, i) => 
        new Date(Date.now() - (6 - i) * 3600000).toISOString()
      ),
    },
  ],
  'p2': [],
  'p3': [
    {
      _id: 'c3',
      name: 'Freezer Sensors',
      description: 'Main freezer monitoring system',
      productId: 'p3',
      temperature: [-18, -17.5, -18.2, -18.1, -17.8, -18.0, -17.9],
      humidity: [45, 46, 44, 45, 46, 45, 44],
      gasLevel: [380, 385, 382, 384, 383, 381, 382],
      timestamps: Array(7).fill(0).map((_, i) => 
        new Date(Date.now() - (6 - i) * 3600000).toISOString()
      ),
    },
  ],
};