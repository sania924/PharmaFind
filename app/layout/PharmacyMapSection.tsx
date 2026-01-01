'use client';

import { Box, Container, Typography } from '@mui/material';
import { getMedicines } from '@/lib/data';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Pharmacy, InventoryItem, Medicine } from '@/lib/definitions';
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

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

// Dynamically import the map component to avoid SSR issues
const PharmacyMap = dynamic(() => import('../components/PharmacyMap'), {
  ssr: false,
  loading: () => (
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
  ),
});

export default function PharmacyMapSection() {
  const [pharmacies, setPharmacies] = useState<Pharmacy[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch medicines once (they don't change often)
    async function fetchMedicines() {
      const medicinesData = await getMedicines();
      setMedicines(medicinesData);
    }
    fetchMedicines();

    // Real-time listener for pharmacies
    const unsubscribePharmacies = onSnapshot(
      collection(db, 'pharmacies'),
      (snapshot) => {
        const pharmaciesData: Pharmacy[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...serializeDoc(doc.data()),
        } as Pharmacy));
        console.log('Pharmacies loaded:', pharmaciesData.length, pharmaciesData);
        setPharmacies(pharmaciesData);
        setLoading(false);
      },
      (error) => {
        console.error('Error listening to pharmacies:', error);
        setLoading(false);
      }
    );

    // Real-time listener for inventory
    const unsubscribeInventory = onSnapshot(
      collection(db, 'inventory'),
      (snapshot) => {
        const inventoryData: InventoryItem[] = snapshot.docs.map(doc => ({
          ...serializeDoc(doc.data()),
        } as InventoryItem));
        console.log('Inventory loaded:', inventoryData.length, 'items');
        setInventory(inventoryData);
      },
      (error) => {
        console.error('Error listening to inventory:', error);
      }
    );

    // Cleanup listeners on unmount
    return () => {
      unsubscribePharmacies();
      unsubscribeInventory();
    };
  }, []);

  if (loading) {
    return (
      <Box
        id="pharmacy-map"
        sx={{
          py: 8,
          bgcolor: 'background.default',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography
              variant="h3"
              component="h2"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Find Pharmacies Near You
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Loading pharmacy data...
            </Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      id="pharmacy-map"
      sx={{
        py: 8,
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h3"
            component="h2"
            sx={{
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Find Pharmacies Near You
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Interactive map showing all available pharmacies
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Click on any marker to view available medicines and add directly to your cart
          </Typography>
        </Box>

        <PharmacyMap pharmacies={pharmacies} inventory={inventory} medicines={medicines} />

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            📍 {pharmacies.length} pharmacies available in Metropolis
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
