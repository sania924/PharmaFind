// Firestore helper functions for CRUD operations
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import type { Pharmacy, Medicine, InventoryItem, Order, User } from '../definitions';

// Helper function to convert Firestore timestamps to ISO strings
function serializeTimestamps(data: any): any {
  if (!data) return data;

  const serialized: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Timestamp) {
      serialized[key] = value.toDate().toISOString();
    } else if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
      // Handle Firestore Timestamp objects
      serialized[key] = value.toDate().toISOString();
    } else {
      serialized[key] = value;
    }
  }
  return serialized;
}

// ==================== PHARMACY OPERATIONS ====================

export async function getAllPharmacies(): Promise<Pharmacy[]> {
  const querySnapshot = await getDocs(collection(db, 'pharmacies'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...serializeTimestamps(doc.data()),
  })) as Pharmacy[];
}

export async function getPharmacyById(id: string): Promise<Pharmacy | null> {
  const docRef = doc(db, 'pharmacies', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...serializeTimestamps(docSnap.data()) } as Pharmacy;
  }
  return null;
}

export async function addPharmacy(pharmacy: Omit<Pharmacy, 'id'>): Promise<string> {
  const docRef = await addDoc(collection(db, 'pharmacies'), {
    ...pharmacy,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updatePharmacy(id: string, data: Partial<Pharmacy>): Promise<void> {
  const docRef = doc(db, 'pharmacies', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePharmacy(id: string): Promise<void> {
  // Also delete related inventory items
  const inventoryQuery = query(collection(db, 'inventory'), where('pharmacyId', '==', id));
  const inventorySnapshot = await getDocs(inventoryQuery);

  const deletePromises = inventorySnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);

  // Delete the pharmacy
  await deleteDoc(doc(db, 'pharmacies', id));
}

// ==================== MEDICINE OPERATIONS ====================

export async function getAllMedicines(): Promise<Medicine[]> {
  const querySnapshot = await getDocs(collection(db, 'medicines'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...serializeTimestamps(doc.data()),
  })) as Medicine[];
}

export async function getMedicineById(id: string): Promise<Medicine | null> {
  const docRef = doc(db, 'medicines', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...serializeTimestamps(docSnap.data()) } as Medicine;
  }
  return null;
}

// ==================== INVENTORY OPERATIONS ====================

export async function getAllInventory(): Promise<InventoryItem[]> {
  const querySnapshot = await getDocs(collection(db, 'inventory'));
  return querySnapshot.docs.map((doc) => ({
    ...serializeTimestamps(doc.data()),
  })) as InventoryItem[];
}

export async function getInventoryByPharmacy(pharmacyId: string): Promise<InventoryItem[]> {
  const q = query(collection(db, 'inventory'), where('pharmacyId', '==', pharmacyId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => serializeTimestamps(doc.data())) as InventoryItem[];
}

export async function getInventoryByMedicine(medicineId: string): Promise<InventoryItem[]> {
  const q = query(collection(db, 'inventory'), where('medicineId', '==', medicineId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => serializeTimestamps(doc.data())) as InventoryItem[];
}

export async function getInventoryItem(pharmacyId: string, medicineId: string): Promise<InventoryItem | null> {
  const q = query(
    collection(db, 'inventory'),
    where('pharmacyId', '==', pharmacyId),
    where('medicineId', '==', medicineId)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    return serializeTimestamps(querySnapshot.docs[0].data()) as InventoryItem;
  }
  return null;
}

export async function addInventoryItem(item: InventoryItem): Promise<void> {
  await addDoc(collection(db, 'inventory'), {
    ...item,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateInventoryItem(pharmacyId: string, medicineId: string, data: Partial<InventoryItem>): Promise<void> {
  const q = query(
    collection(db, 'inventory'),
    where('pharmacyId', '==', pharmacyId),
    where('medicineId', '==', medicineId)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docRef = querySnapshot.docs[0].ref;
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  }
}

export async function deleteInventoryItem(pharmacyId: string, medicineId: string): Promise<void> {
  const q = query(
    collection(db, 'inventory'),
    where('pharmacyId', '==', pharmacyId),
    where('medicineId', '==', medicineId)
  );
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    await deleteDoc(querySnapshot.docs[0].ref);
  }
}

// ==================== ORDER OPERATIONS ====================

export async function getOrdersByUser(userId: string): Promise<Order[]> {
  const q = query(collection(db, 'orders'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...serializeTimestamps(doc.data()),
  })) as Order[];
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const docRef = doc(db, 'orders', orderId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...serializeTimestamps(docSnap.data()),
    } as Order;
  }
  return null;
}

export async function getAllOrders(): Promise<Order[]> {
  const querySnapshot = await getDocs(collection(db, 'orders'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...serializeTimestamps(doc.data()),
  })) as Order[];
}

export async function updateOrderStatus(orderId: string, status: string): Promise<void> {
  const docRef = doc(db, 'orders', orderId);
  await updateDoc(docRef, {
    status,
    updatedAt: serverTimestamp(),
  });
}

// ==================== USER OPERATIONS ====================

export async function getUserByEmail(email: string): Promise<User | null> {
  const q = query(collection(db, 'users'), where('email', '==', email));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const docData = querySnapshot.docs[0];
    return {
      id: docData.id,
      ...serializeTimestamps(docData.data()),
    } as User;
  }
  return null;
}

export async function getUserById(id: string): Promise<User | null> {
  const docRef = doc(db, 'users', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return {
      id: docSnap.id,
      ...serializeTimestamps(docSnap.data()),
    } as User;
  }
  return null;
}
