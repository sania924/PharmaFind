"use client";

import Header from "@/app/layout/header";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
} from "@mui/material";
import { Building, Pill, ShoppingCart, DollarSign } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { name: "Mon", orders: 20 },
  { name: "Tue", orders: 30 },
  { name: "Wed", orders: 25 },
  { name: "Thu", orders: 45 },
  { name: "Fri", orders: 35 },
  { name: "Sat", orders: 50 },
  { name: "Sun", orders: 60 },
];

export default function AdminDashboardPage() {
  return (
    <>
      <Box className="space-y-6 p-6">
        <Typography variant="h4" fontWeight="bold">
          Admin Dashboard
        </Typography>

        <Box className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Revenue" value="$45,231.89" subtitle="+20.1% from last month" icon={<DollarSign />} />
          <StatCard title="Total Orders" value="2,350" subtitle="+180.1% from last month" icon={<ShoppingCart />} />
          <StatCard title="Pharmacies" value="3" subtitle="Registered Partner Pharmacies" icon={<Building />} />
          <StatCard title="Products" value="5" subtitle="Unique medicines listed" icon={<Pill />} />
        </Box>

        <Card>
          <CardHeader title="Weekly Orders" />
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="orders" fill="#1976d2" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </Box>
    </>
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
