"use client";

import { useEffect, useState } from "react";
import { getInventory, getMedicineById, getPharmacyById, getPharmacies, getMedicines } from "@/lib/data";
import { createInventoryItem, updateInventoryItem, deleteInventoryItem } from "@/lib/firebase/inventory";
import {
  Card,
  CardContent,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
  Select,
  FormControl,
  InputLabel,
  MenuItem as SelectMenuItem,
} from "@mui/material";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import type { Pharmacy, Medicine, InventoryItem } from "@/lib/definitions";

// Helper function to format GBP
const formatGBP = (amount: number) =>
  amount.toLocaleString("en-GB", { style: "currency", currency: "GBP" });

interface EnrichedInventoryItem extends InventoryItem {
  medicineName?: string;
  pharmacyName?: string;
}

export default function AdminInventoryPage() {
  const [enrichedInventory, setEnrichedInventory] = useState<EnrichedInventoryItem[]>([]);
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedItem, setSelectedItem] = useState<EnrichedInventoryItem | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Form state
  const [formData, setFormData] = useState({
    pharmacyId: '',
    medicineId: '',
    stock: 0,
    price: 0,
    expiryDate: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [inventoryData, pharmaciesData, medicinesData] = await Promise.all([
        getInventory(),
        getPharmacies(),
        getMedicines(),
      ]);

      setPharmacies(pharmaciesData);
      setMedicines(medicinesData);

      const enriched = await Promise.all(
        inventoryData.map(async (item) => {
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
    } catch (error) {
      console.error('Error fetching data:', error);
      showSnackbar('Failed to load inventory', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, item: EnrichedInventoryItem) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddClick = () => {
    setIsEdit(false);
    setFormData({
      pharmacyId: '',
      medicineId: '',
      stock: 0,
      price: 0,
      expiryDate: '',
    });
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleEditClick = () => {
    if (selectedItem) {
      setIsEdit(true);
      setFormData({
        pharmacyId: selectedItem.pharmacyId,
        medicineId: selectedItem.medicineId,
        stock: selectedItem.stock,
        price: selectedItem.price,
        expiryDate: selectedItem.expiryDate,
      });
      setOpenDialog(true);
    }
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setOpenDeleteDialog(false);
    setSelectedItem(null);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isEdit && selectedItem) {
        // Update existing inventory item
        await updateInventoryItem(selectedItem.pharmacyId, selectedItem.medicineId, {
          stock: formData.stock,
          price: formData.price,
          expiryDate: formData.expiryDate,
        });
        showSnackbar('Inventory updated successfully!', 'success');
      } else {
        // Create new inventory item
        await createInventoryItem(formData as InventoryItem);
        showSnackbar('Inventory item added successfully!', 'success');
      }
      handleDialogClose();
      // Refresh the list
      await fetchData();
    } catch (error) {
      console.error('Error saving inventory:', error);
      showSnackbar('Failed to save inventory item', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;

    setLoading(true);
    try {
      await deleteInventoryItem(selectedItem.pharmacyId, selectedItem.medicineId);
      showSnackbar('Inventory item deleted successfully!', 'success');
      handleDialogClose();
      // Refresh the list
      await fetchData();
    } catch (error) {
      console.error('Error deleting inventory:', error);
      showSnackbar('Failed to delete inventory item', 'error');
    } finally {
      setLoading(false);
    }
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
          onClick={handleAddClick}
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
                          color={item.stock > 10 ? "success" : "error"}
                          size="small"
                          variant={item.stock > 10 ? "outlined" : "filled"}
                        />
                      </TableCell>
                      <TableCell>{formatGBP(item.price)}</TableCell>
                      <TableCell>{item.expiryDate}</TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, item)}
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

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick} className="text-red-600">
          Delete
        </MenuItem>
      </Menu>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEdit ? 'Edit Inventory Item' : 'Add New Inventory Item'}
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <FormControl fullWidth disabled={isEdit}>
              <InputLabel>Pharmacy</InputLabel>
              <Select
                value={formData.pharmacyId}
                label="Pharmacy"
                onChange={(e) => handleInputChange('pharmacyId', e.target.value)}
              >
                {pharmacies.map((pharmacy) => (
                  <SelectMenuItem key={pharmacy.id} value={pharmacy.id}>
                    {pharmacy.name}
                  </SelectMenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth disabled={isEdit}>
              <InputLabel>Medicine</InputLabel>
              <Select
                value={formData.medicineId}
                label="Medicine"
                onChange={(e) => handleInputChange('medicineId', e.target.value)}
              >
                {medicines.map((medicine) => (
                  <SelectMenuItem key={medicine.id} value={medicine.id}>
                    {medicine.name}
                  </SelectMenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Stock Quantity"
              type="number"
              value={formData.stock}
              onChange={(e) => handleInputChange('stock', parseInt(e.target.value) || 0)}
              required
              inputProps={{ min: 0 }}
            />

            <TextField
              fullWidth
              label="Price (GBP)"
              type="number"
              value={formData.price}
              onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
              required
              inputProps={{ min: 0, step: 0.01 }}
            />

            <TextField
              fullWidth
              label="Expiry Date"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading || !formData.pharmacyId || !formData.medicineId}
          >
            {loading ? <CircularProgress size={24} /> : (isEdit ? 'Update' : 'Add')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleDialogClose}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this inventory item?
          </Typography>
          <Box className="mt-2 p-2 bg-gray-100 rounded">
            <Typography variant="body2">
              <strong>Medicine:</strong> {selectedItem?.medicineName}
            </Typography>
            <Typography variant="body2">
              <strong>Pharmacy:</strong> {selectedItem?.pharmacyName}
            </Typography>
            <Typography variant="body2">
              <strong>Stock:</strong> {selectedItem?.stock}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
