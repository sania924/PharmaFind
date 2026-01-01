import { Box, Card, CardContent, Skeleton, Typography } from '@mui/material';

export default function Loading() {
  return (
    <Box sx={{ p: 6 }}>
      <Skeleton variant="text" width={250} height={50} sx={{ mb: 4 }} />

      {/* Stats Cards Skeleton */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="80%" height={40} sx={{ my: 1 }} />
              <Skeleton variant="text" width="50%" height={16} />
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Charts Skeleton */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 3, mb: 3 }}>
        <Card>
          <CardContent>
            <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={300} />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
            <Skeleton variant="rectangular" height={300} />
          </CardContent>
        </Card>
      </Box>

      <Card>
        <CardContent>
          <Skeleton variant="text" width={200} height={30} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={300} />
        </CardContent>
      </Card>
    </Box>
  );
}
