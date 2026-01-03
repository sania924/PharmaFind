"use client";

import { useEffect, useState } from "react";
import { getMedicines } from "@/lib/data";
import { createMedicine, updateMedicine, deleteMedicine } from "@/lib/firebase/medicines";
import ImageUpload from "@/app/components/ImageUpload";
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
  FormControl,
  InputLabel,
  Select,
  MenuItem as SelectMenuItem,
  Chip,
} from "@mui/material";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import type { Medicine } from "@/lib/definitions";

const CATEGORIES = [
  "Pain Relief",
  "Allergy",
  "Vitamins & Supplements",
  "Cold & Flu",
  "Digestive Health",
  "Antibiotics",
  "Other",
];

export default function AdminMedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    dosage: '',
    usage: '',
    sideEffects: '',
    imageUrl: '',
    imageHint: '',
  });

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const data = await getMedicines();
      setMedicines(data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      showSnackbar('Failed to load medicines', 'error');
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, medicine: Medicine) => {
    setAnchorEl(event.currentTarget);
    setSelectedMedicine(medicine);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAddNew = () => {
    setIsEdit(false);
    setFormData({
      name: '',
      description: '',
      category: '',
      dosage: '',
      usage: '',
      sideEffects: '',
      imageUrl: '',
      imageHint: '',
    });
    setOpenDialog(true);
  };

  const handleEdit = () => {
    if (!selectedMedicine) return;

    setIsEdit(true);
    setFormData({
      name: selectedMedicine.name,
      description: selectedMedicine.description,
      category: selectedMedicine.category,
      dosage: selectedMedicine.dosage,
      usage: selectedMedicine.usage,
      sideEffects: selectedMedicine.sideEffects,
      imageUrl: selectedMedicine.imageUrl || '',
      imageHint: selectedMedicine.imageHint || '',
    });
    setOpenDialog(true);
    handleMenuClose();
  };

  const handleDelete = () => {
    setOpenDeleteDialog(true);
    handleMenuClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setOpenDeleteDialog(false);
    setSelectedMedicine(null);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
  };

  const handleImageDelete = () => {
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Use placeholder image if no image is uploaded
      const dataToSubmit = {
        ...formData,
        imageUrl: formData.imageUrl || 'https://via.placeholder.com/400x400/e3f2fd/1976d2?text=Medicine',
      };

      if (isEdit && selectedMedicine) {
        await updateMedicine(selectedMedicine.id, dataToSubmit);
        showSnackbar('Medicine updated successfully!', 'success');
      } else {
        await createMedicine(dataToSubmit);
        showSnackbar('Medicine added successfully!', 'success');
      }

      handleDialogClose();
      fetchMedicines();
    } catch (error: any) {
      showSnackbar(error.message || 'Operation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedMedicine) return;

    try {
      setLoading(true);
      await deleteMedicine(selectedMedicine.id, selectedMedicine.imageUrl);
      showSnackbar('Medicine deleted successfully!', 'success');
      handleDialogClose();
      fetchMedicines();
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to delete medicine', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="container mx-auto px-4 md:px-6 py-8">
      <Card>
        <CardContent>
          <Box className="flex justify-between items-center mb-6">
            <Typography variant="h4" component="h1" className="font-bold">
              Medicines Management
            </Typography>
            <Button
              variant="contained"
              startIcon={<PlusCircle size={20} />}
              onClick={handleAddNew}
            >
              Add Medicine
            </Button>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Image</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Dosage</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicines.map((medicine) => (
                  <TableRow key={medicine.id} hover>
                    <TableCell>
                      <img
                        src={medicine.imageUrl}
                        alt={medicine.name}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: 'cover',
                          borderRadius: 8,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" className="font-semibold">
                        {medicine.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={medicine.category} size="small" color="primary" />
                    </TableCell>
                    <TableCell>{medicine.dosage}</TableCell>
                    <TableCell>
                      <Typography variant="body2" noWrap sx={{ maxWidth: 300 }}>
                        {medicine.description}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        onClick={(e) => handleMenuOpen(e, medicine)}
                        size="small"
                      >
                        <MoreHorizontal size={20} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {medicines.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="textSecondary">
                        No medicines found. Add your first medicine!
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleEdit}>Edit</MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {isEdit ? 'Edit Medicine' : 'Add New Medicine'}
        </DialogTitle>
        <DialogContent>
          <Box className="space-y-4 mt-2">
            <TextField
              fullWidth
              label="Medicine Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              placeholder="e.g., Ibuprofen 200mg"
            />

            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                {CATEGORIES.map((category) => (
                  <SelectMenuItem key={category} value={category}>
                    {category}
                  </SelectMenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Dosage"
              value={formData.dosage}
              onChange={(e) => handleInputChange('dosage', e.target.value)}
              required
              placeholder="e.g., 200mg per tablet"
            />

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              required
              multiline
              rows={3}
              placeholder="Brief description of the medicine and its uses"
            />

            <TextField
              fullWidth
              label="Usage Instructions"
              value={formData.usage}
              onChange={(e) => handleInputChange('usage', e.target.value)}
              required
              multiline
              rows={2}
              placeholder="e.g., Take one tablet every 4-6 hours as needed"
            />

            <TextField
              fullWidth
              label="Side Effects"
              value={formData.sideEffects}
              onChange={(e) => handleInputChange('sideEffects', e.target.value)}
              required
              multiline
              rows={2}
              placeholder="e.g., May cause stomach upset, nausea, or dizziness"
            />

            <TextField
              fullWidth
              label="Image Description (for accessibility)"
              value={formData.imageHint}
              onChange={(e) => handleInputChange('imageHint', e.target.value)}
              placeholder="e.g., Pain relief medication pills"
            />

            {/* Image Upload Component */}
            <ImageUpload
              currentImageUrl={formData.imageUrl}
              onImageUploaded={handleImageUpload}
              onImageDeleted={handleImageDelete}
              storagePath="medicines"
              label="Medicine Image (Optional - placeholder will be used if not uploaded)"
              required={false}
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
            disabled={loading || !formData.name || !formData.category}
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
            Are you sure you want to delete this medicine?
          </Typography>
          <Box className="mt-2 p-2 bg-gray-100 rounded">
            <Typography variant="body2">
              <strong>Name:</strong> {selectedMedicine?.name}
            </Typography>
            <Typography variant="body2">
              <strong>Category:</strong> {selectedMedicine?.category}
            </Typography>
          </Box>
          <Alert severity="warning" sx={{ mt: 2 }}>
            This will also delete the medicine image from storage. This action cannot be undone.
          </Alert>
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
