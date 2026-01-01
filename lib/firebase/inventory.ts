// Client-side Inventory CRUD operations
'use client';

import { collection, addDoc, updateDoc, deleteDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from './config';
import type { InventoryItem } from '../definitions';

export async function createInventoryItem(item: InventoryItem): Promise<void> {
  try {
    await addDoc(collection(db, 'inventory'), {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error creating inventory item:', error);
    throw error;
  }
}

export async function updateInventoryItem(pharmacyId: string, medicineId: string, data: Partial<InventoryItem>): Promise<void> {
  try {
    // Find the document
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
    } else {
      throw new Error('Inventory item not found');
    }
  } catch (error) {
    console.error('Error updating inventory item:', error);
    throw error;
  }
}

export async function deleteInventoryItem(pharmacyId: string, medicineId: string): Promise<void> {
  try {
    const q = query(
      collection(db, 'inventory'),
      where('pharmacyId', '==', pharmacyId),
      where('medicineId', '==', medicineId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      await deleteDoc(querySnapshot.docs[0].ref);
    } else {
      throw new Error('Inventory item not found');
    }
  } catch (error) {
    console.error('Error deleting inventory item:', error);
    throw error;
  }
}
