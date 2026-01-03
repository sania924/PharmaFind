'use client';

import { getOrdersForUser } from "@/lib/data";
import { format } from "date-fns";
import { useEffect, useState, Suspense } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Box,
  CircularProgress,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ExpandMore, ShoppingCart, Store, CalendarToday, Receipt, LocalShipping } from "@mui/icons-material";
import SuccessAlert from "./SuccessAlert";
import type { Order } from "@/lib/definitions";

// Helper to format currency in GBP
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(amount);
};

function OrdersContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }

    if (status === 'authenticated' && session?.user?.email) {
      fetchOrders();
    }
  }, [status, session, router, searchParams]);

  const fetchOrders = async () => {
    if (!session?.user?.email) return;

    try {
      setLoading(true);
      console.log('[Orders Page] Fetching orders for user:', session.user.email);
      const fetchedOrders = await getOrdersForUser(session.user.email);
      console.log('[Orders Page] Fetched orders:', fetchedOrders.length, 'orders');
      setOrders(fetchedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === 'loading') {
    return (
      <Box className="container mx-auto px-4 md:px-6 py-12 text-center">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading orders...</Typography>
      </Box>
    );
  }

  if (orders.length === 0) {
    return (
      <Box className="container mx-auto px-4 md:px-6 py-12 text-center">
        <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mx: 'auto', mb: 2 }} />
        <Typography variant="h3" component="h1" className="font-bold mb-2">
          No Orders Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You haven't placed any orders yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="container mx-auto px-4 md:px-6 py-8">
      <SuccessAlert />
      <Box className="flex justify-between items-center mb-6">
        <Typography variant="h3" component="h1" className="font-bold">
          My Orders
        </Typography>
        <Button
          variant="outlined"
          onClick={fetchOrders}
          disabled={loading}
        >
          {loading ? <CircularProgress size={20} /> : 'Refresh'}
        </Button>
      </Box>
      <Card className="shadow-md">
        <CardContent className="p-0">
          {orders.map((order) => (
            <Accordion key={order.id} className="border-b last:border-b-0">
              <AccordionSummary
                expandIcon={<ExpandMore />}
                className="px-6 py-4 hover:bg-gray-50"
              >
                <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full pr-4">
                  <Box className="mb-2 sm:mb-0">
                    <Typography variant="h6" component="p" className="font-semibold">
                      Order #{order.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      From: {order.pharmacyName}
                    </Typography>
                  </Box>
                  <Box className="flex flex-col items-start sm:items-end gap-1">
                    <Chip
                      label={order.status}
                      color={order.status === 'Completed' ? 'success' : 'default'}
                      size="small"
                      variant={order.status === 'Completed' ? 'filled' : 'outlined'}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(order.createdAt), "MMMM d, yyyy")}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails className="px-6 pb-6">
                <Box>
                  {/* Order Info Grid */}
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Receipt fontSize="small" color="primary" />
                          <Typography variant="caption" color="text.secondary" fontWeight="bold">
                            Order ID
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="medium">
                          {order.id}
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <CalendarToday fontSize="small" color="primary" />
                          <Typography variant="caption" color="text.secondary" fontWeight="bold">
                            Order Date
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="medium">
                          {format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")}
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Store fontSize="small" color="primary" />
                          <Typography variant="caption" color="text.secondary" fontWeight="bold">
                            Pharmacy
                          </Typography>
                        </Box>
                        <Typography variant="body2" fontWeight="medium">
                          {order.pharmacyName}
                        </Typography>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                      <Paper elevation={0} sx={{ p: 2, bgcolor: 'grey.50' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <LocalShipping fontSize="small" color="primary" />
                          <Typography variant="caption" color="text.secondary" fontWeight="bold">
                            Status
                          </Typography>
                        </Box>
                        <Chip
                          label={order.status}
                          color={order.status === 'Completed' ? 'success' : 'default'}
                          size="small"
                          variant="filled"
                        />
                      </Paper>
                    </Grid>
                  </Grid>

                  {/* Items Table */}
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 2 }}>
                    Order Items
                  </Typography>
                  <TableContainer component={Paper} elevation={0} sx={{ border: 1, borderColor: 'grey.200' }}>
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.50' }}>
                          <TableCell><strong>Medicine</strong></TableCell>
                          <TableCell align="center"><strong>Quantity</strong></TableCell>
                          <TableCell align="right"><strong>Unit Price</strong></TableCell>
                          <TableCell align="right"><strong>Subtotal</strong></TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.items.map((item) => (
                          <TableRow key={item.medicineId} hover>
                            <TableCell>
                              <Typography variant="body2" fontWeight="medium">
                                {item.medicineName}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip label={`×${item.quantity}`} size="small" variant="outlined" />
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2">
                                {formatCurrency(item.price)}
                              </Typography>
                            </TableCell>
                            <TableCell align="right">
                              <Typography variant="body2" fontWeight="medium">
                                {formatCurrency(item.price * item.quantity)}
                              </Typography>
                            </TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} align="right">
                            <Typography variant="h6" fontWeight="bold">
                              Total Amount
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="h6" fontWeight="bold" color="primary">
                              {formatCurrency(order.total)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}

export default function OrdersPage() {
  return (
    <Suspense fallback={
      <Box className="container mx-auto px-4 md:px-6 py-12 text-center">
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading orders...</Typography>
      </Box>
    }>
      <OrdersContent />
    </Suspense>
  );
}
