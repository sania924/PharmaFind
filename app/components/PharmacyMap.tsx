'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Box, Typography, Button, Chip, Divider, IconButton } from '@mui/material';
import { Add, Remove, ShoppingCart, LocationOn } from '@mui/icons-material';
import { Pharmacy, InventoryItem, Medicine } from '@/lib/definitions';
import { useCart } from '@/context/cart-context';

// Fix for default marker icons in react-leaflet - use custom icon to avoid CDN blocking
const customIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
      <path fill="#2563eb" stroke="#fff" stroke-width="2" d="M12.5 0C5.6 0 0 5.6 0 12.5c0 9.4 12.5 28.5 12.5 28.5S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0z"/>
      <circle cx="12.5" cy="12.5" r="6" fill="#fff"/>
    </svg>
  `),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" width="41" height="41" viewBox="0 0 41 41">
      <ellipse cx="20.5" cy="37" rx="18" ry="4" fill="rgba(0,0,0,0.2)"/>
    </svg>
  `),
  shadowSize: [41, 41],
  shadowAnchor: [12, 41]
});

interface PharmacyMapProps {
  pharmacies: Pharmacy[];
  inventory: InventoryItem[];
  medicines: Medicine[];
}

interface InventoryWithMedicine extends InventoryItem {
  medicine: Medicine;
}

export default function PharmacyMap({ pharmacies, inventory, medicines }: PharmacyMapProps) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
  const { addToCart } = useCart();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    console.log('PharmacyMap received:', {
      pharmacies: pharmacies.length,
      inventory: inventory.length,
      medicines: medicines.length,
    });
  }, [pharmacies, inventory, medicines]);

  // Calculate center point of all pharmacies
  const centerLat = pharmacies.length > 0
    ? pharmacies.reduce((sum, p) => sum + p.lat, 0) / pharmacies.length
    : 34.052235; // Default to LA coordinates
  const centerLng = pharmacies.length > 0
    ? pharmacies.reduce((sum, p) => sum + p.lng, 0) / pharmacies.length
    : -118.243683;

  const getInventoryForPharmacy = (pharmacyId: string): InventoryWithMedicine[] => {
    return inventory
      .filter((item) => item.pharmacyId === pharmacyId && item.stock > 0)
      .map((item) => ({
        ...item,
        medicine: medicines.find((m) => m.id === item.medicineId)!,
      }))
      .filter((item) => item.medicine);
  };

  const handleQuantityChange = (itemKey: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[itemKey] || 1;
      const newQuantity = Math.max(1, current + delta);
      return { ...prev, [itemKey]: newQuantity };
    });
  };

  const handleAddToCart = (pharmacyId: string, medicineId: string) => {
    const itemKey = `${pharmacyId}-${medicineId}`;
    const quantity = quantities[itemKey] || 1;

    addToCart({
      medicineId,
      pharmacyId,
      quantity,
    });

    // Reset quantity after adding
    setQuantities((prev) => ({ ...prev, [itemKey]: 1 }));

    // Show success feedback
    alert(`Added ${quantity} item(s) to cart!`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
    }).format(amount);
  };

  // Only render map on client side
  if (!isMounted) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '600px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'grey.100',
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Loading map...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', height: '600px', borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {pharmacies.map((pharmacy) => {
          const pharmacyInventory = getInventoryForPharmacy(pharmacy.id);

          return (
            <Marker key={pharmacy.id} position={[pharmacy.lat, pharmacy.lng]} icon={customIcon}>
              <Popup maxWidth={350} minWidth={300}>
                <Box sx={{ p: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <LocationOn sx={{ color: 'primary.main', mr: 1 }} />
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                      {pharmacy.name}
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {pharmacy.address}, {pharmacy.city}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    📞 {pharmacy.contact}
                  </Typography>

                  <Divider sx={{ my: 2 }} />

                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Available Medicines ({pharmacyInventory.length})
                  </Typography>

                  {pharmacyInventory.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No medicines in stock
                    </Typography>
                  ) : (
                    <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                      {pharmacyInventory.map((item) => {
                        const itemKey = `${pharmacy.id}-${item.medicineId}`;
                        const quantity = quantities[itemKey] || 1;

                        return (
                          <Box
                            key={item.medicineId}
                            sx={{
                              mb: 2,
                              p: 1.5,
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 1,
                              bgcolor: 'background.paper',
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', flex: 1 }}>
                                {item.medicine.name}
                              </Typography>
                              <Chip
                                label={`Stock: ${item.stock}`}
                                size="small"
                                color={item.stock > 10 ? 'success' : 'error'}
                                sx={{ ml: 1 }}
                              />
                            </Box>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1, fontSize: '0.75rem' }}>
                              {item.medicine.category}
                            </Typography>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                                {formatCurrency(item.price)}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                Expires: {new Date(item.expiryDate).toLocaleDateString()}
                              </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <IconButton
                                  size="small"
                                  onClick={() => handleQuantityChange(itemKey, -1)}
                                  disabled={quantity <= 1}
                                  sx={{ bgcolor: 'grey.100' }}
                                >
                                  <Remove fontSize="small" />
                                </IconButton>
                                <Typography variant="body2" sx={{ minWidth: '30px', textAlign: 'center', fontWeight: 'bold' }}>
                                  {quantity}
                                </Typography>
                                <IconButton
                                  size="small"
                                  onClick={() => handleQuantityChange(itemKey, 1)}
                                  disabled={quantity >= item.stock}
                                  sx={{ bgcolor: 'grey.100' }}
                                >
                                  <Add fontSize="small" />
                                </IconButton>
                              </Box>

                              <Button
                                variant="contained"
                                size="small"
                                startIcon={<ShoppingCart />}
                                onClick={() => handleAddToCart(pharmacy.id, item.medicineId)}
                                disabled={item.stock === 0}
                              >
                                Add to Cart
                              </Button>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </Box>
  );
}
