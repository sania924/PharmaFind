"use client";

import { useCart } from "@/context/cart-context";
import { getMedicineById, getPharmacyById, getInventoryItem } from "@/lib/data";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Box,
  TextField,
  IconButton,
  Divider,
  Skeleton,
  Alert,
} from "@mui/material";
import {
  Delete,
  ShoppingBag,
  Add,
  Remove,
} from "@mui/icons-material";
import type { InventoryItem } from "@/lib/definitions";

type EnrichedCartItem = {
  medicine: Awaited<ReturnType<typeof getMedicineById>>;
  pharmacy: Awaited<ReturnType<typeof getPharmacyById>>;
  inventory: InventoryItem | undefined;
  quantity: number;
  medicineId: string;
  pharmacyId: string;
};

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, clearCart } = useCart();
  const [enrichedCart, setEnrichedCart] = useState<EnrichedCartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const enrichCart = async () => {
      setLoading(true);
      const enrichedItems = await Promise.all(
        items.map(async (item) => {
          const medicine = await getMedicineById(item.medicineId);
          const pharmacy = await getPharmacyById(item.pharmacyId);
          const inventory = await getInventoryItem(item.pharmacyId, item.medicineId);
          return { ...item, medicine, pharmacy, inventory };
        })
      );
      setEnrichedCart(enrichedItems.filter(i => i.medicine && i.pharmacy && i.inventory) as EnrichedCartItem[]);
      setLoading(false);
    };

    enrichCart();
  }, [items]);

  const subtotal = enrichedCart.reduce((acc, item) => {
    const price = item.inventory?.price || 0;
    return acc + price * item.quantity;
  }, 0);

  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (loading) {
    return (
      <Box className="container mx-auto px-4 md:px-6 py-8">
        <Skeleton variant="rectangular" className="w-full h-96 rounded-lg" />
      </Box>
    );
  }

  if (items.length === 0) {
    return (
      <Box className="container mx-auto px-4 md:px-6 py-12 text-center">
        <ShoppingBag sx={{ fontSize: 64, color: 'text.secondary', mx: 'auto', mb: 2 }} />
        <Typography variant="h3" component="h1" className="font-bold mb-2">
          Your Cart is Empty
        </Typography>
        <Typography variant="body1" color="text.secondary" className="mb-6">
          Looks like you haven't added anything to your cart yet.
        </Typography>
        <Button
          component={Link}
          href="/routes/medicines"
          variant="contained"
          size="large"
        >
          Start Shopping
        </Button>
      </Box>
    );
  }

  return (
    <Box className="container mx-auto px-4 md:px-6 py-8">
      <Typography variant="h3" component="h1" className="font-bold mb-6">
        Shopping Cart
      </Typography>
      <Box className="grid md:grid-cols-3 gap-8 items-start">
        <Box className="md:col-span-2 space-y-4">
          {enrichedCart.map((item) => (
            <Card key={`${item.medicineId}-${item.pharmacyId}`} className="shadow-md">
              <CardContent className="p-4">
                <Box className="flex gap-4 items-center">
                  <Box className="relative h-20 w-20 rounded-md overflow-hidden bg-gray-100">
                    {item.medicine && (
                      <Image
                        src={item.medicine.imageUrl}
                        alt={item.medicine.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </Box>
                  <Box className="flex-grow">
                    <Typography variant="h6" component="p" className="font-semibold">
                      {item.medicine?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      From: {item.pharmacy?.name}
                    </Typography>
                    <Typography variant="body2" className="font-bold text-primary">
                      ${item.inventory?.price.toFixed(2)}
                    </Typography>
                  </Box>
                  <Box className="flex items-center gap-2">
                    <Box className="flex items-center border rounded-md">
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.medicineId, item.pharmacyId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Remove fontSize="small" />
                      </IconButton>
                      <Typography className="px-3 py-1 min-w-12 text-center">
                        {item.quantity}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.medicineId, item.pharmacyId, item.quantity + 1)}
                      >
                        <Add fontSize="small" />
                      </IconButton>
                    </Box>
                    <IconButton
                      onClick={() => removeFromCart(item.medicineId, item.pharmacyId)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box className="md:col-span-1">
          <Card className="shadow-md sticky top-20">
            <CardHeader>
              <Typography variant="h6" component="h2">
                Order Summary
              </Typography>
            </CardHeader>
            <CardContent className="space-y-3">
              <Box className="flex justify-between">
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2">${subtotal.toFixed(2)}</Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography variant="body2">Taxes (Est.)</Typography>
                <Typography variant="body2">${tax.toFixed(2)}</Typography>
              </Box>
              <Divider />
              <Box className="flex justify-between font-bold">
                <Typography variant="body1">Total</Typography>
                <Typography variant="body1">${total.toFixed(2)}</Typography>
              </Box>
            </CardContent>
            <Box className="p-4 pt-0 space-y-2">
              <Button
                variant="contained"
                fullWidth
                onClick={() => {
                  alert("Order placed! (This is a demo)");
                  clearCart();
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Place Order
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={clearCart}
                color="error"
              >
                Clear Cart
              </Button>
            </Box>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}