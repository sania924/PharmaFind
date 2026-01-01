// Client-side Pharmacy CRUD operations
'use client';

import { collection, addDoc, updateDoc, deleteDoc, doc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import type { Pharmacy } from '../definitions';

export async function createPharmacy(pharmacy: Omit<Pharmacy, 'id'>): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'pharmacies'), {
      ...pharmacy,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating pharmacy:', error);
    throw error;
  }
}

export async function updatePharmacy(id: string, data: Partial<Omit<Pharmacy, 'id'>>): Promise<void> {
  try {
    const docRef = doc(db, 'pharmacies', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating pharmacy:', error);
    throw error;
  }
}

export async function deletePharmacy(id: string): Promise<void> {
  try {
    // First, delete all inventory items for this pharmacy
    const inventoryQuery = query(collection(db, 'inventory'), where('pharmacyId', '==', id));
    const inventorySnapshot = await getDocs(inventoryQuery);

    const deletePromises = inventorySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);

    // Then delete the pharmacy
    await deleteDoc(doc(db, 'pharmacies', id));
  } catch (error) {
    console.error('Error deleting pharmacy:', error);
    throw error;
  }
}
