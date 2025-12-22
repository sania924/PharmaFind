'use client';

import { Card, CardContent, CardActions, Button, Typography, Chip, Box } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import Link from 'next/link';
import Image from 'next/image';
import type { Medicine } from '@/lib/definitions';

interface MedicineCardProps {
  medicine: Medicine;
}

export function MedicineCard({ medicine }: MedicineCardProps) {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ position: 'relative', height: 200, width: '100%' }}>
        <Image
          src={medicine.imageUrl}
          alt={medicine.name}
          fill
          style={{ objectFit: 'cover' }}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Box>
      <CardContent sx={{ flexGrow: 1 }}>
        <Chip label={medicine.category} color="primary" size="small" sx={{ mb: 1 }} />
        <Typography variant="h6" component="h2" gutterBottom>
          {medicine.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {medicine.description}
        </Typography>
      </CardContent>
      <CardActions>
        <Button
          component={Link}
          href={`/routes/medicines/${medicine.id}`}
          variant="outlined"
          endIcon={<ArrowForward />}
          fullWidth
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
}