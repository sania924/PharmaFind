import { Pharmacy, Medicine, InventoryItem, Order } from './definitions';
import { PlaceHolderImages } from './placeholder-images';

const pharmacies: Pharmacy[] = [
  { id: 'p1', name: 'Downtown Health Pharmacy', address: '123 Main St', city: 'Metropolis', lat: 34.052235, lng: -118.243683, contact: '555-1234' },
  { id: 'p2', name: 'Uptown Wellness Center', address: '456 Oak Ave', city: 'Metropolis', lat: 34.062235, lng: -118.253683, contact: '555-5678' },
  { id: 'p3', name: 'Riverside Meds', address: '789 Pine Ln', city: 'Metropolis', lat: 34.042235, lng: -118.263683, contact: '555-9012' },
];

const painReliefImage = PlaceHolderImages.find(p => p.id === 'pain-relief-1');
const allergyImage = PlaceHolderImages.find(p => p.id === 'allergy-1');
const vitaminsImage = PlaceHolderImages.find(p => p.id === 'vitamins-1');
const coldFluImage = PlaceHolderImages.find(p => p.id === 'cold-flu-1');
const digestHealthImage = PlaceHolderImages.find(p => p.id === 'digestive-health-1');

const medicines: Medicine[] = [
  {
    id: 'm1',
    name: 'Ibuprofen 200mg',
    description: 'A nonsteroidal anti-inflammatory drug (NSAID) used for treating pain, fever, and inflammation.',
    category: 'Pain Relief',
    dosage: '200mg per tablet',
    usage: 'Take one tablet every 4-6 hours as needed. Do not exceed 6 tablets in 24 hours.',
    sideEffects: 'May cause stomach upset, nausea, or dizziness. Consult a doctor if symptoms persist.',
    imageUrl: painReliefImage?.imageUrl ?? '',
    imageHint: painReliefImage?.imageHint ?? ''
  },
  {
    id: 'm2',
    name: 'Cetirizine 10mg',
    description: 'An antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, itching eyes/nose, sneezing, hives, and itching.',
    category: 'Allergy',
    dosage: '10mg per tablet',
    usage: 'Take one tablet daily. Do not take more than one tablet in 24 hours.',
    sideEffects: 'May cause drowsiness, dry mouth, or fatigue.',
    imageUrl: allergyImage?.imageUrl ?? '',
    imageHint: allergyImage?.imageHint ?? ''
  },
  {
    id: 'm3',
    name: 'Vitamin D3 1000IU',
    description: 'A supplement that helps the body absorb calcium and is important for bone health.',
    category: 'Vitamins & Supplements',
    dosage: '1000 IU per softgel',
    usage: 'Take one softgel daily with a meal.',
    sideEffects: 'Generally well-tolerated. Excessive intake can lead to high calcium levels.',
    imageUrl: vitaminsImage?.imageUrl ?? '',
    imageHint: vitaminsImage?.imageHint ?? ''
  },
  {
    id: 'm4',
    name: 'Cold & Flu Relief',
    description: 'Multi-symptom relief for common cold and flu symptoms including cough, congestion, and sore throat.',
    category: 'Cold & Flu',
    dosage: '2 caplets per dose',
    usage: 'Take two caplets every 6 hours. Do not exceed 4 doses in 24 hours.',
    sideEffects: 'May cause drowsiness. Use caution when driving or operating machinery.',
    imageUrl: coldFluImage?.imageUrl ?? '',
    imageHint: coldFluImage?.imageHint ?? ''
  },
  {
    id: 'm5',
    name: 'Antacid Tablets',
    description: 'Provides fast relief from heartburn, acid indigestion, and sour stomach.',
    category: 'Digestive Health',
    dosage: '2-4 tablets per dose',
    usage: 'Chew 2-4 tablets as symptoms occur. Do not exceed 10 tablets in 24 hours.',
    sideEffects: 'May cause constipation or diarrhea.',
    imageUrl: digestHealthImage?.imageUrl ?? '',
    imageHint: digestHealthImage?.imageHint ?? ''
  },
];

const inventory: InventoryItem[] = [
  // Pharmacy 1
  { pharmacyId: 'p1', medicineId: 'm1', stock: 100, price: 5.99, expiryDate: '2025-12-31' },
  { pharmacyId: 'p1', medicineId: 'm2', stock: 75, price: 8.49, expiryDate: '2026-06-30' },
  { pharmacyId: 'p1', medicineId: 'm3', stock: 120, price: 12.99, expiryDate: '2025-08-31' },
  // Pharmacy 2
  { pharmacyId: 'p2', medicineId: 'm1', stock: 50, price: 6.29, expiryDate: '2025-11-30' },
  { pharmacyId: 'p2', medicineId: 'm4', stock: 80, price: 9.99, expiryDate: '2026-01-31' },
  { pharmacyId: 'p2', medicineId: 'm5', stock: 90, price: 4.99, expiryDate: '2025-09-30' },
  // Pharmacy 3
  { pharmacyId: 'p3', medicineId: 'm2', stock: 60, price: 8.99, expiryDate: '2026-07-31' },
  { pharmacyId: 'p3', medicineId: 'm3', stock: 200, price: 11.99, expiryDate: '2025-10-31' },
  { pharmacyId: 'p3', medicineId: 'm4', stock: 45, price: 10.49, expiryDate: '2026-02-28' },
  { pharmacyId: 'p3', medicineId: 'm5', stock: 0, price: 5.29, expiryDate: '2025-05-31' },
];

const orders: Order[] = [
  {
    id: 'o1',
    userId: 'u1',
    pharmacyId: 'p1',
    pharmacyName: 'Downtown Health Pharmacy',
    items: [
      { medicineId: 'm1', medicineName: 'Ibuprofen 200mg', quantity: 2, price: 5.99 },
      { medicineId: 'm2', medicineName: 'Cetirizine 10mg', quantity: 1, price: 8.49 },
    ],
    status: 'Completed',
    createdAt: '2023-10-26T10:00:00Z',
    total: 20.47,
  },
  {
    id: 'o2',
    userId: 'u1',
    pharmacyId: 'p2',
    pharmacyName: 'Uptown Wellness Center',
    items: [
      { medicineId: 'm4', medicineName: 'Cold & Flu Relief', quantity: 1, price: 9.99 },
    ],
    status: 'Pending',
    createdAt: new Date().toISOString(),
    total: 9.99,
  },
];

// Data access functions
export const getPharmacies = async (): Promise<Pharmacy[]> => Promise.resolve(pharmacies);
export const getPharmacyById = async (id: string): Promise<Pharmacy | undefined> => Promise.resolve(pharmacies.find(p => p.id === id));
export const getMedicines = async (): Promise<Medicine[]> => Promise.resolve(medicines);
export const getMedicineById = async (id: string): Promise<Medicine | undefined> => Promise.resolve(medicines.find(m => m.id === id));
export const getInventory = async (): Promise<InventoryItem[]> => Promise.resolve(inventory);
export const getInventoryForPharmacy = async (pharmacyId: string): Promise<InventoryItem[]> => Promise.resolve(inventory.filter(i => i.pharmacyId === pharmacyId));
export const getInventoryForMedicine = async (medicineId: string): Promise<InventoryItem[]> => Promise.resolve(inventory.filter(i => i.medicineId === medicineId));
export const getInventoryItem = async (pharmacyId: string, medicineId: string): Promise<InventoryItem | undefined> => Promise.resolve(inventory.find(i => i.pharmacyId === pharmacyId && i.medicineId === medicineId));
export const getOrdersForUser = async (userId: string): Promise<Order[]> => Promise.resolve(orders.filter(o => o.userId === userId));
export const getOrderById = async (orderId: string): Promise<Order | undefined> => Promise.resolve(orders.find(o => o.id === orderId));