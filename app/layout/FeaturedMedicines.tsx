'use client';

import { Box, Typography, Button } from '@mui/material';
import { MedicineCard } from '@/app/components/MedicineCard';
import { getMedicines } from '@/lib/data';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Medicine } from '@/lib/definitions';

export default function FeaturedMedicines() {
  const [featuredMedicines, setFeaturedMedicines] = useState<Medicine[]>([]);

  useEffect(() => {
    getMedicines().then(medicines => {
      setFeaturedMedicines(medicines.slice(0, 3));
    });
  }, []);

  return (
    <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
      <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 3 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h3" component="h2" gutterBottom>
            Featured Medicines
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Discover our most popular and effective medicines
          </Typography>
          <Button
            component={Link}
            href="/routes/medicines"
            variant="contained"
            size="large"
          >
            View All Medicines
          </Button>
        </Box>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 4
          }}
        >
          {featuredMedicines.map((medicine) => (
            <Box key={medicine.id}>
              <MedicineCard medicine={medicine} />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}