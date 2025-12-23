"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import {
  getMedicineById,
  getInventoryForMedicine,
  getPharmacyById,
} from "@/lib/data";
import type { Medicine, InventoryItem, Pharmacy } from "@/lib/definitions";
import { useCart } from "@/context/cart-context";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  Box,
  Skeleton,
  Divider,
  IconButton,
  Alert,
} from "@mui/material";
import {
  LocalPharmacy,
  Warning,
  LocationOn,
  ShoppingCart,
  Add,
  Remove,
} from "@mui/icons-material";
import { formatGBP } from "@/lib/formatters";

type PharmacyWithInventory = Pharmacy & { inventory: InventoryItem };

export default function MedicineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [pharmacies, setPharmacies] = useState<PharmacyWithInventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState<{[key: string]: number}>({});

  const { id: medicineId } = use(params);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      if (!medicineId) return;
      setLoading(true);
      const med = await getMedicineById(medicineId);
      if (med) {
        setMedicine(med);
        const inventoryItems = await getInventoryForMedicine(medicineId);
        const availablePharmacies = await Promise.all(
          inventoryItems
            .filter((item) => item.stock > 0)
            .map(async (item) => {
              const pharmacy = await getPharmacyById(item.pharmacyId);
              return pharmacy ? { ...pharmacy, inventory: item } : null;
            })
        );
        setPharmacies(availablePharmacies.filter(Boolean) as PharmacyWithInventory[]);

        const initialQuantities: {[key: string]: number} = {};
        availablePharmacies.forEach(p => {
          if (p) initialQuantities[p.id] = 1;
        });
        setQuantities(initialQuantities);
      }
      setLoading(false);
    };

    fetchData();
  }, [medicineId]);

  const handleAddToCart = (pharmacyId: string, medicineId: string) => {
    const quantity = quantities[pharmacyId] || 1;
    addToCart({ medicineId, pharmacyId, quantity });
  };

  const handleQuantityChange = (pharmacyId: string, amount: number) => {
    setQuantities(prev => ({
      ...prev,
      [pharmacyId]: Math.max(1, (prev[pharmacyId] || 1) + amount)
    }))
  }

  if (loading) {
    return (
      <Box className="container mx-auto px-4 md:px-6 py-8">
        <Box className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton variant="rectangular" className="w-full aspect-square rounded-xl" />
          <Box className="space-y-6">
            <Skeleton variant="text" className="h-10 w-3/4" />
            <Skeleton variant="text" className="h-6 w-1/2" />
            <Skeleton variant="text" className="h-20 w-full" />
            <Card>
              <CardHeader>
                <Skeleton variant="text" className="h-8 w-1/3"/>
              </CardHeader>
              <CardContent>
                <Skeleton variant="text" className="h-40 w-full"/>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Box>
    );
  }

  if (!medicine) {
    return (
      <Box className="container mx-auto text-center py-20">
        <Typography variant="h4" component="h1" className="font-bold">
          Medicine not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="container mx-auto px-4 md:px-6 py-8">
      <Box className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <Box>
          <Box className="relative w-full aspect-square bg-white rounded-xl overflow-hidden shadow-lg">
            <Image
              src={medicine.imageUrl}
              alt={medicine.name}
              fill
              className="object-cover"
              data-ai-hint={medicine.imageHint}
            />
          </Box>
        </Box>

        <Box className="space-y-6">
          <Box className="space-y-2">
            <Chip
              label={medicine.category}
              color="primary"
              variant="outlined"
              className="mb-2"
            />
            <Typography variant="h3" component="h1" className="font-bold text-3xl md:text-4xl">
              {medicine.name}
            </Typography>
            <Typography variant="body1" className="text-gray-600 text-lg">
              {medicine.description}
            </Typography>
          </Box>

          <Card className="shadow-md">
            <CardHeader>
              <Box className="flex items-center gap-2">
                <LocalPharmacy color="primary" />
                <Typography variant="h6" component="h2">
                  Medicine Details
                </Typography>
              </Box>
            </CardHeader>
            <CardContent className="space-y-4">
              <Box>
                <Typography variant="body2" className="font-semibold">
                  Dosage:
                </Typography>
                <Typography variant="body1">{medicine.dosage}</Typography>
              </Box>
              <Divider />
              <Box>
                <Typography variant="body2" className="font-semibold">
                  Usage:
                </Typography>
                <Typography variant="body1">{medicine.usage}</Typography>
              </Box>
              <Divider />
              <Box>
                <Box className="flex items-center gap-2 mb-2">
                  <Warning color="error" />
                  <Typography variant="body2" className="font-semibold">
                    Side Effects:
                  </Typography>
                </Box>
                <Typography variant="body2" className="text-gray-600">
                  {medicine.sideEffects}
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Box className="space-y-4">
            <Typography variant="h4" component="h2" className="font-bold">
              Available At
            </Typography>
            {pharmacies.length > 0 ? (
              pharmacies.map((p) => (
                <Card key={p.id} className="shadow-md">
                  <CardHeader className="flex flex-row justify-between items-start">
                    <Box>
                      <Box className="flex items-center gap-2 mb-1">
                        <LocationOn color="primary" />
                        <Typography variant="h6" component="h3">
                          {p.name}
                        </Typography>
                      </Box>
                      <Typography variant="body2" className="text-gray-600">
                        {p.address}, {p.city}
                      </Typography>
                    </Box>
                    <Chip
                      label={`${p.inventory.stock} in stock`}
                      color={p.inventory.stock > 10 ? 'success' : 'error'}
                      size="small"
                    />
                  </CardHeader>
                  <CardContent className="flex flex-col sm:flex-row justify-between items-center gap-4">
                   <Typography variant="h4" className="font-bold text-primary">
  {formatGBP(p.inventory.price)}
</Typography>
                    <Box className="flex items-center gap-2">
                      <Box className="flex items-center gap-1 border rounded-md p-1">
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(p.id, -1)}
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <Typography className="w-8 text-center font-medium">
                          {quantities[p.id] || 1}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleQuantityChange(p.id, 1)}
                        >
                          <Add fontSize="small" />
                        </IconButton>
                      </Box>
                      <Button
                        variant="contained"
                        startIcon={<ShoppingCart />}
                        onClick={() => handleAddToCart(p.id, medicine.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Add to Cart
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Alert severity="info">
                Currently not available at any nearby pharmacies.
              </Alert>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}