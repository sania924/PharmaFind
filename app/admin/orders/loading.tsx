import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';

export default function Loading() {
  return (
    <Box sx={{ p: 4 }}>
      <Skeleton variant="text" width={250} height={50} sx={{ mb: 4 }} />

      {/* Stats Cards Skeleton */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="50%" height={40} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Filters Skeleton */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Skeleton variant="rectangular" height={56} sx={{ flex: 1 }} />
            <Skeleton variant="rectangular" width={200} height={56} />
          </Box>
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <CardContent>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2, py: 2, borderBottom: '1px solid #e0e0e0' }}>
              <Skeleton variant="text" width="15%" />
              <Skeleton variant="text" width="15%" />
              <Skeleton variant="text" width="20%" />
              <Skeleton variant="text" width="10%" />
              <Skeleton variant="text" width="15%" />
              <Skeleton variant="text" width="10%" />
              <Skeleton variant="rectangular" width={120} height={32} />
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}
