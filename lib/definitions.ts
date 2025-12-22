export type Pharmacy = {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  contact: string;
};

export type Medicine = {
  id: string;
  name: string;
  description: string;
  category: string;
  dosage: string;
  usage: string;
  sideEffects: string;
  imageUrl: string;
  imageHint: string;
};

export type InventoryItem = {
  pharmacyId: string;
  medicineId: string;
  stock: number;
  price: number;
  expiryDate: string;
};

export type OrderItem = {
  medicineId: string;
  medicineName: string;
  quantity: number;
  price: number;
};

export type Order = {
  id: string;
  userId: string;
  pharmacyId: string;
  pharmacyName: string;
  items: OrderItem[];
  status: 'Pending' | 'Completed' | 'Cancelled';
  createdAt: string;
  total: number;
};

export type CartItem = {
  medicineId: string;
  pharmacyId: string;
  quantity: number;
};