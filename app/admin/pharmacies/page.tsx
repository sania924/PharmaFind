"use client";

import { useEffect, useState } from "react";
import { getPharmacies } from "@/lib/data";
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
} from "@mui/material";
import { PlusCircle, MoreHorizontal } from "lucide-react";

interface Pharmacy {
  id: string;
  name: string;
  address: string;
  city: string;
  lat: number;
  lng: number;
  contact: string;
}

export default function AdminPharmaciesPage() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);

  useEffect(() => {
    const fetchPharmacies = async () => {
      const data = await getPharmacies();
      setPharmacies(data);
    };

    fetchPharmacies();
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, pharmacyId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedPharmacy(pharmacyId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPharmacy(null);
  };

  const handleEdit = () => {
    console.log("Edit pharmacy:", selectedPharmacy);
    handleMenuClose();
  };

  const handleDelete = () => {
    console.log("Delete pharmacy:", selectedPharmacy);
    handleMenuClose();
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
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, pharmacy.id)}
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
