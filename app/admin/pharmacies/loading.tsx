import { Box, Card, CardContent, Skeleton } from '@mui/material';

export default function Loading() {
  return (
    <Box sx={{ p: 4 }}>
      <Skeleton variant="text" width={250} height={50} sx={{ mb: 4 }} />

      {/* Add Button Skeleton */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
        <Skeleton variant="rectangular" width={180} height={42} />
      </Box>

      {/* Table Skeleton */}
      <Card>
        <CardContent>
          {[1, 2, 3, 4, 5].map((i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2, py: 2, borderBottom: '1px solid #e0e0e0' }}>
              <Skeleton variant="text" width="20%" />
              <Skeleton variant="text" width="25%" />
              <Skeleton variant="text" width="15%" />
              <Skeleton variant="text" width="20%" />
              <Skeleton variant="rectangular" width={120} height={32} />
            </Box>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}
