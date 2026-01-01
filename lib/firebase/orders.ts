// Client-side Order CRUD operations with stock reduction
'use client';

import {
  collection,
  addDoc,
  serverTimestamp,
  runTransaction,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from './config';
import type { Order } from '../definitions';

export interface CartItem {
  medicineId: string;
  pharmacyId: string;
  quantity: number;
  price: number;
}

export interface OrderItem {
  medicineId: string;
  pharmacyId: string;
  quantity: number;
  price: number;
}

/**
 * Creates an order and reduces inventory stock atomically
 * @param userId - User ID placing the order
 * @param items - Cart items to order
 * @param totalAmount - Total order amount
 * @returns Order ID
 */
export async function createOrderWithStockReduction(
  userId: string,
  items: CartItem[],
  totalAmount: number
): Promise<string> {
  try {
    return await runTransaction(db, async (transaction) => {
      // 1. Validate stock for all items and prepare updates
      for (const item of items) {
        // Find inventory document
        const inventoryQuery = query(
          collection(db, 'inventory'),
          where('pharmacyId', '==', item.pharmacyId),
          where('medicineId', '==', item.medicineId)
        );

        const inventorySnapshot = await getDocs(inventoryQuery);

        if (inventorySnapshot.empty) {
          throw new Error(
            `Inventory not found for medicine at pharmacy. Please refresh and try again.`
          );
        }

        const inventoryDoc = inventorySnapshot.docs[0];
        const inventoryRef = inventoryDoc.ref;
        const currentStock = inventoryDoc.data().stock;

        // Validate stock availability
        if (currentStock < item.quantity) {
          const medicineName = inventoryDoc.data().medicineName || 'this item';
          throw new Error(
            `Insufficient stock for ${medicineName}. Only ${currentStock} available, but you requested ${item.quantity}.`
          );
        }

        // 2. Reduce stock (will be committed if transaction succeeds)
        transaction.update(inventoryRef, {
          stock: currentStock - item.quantity,
          updatedAt: serverTimestamp(),
        });
      }

      // 3. Create order document
      const orderRef = doc(collection(db, 'orders'));

      const orderData = {
        userId,
        items: items.map((item) => ({
          medicineId: item.medicineId,
          pharmacyId: item.pharmacyId,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
        status: 'Pending',
        createdAt: serverTimestamp(),
        deliveredAt: null,
      };

      transaction.set(orderRef, orderData);

      return orderRef.id;
    });
  } catch (error: any) {
    console.error('Error creating order:', error);
    throw new Error(error.message || 'Failed to place order. Please try again.');
  }
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const orderDoc = await getDocs(
      query(collection(db, 'orders'), where('__name__', '==', orderId))
    );

    if (orderDoc.empty) {
      return null;
    }

    const data = orderDoc.docs[0].data();
    return {
      id: orderDoc.docs[0].id,
      ...data,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
      deliveredAt: data.deliveredAt?.toDate?.()?.toISOString() || data.deliveredAt,
    } as unknown as Order;
  } catch (error) {
    console.error('Error getting order:', error);
    return null;
  }
}

/**
 * Update order status (admin only)
 */
export async function updateOrderStatus(
  orderId: string,
  status: 'Pending' | 'Delivered'
): Promise<void> {
  try {
    const orderQuery = query(
      collection(db, 'orders'),
      where('__name__', '==', orderId)
    );
    const orderSnapshot = await getDocs(orderQuery);

    if (!orderSnapshot.empty) {
      const orderRef = orderSnapshot.docs[0].ref;
      const updateData: any = {
        status,
        updatedAt: serverTimestamp(),
      };

      if (status === 'Delivered') {
        updateData.deliveredAt = serverTimestamp();
      }

      await updateDoc(orderRef, updateData);
    } else {
      throw new Error('Order not found');
    }
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
}
