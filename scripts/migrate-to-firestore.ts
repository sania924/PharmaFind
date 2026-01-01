// Script to migrate mock data to Firestore
import * as admin from 'firebase-admin';

// Initialize Firebase Admin
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'pharmafind-4321',
  });
}

const db = admin.firestore();

// Mock data from lib/data.ts
const users = [
  {
    id: 'u1',
    email: 'admin@pharmafind.com',
    password: '$2b$10$bETdATbRccWYvHzYbqMEHezVDgcxAcQhEhRnB/gU/6bE1lfeP3MwG',
    name: 'Admin User',
    role: 'admin',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'u2',
    email: 'john@example.com',
    password: '$2b$10$bETdATbRccWYvHzYbqMEHezVDgcxAcQhEhRnB/gU/6bE1lfeP3MwG',
    name: 'John Doe',
    role: 'user',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'u3',
    email: 'jane@example.com',
    password: '$2b$10$bETdATbRccWYvHzYbqMEHezVDgcxAcQhEhRnB/gU/6bE1lfeP3MwG',
    name: 'Jane Smith',
    role: 'user',
    createdAt: new Date('2024-02-01'),
  },
];

const pharmacies = [
  { id: 'p1', name: 'Downtown Health Pharmacy', address: '123 Main St', city: 'Metropolis', lat: 34.052235, lng: -118.243683, contact: '555-1234' },
  { id: 'p2', name: 'Uptown Wellness Center', address: '456 Oak Ave', city: 'Metropolis', lat: 34.062235, lng: -118.253683, contact: '555-5678' },
  { id: 'p3', name: 'Riverside Meds', address: '789 Pine Ln', city: 'Metropolis', lat: 34.042235, lng: -118.263683, contact: '555-9012' },
];

const medicines = [
  {
    id: 'm1',
    name: 'Ibuprofen 200mg',
    description: 'A nonsteroidal anti-inflammatory drug (NSAID) used for treating pain, fever, and inflammation.',
    category: 'Pain Relief',
    dosage: '200mg per tablet',
    usage: 'Take one tablet every 4-6 hours as needed. Do not exceed 6 tablets in 24 hours.',
    sideEffects: 'May cause stomach upset, nausea, or dizziness. Consult a doctor if symptoms persist.',
    imageUrl: '/placeholder.svg?height=200&width=200',
    imageHint: 'Pain relief medication',
  },
  {
    id: 'm2',
    name: 'Cetirizine 10mg',
    description: 'An antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, itching eyes/nose, sneezing, hives, and itching.',
    category: 'Allergy',
    dosage: '10mg per tablet',
    usage: 'Take one tablet daily. Do not take more than one tablet in 24 hours.',
    sideEffects: 'May cause drowsiness, dry mouth, or fatigue.',
    imageUrl: '/placeholder.svg?height=200&width=200',
    imageHint: 'Allergy medication',
  },
  {
    id: 'm3',
    name: 'Vitamin D3 1000IU',
    description: 'A supplement that helps the body absorb calcium and is important for bone health.',
    category: 'Vitamins & Supplements',
    dosage: '1000 IU per softgel',
    usage: 'Take one softgel daily with a meal.',
    sideEffects: 'Generally well-tolerated. Excessive intake can lead to high calcium levels.',
    imageUrl: '/placeholder.svg?height=200&width=200',
    imageHint: 'Vitamin supplement',
  },
  {
    id: 'm4',
    name: 'Cold & Flu Relief',
    description: 'Multi-symptom relief for common cold and flu symptoms including cough, congestion, and sore throat.',
    category: 'Cold & Flu',
    dosage: '2 caplets per dose',
    usage: 'Take two caplets every 6 hours. Do not exceed 4 doses in 24 hours.',
    sideEffects: 'May cause drowsiness. Use caution when driving or operating machinery.',
    imageUrl: '/placeholder.svg?height=200&width=200',
    imageHint: 'Cold and flu medication',
  },
  {
    id: 'm5',
    name: 'Antacid Tablets',
    description: 'Provides fast relief from heartburn, acid indigestion, and sour stomach.',
    category: 'Digestive Health',
    dosage: '2-4 tablets per dose',
    usage: 'Chew 2-4 tablets as symptoms occur. Do not exceed 10 tablets in 24 hours.',
    sideEffects: 'May cause constipation or diarrhea.',
    imageUrl: '/placeholder.svg?height=200&width=200',
    imageHint: 'Digestive health medication',
  },
];

const inventory = [
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

const orders = [
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
    createdAt: new Date('2024-12-20T10:00:00Z'),
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
    createdAt: new Date(),
    total: 9.99,
  },
  {
    id: 'o3',
    userId: 'u2',
    pharmacyId: 'p1',
    pharmacyName: 'Downtown Health Pharmacy',
    items: [
      { medicineId: 'm3', medicineName: 'Vitamin D3 1000IU', quantity: 3, price: 12.99 },
    ],
    status: 'Completed',
    createdAt: new Date('2024-12-25T14:30:00Z'),
    total: 38.97,
  },
  {
    id: 'o4',
    userId: 'u2',
    pharmacyId: 'p3',
    pharmacyName: 'Riverside Meds',
    items: [
      { medicineId: 'm2', medicineName: 'Cetirizine 10mg', quantity: 2, price: 8.99 },
      { medicineId: 'm4', medicineName: 'Cold & Flu Relief', quantity: 1, price: 10.49 },
    ],
    status: 'Completed',
    createdAt: new Date('2024-12-28T09:15:00Z'),
    total: 28.47,
  },
  {
    id: 'o5',
    userId: 'u3',
    pharmacyId: 'p2',
    pharmacyName: 'Uptown Wellness Center',
    items: [
      { medicineId: 'm1', medicineName: 'Ibuprofen 200mg', quantity: 1, price: 6.29 },
      { medicineId: 'm5', medicineName: 'Antacid Tablets', quantity: 2, price: 4.99 },
    ],
    status: 'Pending',
    createdAt: new Date('2024-12-30T16:45:00Z'),
    total: 16.27,
  },
];

async function migrateData() {
  console.log('🔥 Starting migration to Firestore...\n');

  try {
    // Migrate Users
    console.log('📊 Migrating users...');
    for (const user of users) {
      await db.collection('users').doc(user.id).set(user);
      console.log(`✓ Added user: ${user.email}`);
    }

    // Migrate Pharmacies
    console.log('\n📍 Migrating pharmacies...');
    for (const pharmacy of pharmacies) {
      await db.collection('pharmacies').doc(pharmacy.id).set({
        ...pharmacy,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✓ Added pharmacy: ${pharmacy.name}`);
    }

    // Migrate Medicines
    console.log('\n💊 Migrating medicines...');
    for (const medicine of medicines) {
      await db.collection('medicines').doc(medicine.id).set({
        ...medicine,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✓ Added medicine: ${medicine.name}`);
    }

    // Migrate Inventory
    console.log('\n📦 Migrating inventory...');
    for (const item of inventory) {
      await db.collection('inventory').add({
        ...item,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      console.log(`✓ Added inventory: ${item.pharmacyId} - ${item.medicineId}`);
    }

    // Migrate Orders
    console.log('\n🛒 Migrating orders...');
    for (const order of orders) {
      await db.collection('orders').doc(order.id).set(order);
      console.log(`✓ Added order: ${order.id}`);
    }

    console.log('\n\n✅ Migration completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Users: ${users.length}`);
    console.log(`   - Pharmacies: ${pharmacies.length}`);
    console.log(`   - Medicines: ${medicines.length}`);
    console.log(`   - Inventory items: ${inventory.length}`);
    console.log(`   - Orders: ${orders.length}`);
    console.log('\n🎉 Your Firestore database is now populated!');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run migration
migrateData();
