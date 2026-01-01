"use client";

import { useEffect, useState } from "react";
import { CurrencyPound } from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { Building, Pill, ShoppingCart, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { collection, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { Order, Pharmacy, Medicine } from "@/lib/definitions";
import { format, subDays, startOfDay, isAfter } from "date-fns";
import { useRouter } from "next/navigation";

// Helper to serialize Firestore timestamps
function serializeDoc(data: any): any {
  const serialized: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Timestamp) {
      serialized[key] = value.toDate().toISOString();
    } else if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
      serialized[key] = value.toDate().toISOString();
    } else {
      serialized[key] = value;
    }
  }
  return serialized;
}

// Helper function to format GBP
const formatGBP = (amount: number) =>
  amount.toLocaleString("en-GB", { style: "currency", currency: "GBP" });

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminDashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Real-time listener for orders
    const unsubscribeOrders = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const ordersData: Order[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...serializeDoc(doc.data()),
        } as Order));
        setOrders(ordersData);
      }
    );

    // Real-time listener for pharmacies
    const unsubscribePharmacies = onSnapshot(
      collection(db, 'pharmacies'),
      (snapshot) => {
        const pharmaciesData: Pharmacy[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...serializeDoc(doc.data()),
        } as Pharmacy));
        setPharmacies(pharmaciesData);
      }
    );

    // Real-time listener for medicines
    const unsubscribeMedicines = onSnapshot(
      collection(db, 'medicines'),
      (snapshot) => {
        const medicinesData: Medicine[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...serializeDoc(doc.data()),
        } as Medicine));
        setMedicines(medicinesData);
        setLoading(false);
      }
    );

    return () => {
      unsubscribeOrders();
      unsubscribePharmacies();
      unsubscribeMedicines();
    };
  }, []);

  // Calculate statistics
  const totalRevenue = orders
    .filter(o => o.status === 'Completed')
    .reduce((sum, order) => sum + order.total, 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const completedOrders = orders.filter(o => o.status === 'Completed').length;

  // Last 7 days orders
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      date: startOfDay(date),
      name: format(date, 'EEE'),
      orders: 0,
      revenue: 0,
    };
  });

  orders.forEach(order => {
    if (order.createdAt) {
      const orderDate = startOfDay(new Date(order.createdAt));
      const dayData = last7Days.find(d => d.date.getTime() === orderDate.getTime());
      if (dayData) {
        dayData.orders += 1;
        if (order.status === 'Completed') {
          dayData.revenue += order.total;
        }
      }
    }
  });

  // Order status distribution for pie chart
  const statusData = [
    { name: 'Completed', value: completedOrders },
    { name: 'Pending', value: pendingOrders },
    { name: 'Cancelled', value: orders.filter(o => o.status === 'Cancelled').length },
  ].filter(item => item.value > 0);

  const revenueChange = last7Days.length >= 2
    ? ((last7Days[6].revenue - last7Days[0].revenue) / Math.max(last7Days[0].revenue, 1) * 100).toFixed(1)
    : 0;

  const ordersChange = last7Days.length >= 2
    ? ((last7Days[6].orders - last7Days[0].orders) / Math.max(last7Days[0].orders, 1) * 100).toFixed(1)
    : 0;

  if (loading) {
    return (
      <Box sx={{ p: 6, textAlign: 'center' }}>
        <Typography variant="h6">Loading dashboard...</Typography>
      </Box>
    );
  }

  return (
    <Box className="space-y-6 p-6">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          onClick={() => router.push('/admin/orders')}
        >
          Manage Orders
        </Button>
      </Box>

      <Box className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={formatGBP(totalRevenue)}
          subtitle={`${revenueChange > 0 ? '+' : ''}${revenueChange}% from yesterday`}
          icon={<CurrencyPound />}
        />

        <StatCard
          title="Total Orders"
          value={totalOrders.toString()}
          subtitle={`${pendingOrders} pending, ${completedOrders} completed`}
          icon={<ShoppingCart />}
        />
        <StatCard
          title="Pharmacies"
          value={pharmacies.length.toString()}
          subtitle="Registered Partner Pharmacies"
          icon={<Building />}
        />
        <StatCard
          title="Medicines"
          value={medicines.length.toString()}
          subtitle="Unique medicines listed"
          icon={<Pill />}
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3 }}>
        <Card>
          <CardHeader title="Last 7 Days Orders" />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#1976d2" name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader title="Order Status Distribution" />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>

      <Card>
        <CardHeader title="Last 7 Days Revenue" />
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatGBP(Number(value))} />
              <Legend />
              <Bar dataKey="revenue" fill="#00C49F" name="Revenue (£)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

function StatCard({ title, value, subtitle, icon }: any) {
  return (
    <Card>
      <CardContent>
        <Box className="flex items-center justify-between">
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          {icon}
        </Box>

        <Typography variant="h5" fontWeight="bold" mt={2}>
          {value}
        </Typography>

        <Typography variant="caption" color="text.secondary">
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
}
