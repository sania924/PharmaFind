'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';

export default function DebugOrdersPage() {
  const [rawOrders, setRawOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    setError('');
    try {
      console.log('Fetching orders from Firestore...');
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      console.log('Snapshot size:', snapshot.size);
      console.log('Snapshot empty:', snapshot.empty);

      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log('Raw orders:', orders);
      setRawOrders(orders);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Debug Orders (Raw Firestore Data)
      </Typography>

      <Button variant="contained" onClick={fetchOrders} disabled={loading} sx={{ mb: 3 }}>
        {loading ? 'Loading...' : 'Refresh'}
      </Button>

      {error && (
        <Card sx={{ mb: 2, bgcolor: 'error.light' }}>
          <CardContent>
            <Typography color="error">Error: {error}</Typography>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Total Orders: {rawOrders.length}
          </Typography>

          <pre style={{
            overflow: 'auto',
            backgroundColor: '#f5f5f5',
            padding: '16px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            {JSON.stringify(rawOrders, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </Box>
  );
}
