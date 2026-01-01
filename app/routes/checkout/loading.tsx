import { Box, Card, CardContent, Skeleton, Container } from '@mui/material';

export default function Loading() {
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Box sx={{ mb: 4 }}>
        <Skeleton variant="text" width={150} height={50} />
        <Skeleton variant="text" width={300} height={25} />
      </Box>

      {/* Order Summary Skeleton */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Skeleton variant="text" width={180} height={35} sx={{ mb: 2 }} />

          {[1, 2].map((i) => (
            <Box key={i} sx={{ mb: 2, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Skeleton variant="text" width="40%" height={25} />
                <Skeleton variant="text" width={80} height={25} />
              </Box>
              <Skeleton variant="text" width="30%" height={20} />
            </Box>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3, pt: 2, borderTop: '2px solid #e0e0e0' }}>
            <Skeleton variant="text" width={100} height={35} />
            <Skeleton variant="text" width={120} height={40} />
          </Box>
        </CardContent>
      </Card>

      {/* Customer Info Skeleton */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Skeleton variant="text" width={200} height={35} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="60%" height={25} />
          <Skeleton variant="text" width="50%" height={25} />
        </CardContent>
      </Card>

      {/* Buttons Skeleton */}
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Skeleton variant="rectangular" width={120} height={48} />
        <Skeleton variant="rectangular" width={150} height={48} />
      </Box>
    </Container>
  );
}
