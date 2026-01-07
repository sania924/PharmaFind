import { NextRequest, NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export async function GET(request: NextRequest) {
  try {
    console.log('[Debug Check Orders] Starting...');

    // Get all orders directly from Firestore
    const ordersRef = collection(db, 'orders');
    const querySnapshot = await getDocs(ordersRef);

    console.log('[Debug Check Orders] Total documents in orders collection:', querySnapshot.size);

    const allOrders = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        pharmacyName: data.pharmacyName,
        status: data.status,
        total: data.total || data.totalAmount,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || 'N/A',
        itemCount: data.items?.length || 0,
      };
    });

    console.log('[Debug Check Orders] All orders:', allOrders);

    return NextResponse.json({
      success: true,
      totalOrders: querySnapshot.size,
      orders: allOrders,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
  } catch (error: any) {
    console.error('[Debug Check Orders] Error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to fetch orders',
        details: error.toString()
      },
      { status: 500 }
    );
  }
}
