import { NextResponse } from 'next/server';
import { getAllOrders } from '@/lib/firebase/firestore';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    // Get session to verify admin access
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('[Debug API] Fetching all orders from Firestore...');

    const allOrders = await getAllOrders();

    console.log('[Debug API] Found', allOrders.length, 'total orders in Firestore');

    return NextResponse.json({
      success: true,
      totalOrders: allOrders.length,
      orders: allOrders,
      currentUser: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
    });
  } catch (error: any) {
    console.error('[Debug API] Error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
