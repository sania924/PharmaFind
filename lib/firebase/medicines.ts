'use client';

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';
import { deleteImage } from './storage';
import type { Medicine } from '../definitions';

/**
 * Create a new medicine
 */
export async function createMedicine(
  medicineData: Omit<Medicine, 'id'>
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, 'medicines'), {
      ...medicineData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error: any) {
    console.error('Error creating medicine:', error);
    throw new Error(error.message || 'Failed to create medicine');
  }
}

/**
 * Update an existing medicine
 */
export async function updateMedicine(
  medicineId: string,
  medicineData: Partial<Omit<Medicine, 'id'>>
): Promise<void> {
  try {
    const docRef = doc(db, 'medicines', medicineId);
    await updateDoc(docRef, {
      ...medicineData,
      updatedAt: serverTimestamp(),
    });
  } catch (error: any) {
    console.error('Error updating medicine:', error);
    throw new Error(error.message || 'Failed to update medicine');
  }
}

/**
 * Delete a medicine and its image
 */
export async function deleteMedicine(
  medicineId: string,
  imageUrl?: string
): Promise<void> {
  try {
    // Delete the image from storage if it exists
    if (imageUrl && !imageUrl.startsWith('data:')) {
      try {
        await deleteImage(imageUrl);
      } catch (error) {
        console.warn('Failed to delete medicine image:', error);
        // Continue with medicine deletion even if image deletion fails
      }
    }

    // Delete the medicine document
    const docRef = doc(db, 'medicines', medicineId);
    await deleteDoc(docRef);
  } catch (error: any) {
    console.error('Error deleting medicine:', error);
    throw new Error(error.message || 'Failed to delete medicine');
  }
}
