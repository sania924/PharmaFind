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
  getDoc,
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
      // Store enriched order items with names
      const enrichedItems: Array<{
        medicineId: string;
        medicineName: string;
        quantity: number;
        price: number;
      }> = [];

      let pharmacyId = '';
      let pharmacyName = '';

      // Store inventory updates to perform after all reads
      const inventoryUpdates: Array<{
        ref: any;
        newStock: number;
      }> = [];

      // PHASE 1: ALL READS FIRST
      // First, get inventory refs OUTSIDE transaction (queries can't be in transactions)
      const inventoryRefs: any[] = [];
      for (const item of items) {
        const inventoryQuery = query(
          collection(db, 'inventory'),
          where('pharmacyId', '==', item.pharmacyId),
          where('medicineId', '==', item.medicineId)
        );
        const inventorySnapshot = await getDocs(inventoryQuery);
        if (inventorySnapshot.empty) {
          throw new Error(`Inventory not found for medicine at pharmacy.`);
        }
        inventoryRefs.push(inventorySnapshot.docs[0].ref);
      }

      // Now do ALL transactional reads
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const inventoryRef = inventoryRefs[i];

        // Transactional read for inventory
        const inventorySnap = await transaction.get(inventoryRef);
        if (!inventorySnap.exists()) {
          throw new Error('Inventory document not found');
        }
        const currentStock = (inventorySnap.data() as any).stock;

        // Transactional read for medicine details
        const medicineRef = doc(db, 'medicines', item.medicineId);
        const medicineSnap = await transaction.get(medicineRef);
        const medicineName = medicineSnap.exists() ? medicineSnap.data().name : 'Unknown Medicine';

        // Transactional read for pharmacy (only once)
        if (!pharmacyId) {
          pharmacyId = item.pharmacyId;
          const pharmacyRef = doc(db, 'pharmacies', item.pharmacyId);
          const pharmacySnap = await transaction.get(pharmacyRef);
          pharmacyName = pharmacySnap.exists() ? pharmacySnap.data().name : 'Unknown Pharmacy';
        }

        // Validate stock availability
        if (currentStock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${medicineName}. Only ${currentStock} available, but you requested ${item.quantity}.`
          );
        }

        // Add to enriched items
        enrichedItems.push({
          medicineId: item.medicineId,
          medicineName,
          quantity: item.quantity,
          price: item.price,
        });

        // Store the update to perform later
        inventoryUpdates.push({
          ref: inventoryRef,
          newStock: currentStock - item.quantity,
        });
      }

      // PHASE 2: ALL WRITES AFTER ALL READS
      // Update inventory stock
      for (const update of inventoryUpdates) {
        transaction.update(update.ref, {
          stock: update.newStock,
          updatedAt: serverTimestamp(),
        });
      }

      // 3. Create order document with all required fields
      const orderRef = doc(collection(db, 'orders'));

      const orderData = {
        userId,
        pharmacyId,
        pharmacyName,
        items: enrichedItems,
        total: totalAmount, // Use 'total' instead of 'totalAmount'
        status: 'Pending',
        createdAt: serverTimestamp(),
      };

      console.log('=== ORDER CREATION DEBUG ===');
      console.log('userId:', userId);
      console.log('pharmacyId:', pharmacyId);
      console.log('pharmacyName:', pharmacyName);
      console.log('items count:', enrichedItems.length);
      console.log('total:', totalAmount);
      console.log('Full order data:', { ...orderData, createdAt: 'serverTimestamp()' });

      transaction.set(orderRef, orderData);

      console.log('Order created successfully with ID:', orderRef.id);
      console.log('=== END ORDER CREATION DEBUG ===');

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

