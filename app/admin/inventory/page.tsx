"use client";

import { useEffect, useState } from "react";
import { getInventory, getMedicineById, getPharmacyById } from "@/lib/data";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Menu,
  MenuItem,
  Chip,
} from "@mui/material";
import { PlusCircle, MoreHorizontal } from "lucide-react";

// Helper function to format GBP
const formatGBP = (amount: number) =>
  amount.toLocaleString("en-GB", { style: "currency", currency: "GBP" });

interface EnrichedInventoryItem {
  pharmacyId: string;
  medicineId: string;
  stock: number;
  price: number;
  expiryDate: string;
  medicineName?: string;
  pharmacyName?: string;
}

export default function AdminInventoryPage() {
  const [enrichedInventory, setEnrichedInventory] = useState<EnrichedInventoryItem[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventoryData = async () => {
      const inventory = await getInventory();

      const enriched = await Promise.all(
        inventory.map(async (item) => {
          const medicine = await getMedicineById(item.medicineId);
          const pharmacy = await getPharmacyById(item.pharmacyId);
          return {
            ...item,
            medicineName: medicine?.name,
            pharmacyName: pharmacy?.name,
          };
        })
      );

      setEnrichedInventory(enriched);
    };

    fetchInventoryData();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, itemKey: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(itemKey);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handleEdit = () => {
    console.log("Edit item:", selectedItem);
    handleMenuClose();
  };

  const handleDelete = () => {
    console.log("Delete item:", selectedItem);
    handleMenuClose();
  };

  return (
    <Box className="space-y-6 p-6">
      <Box className="flex justify-between items-center">
        <Typography variant="h4" fontWeight="bold">
          Manage Inventory
        </Typography>
        <Button
          variant="contained"
          startIcon={<PlusCircle className="h-4 w-4" />}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Add Item
        </Button>
      </Box>

      <Card>
        <CardContent className="p-0">
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-semibold">Medicine</TableCell>
                  <TableCell className="font-semibold">Pharmacy</TableCell>
                  <TableCell className="font-semibold">Stock</TableCell>
                  <TableCell className="font-semibold">Price</TableCell>
                  <TableCell className="font-semibold">Expiry Date</TableCell>
                  <TableCell>
                    <span className="sr-only">Actions</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {enrichedInventory.map((item, index) => {
                  const itemKey = `${item.pharmacyId}-${item.medicineId}-${index}`;
                  return (
                    <TableRow key={itemKey} hover>
                      <TableCell className="font-medium">
                        {item.medicineName}
                      </TableCell>
                      <TableCell>{item.pharmacyName}</TableCell>
                      <TableCell>
                        <Chip
                          label={item.stock}
                          color={item.stock > 10 ? "default" : "error"}
                          size="small"
                          variant={item.stock > 10 ? "outlined" : "filled"}
                        />
                      </TableCell>
                      <TableCell>{formatGBP(item.price)}</TableCell>
                      <TableCell>{item.expiryDate}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, itemKey)}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} className="text-red-600">
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
}
