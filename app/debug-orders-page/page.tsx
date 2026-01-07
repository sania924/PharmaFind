'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { getOrdersForUser } from '@/lib/data';
import { Box, Container, Typography, Paper, CircularProgress, Button } from '@mui/material';

export default function DebugOrdersPage() {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchData();
    }
  }, [status, session]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Get orders for current user
      const userOrders = await getOrdersForUser(session!.user.id);
      setOrders(userOrders);

      // Get all orders from API
      const response = await fetch('/api/debug/check-orders');
      const data = await response.json();
      setAllOrders(data.orders || []);

      setLoading(false);
    } catch (err: any) {
      console.error('Debug fetch error:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading debug data...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Orders Debug Page
      </Typography>

      <Button variant="outlined" onClick={fetchData} sx={{ mb: 3 }}>
        Refresh Data
      </Button>

      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography><strong>Error:</strong> {error}</Typography>
        </Paper>
      )}

      {/* Session Info */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Session Information</Typography>
        <pre style={{ overflow: 'auto', fontSize: '12px' }}>
          {JSON.stringify({
            userId: session?.user?.id,
            email: session?.user?.email,
            name: session?.user?.name,
            role: session?.user?.role,
          }, null, 2)}
        </pre>
      </Paper>

      {/* User's Orders */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Orders for Current User (getOrdersForUser result)
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Count: {orders.length}
        </Typography>
        <pre style={{ overflow: 'auto', fontSize: '12px', maxHeight: '400px' }}>
          {JSON.stringify(orders, null, 2)}
        </pre>
      </Paper>

      {/* All Orders in Firestore */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          All Orders in Firestore
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Count: {allOrders.length}
        </Typography>
        <pre style={{ overflow: 'auto', fontSize: '12px', maxHeight: '400px' }}>
          {JSON.stringify(allOrders, null, 2)}
        </pre>
      </Paper>

      {/* Analysis */}
      <Paper sx={{ p: 3, mt: 3, bgcolor: 'info.light' }}>
        <Typography variant="h6" gutterBottom>Analysis</Typography>
        <Typography variant="body2" component="div">
          <ul>
            <li>Your User ID: <strong>{session?.user?.id}</strong></li>
            <li>Orders found for you: <strong>{orders.length}</strong></li>
            <li>Total orders in Firestore: <strong>{allOrders.length}</strong></li>
            <li>
              User ID matches: {allOrders.map(o => o.userId).includes(session?.user?.id)
                ? '✅ Yes'
                : '❌ No - This is the problem!'}
            </li>
          </ul>
        </Typography>
      </Paper>
    </Container>
  );
}
