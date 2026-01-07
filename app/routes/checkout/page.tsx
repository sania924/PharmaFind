'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCart } from '@/context/cart-context';
import { createOrderWithStockReduction } from '@/lib/firebase/orders';
import { getMedicineById, getPharmacyById, getInventoryItem } from '@/lib/data';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { ShoppingCart, CheckCircle } from '@mui/icons-material';

interface EnrichedCartItem {
  medicineId: string;
  pharmacyId: string;
  quantity: number;
  price: number;
  medicineName?: string;
  pharmacyName?: string;
}

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { items: cart, clearCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [enrichedCart, setEnrichedCart] = useState<EnrichedCartItem[]>([]);
  const [error, setError] = useState('');
  const [loadingCart, setLoadingCart] = useState(true);

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?redirect=/routes/checkout');
    }
  }, [status, router]);

  // Enrich cart with medicine and pharmacy details
  useEffect(() => {
    async function enrichCartItems() {
      // Check if cart exists and is not empty
      if (!cart || cart.length === 0) {
        setEnrichedCart([]);
        setLoadingCart(false);
        return;
      }

      try {
        const enriched = await Promise.all(
          cart.map(async (item) => {
            const medicine = await getMedicineById(item.medicineId);
            const pharmacy = await getPharmacyById(item.pharmacyId);
            const inventory = await getInventoryItem(item.pharmacyId, item.medicineId);

            return {
              ...item,
              medicineName: medicine?.name || 'Unknown Medicine',
              pharmacyName: pharmacy?.name || 'Unknown Pharmacy',
              price: inventory?.price || 0,
            };
          })
        );

        setEnrichedCart(enriched);
      } catch (error) {
        console.error('Error enriching cart:', error);
        setError('Failed to load cart details');
      } finally {
        setLoadingCart(false);
      }
    }

    enrichCartItems();
  }, [cart]);

  const total = enrichedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!session?.user?.email) {
      setError('You must be logged in to place an order');
      return;
    }

    if (enrichedCart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    // Verify we have user ID
    if (!session.user.id) {
      console.error('Session user ID is missing!', session.user);
      setError('Session error: User ID not found. Please try logging out and logging back in.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('=== CHECKOUT DEBUG ===');
      console.log('Session user:', session.user);
      console.log('Session user ID:', session.user.id);
      console.log('Session user email:', session.user.email);
      console.log('Cart items:', enrichedCart);
      console.log('Total:', total);

      // Create order with stock reduction
      const orderId = await createOrderWithStockReduction(
        session.user.id, // Use correct user ID
        enrichedCart.map((item) => ({
          medicineId: item.medicineId,
          pharmacyId: item.pharmacyId,
          quantity: item.quantity,
          price: item.price,
        })),
        total
      );

      console.log('Order created with ID:', orderId);
      console.log('=== END CHECKOUT DEBUG ===');

      // Clear cart on success
      clearCart();

      // Redirect to orders page with success message
      router.push(`/routes/orders?success=true&orderId=${orderId}`);
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  if (status === 'loading' || loadingCart) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading checkout...</Typography>
      </Container>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 6 }}>
            <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Add some medicines to your cart before checking out
            </Typography>
            <Button variant="contained" onClick={() => router.push('/')}>
              Continue Shopping
            </Button>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Checkout
        </Typography>
        <Typography color="text.secondary">
          Review your order and complete your purchase
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      {/* Order Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Order Summary
          </Typography>

          <TableContainer component={Paper} elevation={0} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Medicine</TableCell>
                  <TableCell>Pharmacy</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Subtotal</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enrichedCart.map((item, index) => (
                  <TableRow key={`${item.pharmacyId}-${item.medicineId}-${index}`}>
                    <TableCell>
                      <Typography fontWeight="medium">{item.medicineName}</Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {item.pharmacyName}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">{item.quantity}</TableCell>
                    <TableCell align="right">
                      £{item.price.toFixed(2)}
                    </TableCell>
                    <TableCell align="right">
                      <Typography fontWeight="medium">
                        £{(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight="bold">
              Total
            </Typography>
            <Typography variant="h5" fontWeight="bold" color="primary">
              £{total.toFixed(2)}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Customer Info */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Customer Information
          </Typography>
          <Typography variant="body1">
            <strong>Email:</strong> {session?.user?.email}
          </Typography>
          <Typography variant="body1">
            <strong>Name:</strong> {session?.user?.name || 'Not provided'}
          </Typography>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => router.push('/routes/cart')}
          disabled={loading}
        >
          Back to Cart
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={handlePlaceOrder}
          disabled={loading || enrichedCart.length === 0}
          startIcon={loading ? <CircularProgress size={20} /> : <CheckCircle />}
        >
          {loading ? 'Placing Order...' : 'Place Order'}
        </Button>
      </Box>

      {/* Info Box */}
      <Alert severity="info" sx={{ mt: 3 }}>
        <Typography variant="body2">
          <strong>Note:</strong> Your order will be placed and inventory will be updated
          automatically. Stock will be reduced for the selected items.
        </Typography>
      </Alert>
    </Container>
  );
}
