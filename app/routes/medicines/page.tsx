import { getMedicines } from '@/lib/data';
import { MedicineCard } from '@/app/components/MedicineCard';
import { TextField, FormControl, InputLabel, Select, MenuItem, Button, Card, Typography, Box } from '@mui/material';
import { Search } from '@mui/icons-material';

export default async function MedicinesPage({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    category?: string;
  };
}) {
  const params = await searchParams;
  const query = params?.query || '';
  const category = params?.category || 'all';

  let medicines = await getMedicines();

  const categories = ['all', ...Array.from(new Set(medicines.map((m) => m.category)))];

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