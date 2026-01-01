"use client";

import { useEffect, useState } from "react";
import { getPharmacies } from "@/lib/data";
import { createPharmacy, updatePharmacy, deletePharmacy } from "@/lib/firebase/pharmacies";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import type { Pharmacy } from "@/lib/definitions";

export default function AdminPharmaciesPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    lat: 0,
    lng: 0,
    contact: '',
  });

  useEffect(() => {
    fetchPharmacies();
  }, []);

  const fetchPharmacies = async () => {
    try {
      const data = await getPharmacies();
      setPharmacies(data);
    } catch (error) {
      console.error('Error fetching pharmacies:', error);
      showSnackbar('Failed to load pharmacies', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, pharmacy: Pharmacy) => {
    setAnchorEl(event.currentTarget);
    setSelectedPharmacy(pharmacy);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddClick = () => {
    setIsEdit(false);
    setFormData({
      name: '',
      address: '',
      city: '',
      lat: 0,
      lng: 0,
      contact: '',
    });
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleEditClick = () => {
    if (selectedPharmacy) {
      setIsEdit(true);
      setFormData({
        name: selectedPharmacy.name,
        address: selectedPharmacy.address,
        city: selectedPharmacy.city,
        lat: selectedPharmacy.lat,
        lng: selectedPharmacy.lng,
        contact: selectedPharmacy.contact,
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
    setSelectedPharmacy(null);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isEdit && selectedPharmacy) {
        // Update existing pharmacy
        await updatePharmacy(selectedPharmacy.id, formData);
        showSnackbar('Pharmacy updated successfully!', 'success');
      } else {
        // Create new pharmacy
        await createPharmacy(formData);
        showSnackbar('Pharmacy added successfully!', 'success');
      }
      handleDialogClose();
      // Refresh the list
      await fetchPharmacies();
    } catch (error) {
      console.error('Error saving pharmacy:', error);
      showSnackbar('Failed to save pharmacy', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedPharmacy) return;

    setLoading(true);
    try {
      await deletePharmacy(selectedPharmacy.id);
      showSnackbar('Pharmacy deleted successfully!', 'success');
      handleDialogClose();
      // Refresh the list
      await fetchPharmacies();
    } catch (error) {
      console.error('Error deleting pharmacy:', error);
      showSnackbar('Failed to delete pharmacy', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="space-y-6 p-6">
      <Box className="flex justify-between items-center">
        <Typography variant="h4" fontWeight="bold">
          Manage Pharmacies
        </Typography>
        <Button
          variant="contained"
          startIcon={<PlusCircle className="h-4 w-4" />}
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleAddClick}
        >
          Add Pharmacy
        </Button>
      </Box>

      <Card>
        <CardContent className="p-0">
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell className="font-semibold">Name</TableCell>
                  <TableCell className="font-semibold">Address</TableCell>
                  <TableCell className="font-semibold">City</TableCell>
                  <TableCell className="font-semibold">Contact</TableCell>
                  <TableCell className="font-semibold">Coordinates</TableCell>
                  <TableCell>
                    <span className="sr-only">Actions</span>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pharmacies.map((pharmacy) => (
                  <TableRow key={pharmacy.id} hover>
                    <TableCell className="font-medium">
                      {pharmacy.name}
                    </TableCell>
                    <TableCell>{pharmacy.address}</TableCell>
                    <TableCell>{pharmacy.city}</TableCell>
                    <TableCell>{pharmacy.contact}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {pharmacy.lat.toFixed(6)}, {pharmacy.lng.toFixed(6)}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, pharmacy)}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
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
          {isEdit ? 'Edit Pharmacy' : 'Add New Pharmacy'}
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <TextField
              fullWidth
              label="Pharmacy Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="City"
              value={formData.city}
              onChange={(e) => handleInputChange('city', e.target.value)}
              required
            />
            <Box className="grid grid-cols-2 gap-4">
              <TextField
                fullWidth
                label="Latitude"
                type="number"
                value={formData.lat}
                onChange={(e) => handleInputChange('lat', parseFloat(e.target.value) || 0)}
                required
                inputProps={{ step: 'any' }}
              />
              <TextField
                fullWidth
                label="Longitude"
                type="number"
                value={formData.lng}
                onChange={(e) => handleInputChange('lng', parseFloat(e.target.value) || 0)}
                required
                inputProps={{ step: 'any' }}
              />
            </Box>
            <TextField
              fullWidth
              label="Contact Phone"
              value={formData.contact}
              onChange={(e) => handleInputChange('contact', e.target.value)}
              required
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
            disabled={loading}
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
            Are you sure you want to delete <strong>{selectedPharmacy?.name}</strong>?
          </Typography>
          <Typography variant="body2" color="error" className="mt-2">
            This will also delete all inventory items for this pharmacy.
          </Typography>
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
