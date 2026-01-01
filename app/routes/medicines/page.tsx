import { getMedicines } from '@/lib/data';
import { MedicineCard } from '@/app/components/MedicineCard';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Card, Typography, Box } from '@mui/material';
import { Search } from '@mui/icons-material';
import { getAllPharmacies } from '@/lib/firebase/firestore';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export default async function MedicinesPage({
  searchParams,
}: {
  searchParams?: Promise<{
    query?: string;
    category?: string;
    pharmacy?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params?.query || '';
  const category = params?.category || 'all';
  const pharmacyFilter = params?.pharmacy || 'all';

  let medicines = await getMedicines();
  const pharmacies = await getAllPharmacies();

  const categories = ['all', ...Array.from(new Set(medicines.map((m) => m.category)))];

  // If pharmacy filter is selected, only show medicines available at that pharmacy
  if (pharmacyFilter && pharmacyFilter !== 'all') {
    const inventorySnapshot = await getDocs(collection(db, 'inventory'));
    const inventoryAtPharmacy = inventorySnapshot.docs
      .filter((doc) => doc.data().pharmacyId === pharmacyFilter && doc.data().stock > 0)
      .map((doc) => doc.data().medicineId);

    medicines = medicines.filter((m) => inventoryAtPharmacy.includes(m.id));
  }

  if (query) {
    medicines = medicines.filter((m) =>
      m.name.toLowerCase().includes(query.toLowerCase())
    );
  }

  if (category && category !== 'all') {
    medicines = medicines.filter((m) => m.category === category);
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', px: { xs: 2, md: 3 }, py: 4 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '300px 1fr' },
          gap: 4
        }}
      >
        <Box>
          <Card sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Filters
            </Typography>
            <form method="GET" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <TextField
                name="query"
                placeholder="Search medicines..."
                defaultValue={query}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select name="category" defaultValue={category} label="Category">
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat === 'all' ? 'All Categories' : cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Pharmacy Location</InputLabel>
                <Select name="pharmacy" defaultValue={pharmacyFilter} label="Pharmacy Location">
                  <MenuItem value="all">All Pharmacies</MenuItem>
                  {pharmacies.map((pharmacy) => (
                    <MenuItem key={pharmacy.id} value={pharmacy.id}>
                      {pharmacy.name} - {pharmacy.city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button type="submit" variant="contained" fullWidth>
                Apply Filters
              </Button>
            </form>
          </Card>
        </Box>

        <Box>
          <Typography variant="h3" component="h1" gutterBottom>
            {category === 'all' ? 'All Medicines' : category}
          </Typography>
          {(query || pharmacyFilter !== 'all') && (
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {medicines.length} result{medicines.length !== 1 ? 's' : ''} found
              {query && ` for "${query}"`}
              {pharmacyFilter !== 'all' && ` at ${pharmacies.find(p => p.id === pharmacyFilter)?.name}`}
            </Typography>
          )}
          {medicines.length > 0 ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  lg: 'repeat(3, 1fr)'
                },
                gap: 3
              }}
            >
              {medicines.map((medicine) => (
                <Box key={medicine.id}>
                  <MedicineCard medicine={medicine} />
                </Box>
              ))}
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h4" component="h2" gutterBottom>
                No Medicines Found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your search or filter criteria.
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}