/**
 * Database Seeding Script for PharmFind
 *
 * This script populates the Firestore database with initial data:
 * - Pharmacies
 * - Medicines
 * - Inventory (stock at each pharmacy)
 *
 * Usage: npx tsx scripts/seedDatabase.ts
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import * as path from 'path';
import * as fs from 'fs';

// Initialize Firebase Admin
const serviceAccountPath = path.join(__dirname, '..', 'serviceAccountKey.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ Error: serviceAccountKey.json not found!');
  console.log('\nTo get your service account key:');
  console.log('1. Go to Firebase Console → Project Settings → Service Accounts');
  console.log('2. Click "Generate New Private Key"');
  console.log('3. Save the file as serviceAccountKey.json in the project root');
  process.exit(1);
}

const serviceAccount = require(serviceAccountPath);

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

// Seed Data
const pharmacies = [
  {
    id: 'p1',
    name: 'Downtown Health Pharmacy',
    address: '123 Main St',
    city: 'Metropolis',
    lat: 34.052235,
    lng: -118.243683,
    contact: '555-1234',
  },
  {
    id: 'p2',
    name: 'Uptown Wellness Center',
    address: '456 Oak Ave',
    city: 'Metropolis',
    lat: 34.062235,
    lng: -118.253683,
    contact: '555-5678',
  },
  {
    id: 'p3',
    name: 'Riverside Meds',
    address: '789 Pine Ln',
    city: 'Metropolis',
    lat: 34.042235,
    lng: -118.263683,
    contact: '555-9012',
  },
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
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTc0QzNDIi8+PHRleHQgeD0iNTAlIiB5PSIzNSUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iNjAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMyI+8J+SijwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjYwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZmZiI+SWJ1cHJvZmVuIDIwMG1nPC90ZXh0Pjwvc3ZnPg==',
    imageHint: 'Pain relief medication pills',
  },
  {
    id: 'm2',
    name: 'Cetirizine 10mg',
    description: 'An antihistamine used to relieve allergy symptoms such as watery eyes, runny nose, itching eyes/nose, sneezing, hives, and itching.',
    category: 'Allergy',
    dosage: '10mg per tablet',
    usage: 'Take one tablet daily. Do not take more than one tablet in 24 hours.',
    sideEffects: 'May cause drowsiness, dry mouth, or fatigue.',
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzQ5OERCIi8+PHRleHQgeD0iNTAlIiB5PSIzNSUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iNjAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMyI+8J+SqjwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjYwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZmZiI+Q2V0aXJpemluZSAxMG1nPC90ZXh0Pjwvc3ZnPg==',
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
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjM5QzEyIi8+PHRleHQgeD0iNTAlIiB5PSIzNSUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iNjAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMyI+4piA77iPPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjIiIGZvbnQtd2VpZ2h0PSJib2xkIiBmaWxsPSIjZmZmIj5WaXRhbWluIEQzPC90ZXh0Pjwvc3ZnPg==',
    imageHint: 'Vitamin supplements',
  },
  {
    id: 'm4',
    name: 'Cold & Flu Relief',
    description: 'Multi-symptom relief for common cold and flu symptoms including cough, congestion, and sore throat.',
    category: 'Cold & Flu',
    dosage: '2 caplets per dose',
    usage: 'Take two caplets every 6 hours. Do not exceed 4 doses in 24 hours.',
    sideEffects: 'May cause drowsiness. Use caution when driving or operating machinery.',
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOUI1OUI2Ii8+PHRleHQgeD0iNTAlIiB5PSIzNSUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iNjAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMyI+8J+kgjwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjYwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZmZiI+Q29sZCAmYW1wOyBGbHU8L3RleHQ+PC9zdmc+',
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
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMUFCQzlDIi8+PHRleHQgeD0iNTAlIiB5PSIzNSUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iNjAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMyI+8J+SijwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjYwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZmZiI+QW50YWNpZCBUYWJsZXRzPC90ZXh0Pjwvc3ZnPg==',
    imageHint: 'Digestive health tablets',
  },
  {
    id: 'm6',
    name: 'Paracetamol 500mg',
    description: 'Pain reliever and fever reducer for mild to moderate pain.',
    category: 'Pain Relief',
    dosage: '500mg per tablet',
    usage: 'Take 1-2 tablets every 4-6 hours. Do not exceed 8 tablets in 24 hours.',
    sideEffects: 'Rare side effects. Overdose can cause serious liver damage.',
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRTc0QzNDIi8+PHRleHQgeD0iNTAlIiB5PSIzNSUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iNjAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMyI+8J+SijwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjYwJSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjIyIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iI2ZmZiI+UGFyYWNldGFtb2wgNTAwbWc8L3RleHQ+PC9zdmc+',
    imageHint: 'Pain relief tablets',
  },
  {
    id: 'm7',
    name: 'Omega-3 Fish Oil',
    description: 'Supports heart, brain, and joint health with essential fatty acids.',
    category: 'Vitamins & Supplements',
    dosage: '1000mg per softgel',
    usage: 'Take 1-2 softgels daily with meals.',
    sideEffects: 'May cause fishy aftertaste or mild stomach upset.',
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjM5QzEyIi8+PHRleHQgeD0iNTAlIiB5PSIzNSUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iNjAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMyI+8J+Qnzwvdgext3Q+PHRleHQgeD0iNTAlIiB5PSI2MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNmZmYiPk9tZWdhLTMgRmlzaCBPaWw8L3RleHQ+PC9zdmc+',
    imageHint: 'Fish oil supplements',
  },
  {
    id: 'm8',
    name: 'Cough Syrup',
    description: 'Relieves cough and throat irritation.',
    category: 'Cold & Flu',
    dosage: '10ml per dose',
    usage: 'Take 10ml every 4 hours. Do not exceed 6 doses in 24 hours.',
    sideEffects: 'May cause drowsiness or dizziness.',
    imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOUI1OUI2Ii8+PHRleHQgeD0iNTAlIiB5PSIzNSUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iNjAiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuMyI+8J+Tuewvdext3Q+PHRleHQgeD0iNTAlIiB5PSI2MCUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMiIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IiNmZmYiPkNvdWdoIFN5cnVwPC90ZXh0Pjwvc3ZnPg==',
    imageHint: 'Cough syrup',
  },
];

const inventory = [
  // Downtown Health Pharmacy (p1)
  { pharmacyId: 'p1', medicineId: 'm1', stock: 50, price: 5.99, expiryDate: '2026-12-31' },
  { pharmacyId: 'p1', medicineId: 'm2', stock: 30, price: 8.49, expiryDate: '2026-10-15' },
  { pharmacyId: 'p1', medicineId: 'm3', stock: 45, price: 12.99, expiryDate: '2027-03-20' },
  { pharmacyId: 'p1', medicineId: 'm4', stock: 25, price: 9.99, expiryDate: '2026-08-30' },
  { pharmacyId: 'p1', medicineId: 'm6', stock: 60, price: 4.99, expiryDate: '2027-01-15' },

  // Uptown Wellness Center (p2)
  { pharmacyId: 'p2', medicineId: 'm1', stock: 40, price: 6.49, expiryDate: '2026-11-20' },
  { pharmacyId: 'p2', medicineId: 'm3', stock: 35, price: 13.49, expiryDate: '2027-02-28' },
  { pharmacyId: 'p2', medicineId: 'm5', stock: 20, price: 7.99, expiryDate: '2026-09-10' },
  { pharmacyId: 'p2', medicineId: 'm7', stock: 50, price: 15.99, expiryDate: '2027-06-30' },
  { pharmacyId: 'p2', medicineId: 'm8', stock: 15, price: 11.49, expiryDate: '2026-07-25' },

  // Riverside Meds (p3)
  { pharmacyId: 'p3', medicineId: 'm2', stock: 35, price: 8.99, expiryDate: '2026-10-30' },
  { pharmacyId: 'p3', medicineId: 'm4', stock: 28, price: 10.49, expiryDate: '2026-09-15' },
  { pharmacyId: 'p3', medicineId: 'm5', stock: 22, price: 7.49, expiryDate: '2026-08-20' },
  { pharmacyId: 'p3', medicineId: 'm6', stock: 55, price: 5.49, expiryDate: '2027-02-10' },
  { pharmacyId: 'p3', medicineId: 'm8', stock: 18, price: 10.99, expiryDate: '2026-07-30' },
];

async function clearCollection(collectionName: string) {
  const snapshot = await db.collection(collectionName).get();
  const batch = db.batch();
  snapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  await batch.commit();
  console.log(`  🗑️  Cleared ${snapshot.size} documents from ${collectionName}`);
}

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Clear existing data first
    console.log('🗑️  Cleaning existing data...');
    await clearCollection('pharmacies');
    await clearCollection('medicines');
    await clearCollection('inventory');
    console.log('✅ Database cleaned\n');

    // Seed Pharmacies
    console.log('📍 Seeding pharmacies...');
    for (const pharmacy of pharmacies) {
      const { id, ...data } = pharmacy;
      await db.collection('pharmacies').doc(id).set({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });
      console.log(`  ✓ Added: ${pharmacy.name}`);
    }
    console.log(`✅ Successfully seeded ${pharmacies.length} pharmacies\n`);

    // Seed Medicines
    console.log('💊 Seeding medicines...');
    for (const medicine of medicines) {
      const { id, ...data } = medicine;
      await db.collection('medicines').doc(id).set({
        ...data,
        createdAt: FieldValue.serverTimestamp(),
      });
      console.log(`  ✓ Added: ${medicine.name}`);
    }
    console.log(`✅ Successfully seeded ${medicines.length} medicines\n`);

    // Seed Inventory
    console.log('📦 Seeding inventory...');
    for (const item of inventory) {
      const pharmacy = pharmacies.find(p => p.id === item.pharmacyId);
      const medicine = medicines.find(m => m.id === item.medicineId);

      await db.collection('inventory').add({
        ...item,
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
      });

      console.log(`  ✓ Added: ${medicine?.name} at ${pharmacy?.name} (Stock: ${item.stock})`);
    }
    console.log(`✅ Successfully seeded ${inventory.length} inventory items\n`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\nDatabase Summary:');
    console.log(`  - Pharmacies: ${pharmacies.length}`);
    console.log(`  - Medicines: ${medicines.length}`);
    console.log(`  - Inventory Items: ${inventory.length}`);
    console.log('\nYou can now refresh your application to see the data!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding
seedDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
