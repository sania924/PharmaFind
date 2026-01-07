/**
 * Utility script to check and optionally fix order userId mismatches
 *
 * Usage:
 * 1. Check orders: npx tsx scripts/check-and-fix-orders.ts check
 * 2. Fix orders: npx tsx scripts/check-and-fix-orders.ts fix <your-user-id>
 */

import { config } from 'dotenv';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

// Load environment variables
config({ path: '.env.local' });

// Firebase config (copy from your .env.local)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkOrders() {
  console.log('🔍 Checking all orders in Firestore...\n');

  const ordersRef = collection(db, 'orders');
  const snapshot = await getDocs(ordersRef);

  console.log(`Found ${snapshot.size} orders:\n`);

  snapshot.docs.forEach((doc) => {
    const data = doc.data();
    console.log(`Order ID: ${doc.id}`);
    console.log(`  User ID: ${data.userId}`);
    console.log(`  Pharmacy: ${data.pharmacyName}`);
    console.log(`  Status: ${data.status}`);
    console.log(`  Created: ${data.createdAt?.toDate?.()?.toISOString() || 'N/A'}`);
    console.log('');
  });

  // Get all users
  console.log('📋 Checking all users in Firestore...\n');
  const usersRef = collection(db, 'users');
  const usersSnapshot = await getDocs(usersRef);

  console.log(`Found ${usersSnapshot.size} users:\n`);

  usersSnapshot.docs.forEach((doc) => {
    const data = doc.data();
    console.log(`User ID: ${doc.id}`);
    console.log(`  Email: ${data.email}`);
    console.log(`  Name: ${data.name}`);
    console.log(`  Role: ${data.role}`);
    console.log('');
  });
}

async function fixOrders(targetUserId: string) {
  console.log(`🔧 Updating all orders to userId: ${targetUserId}\n`);

  const ordersRef = collection(db, 'orders');
  const snapshot = await getDocs(ordersRef);

  let updated = 0;

  for (const orderDoc of snapshot.docs) {
    const data = orderDoc.data();
    if (data.userId !== targetUserId) {
      console.log(`Updating order ${orderDoc.id}: ${data.userId} → ${targetUserId}`);
      await updateDoc(doc(db, 'orders', orderDoc.id), {
        userId: targetUserId,
      });
      updated++;
    }
  }

  console.log(`\n✅ Updated ${updated} orders`);
}

// Main execution
const command = process.argv[2];
const userId = process.argv[3];

(async () => {
  try {
    if (command === 'check') {
      await checkOrders();
    } else if (command === 'fix' && userId) {
      await fixOrders(userId);
    } else {
      console.log('Usage:');
      console.log('  Check orders: npx tsx scripts/check-and-fix-orders.ts check');
      console.log('  Fix orders:   npx tsx scripts/check-and-fix-orders.ts fix <your-user-id>');
    }
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
})();
