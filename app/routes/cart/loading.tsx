import { Box, Card, CardContent, Skeleton, Container } from '@mui/material';

export default function Loading() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Skeleton variant="text" width={150} height={40} sx={{ mb: 3 }} />

      <Card sx={{ mb: 3 }}>
        <CardContent>
          {[1, 2, 3].map((i) => (
            <Box key={i} sx={{ display: 'flex', gap: 2, mb: 3, pb: 3, borderBottom: i < 3 ? '1px solid #e0e0e0' : 'none' }}>
              <Skeleton variant="rectangular" width={80} height={80} />
              <Box sx={{ flex: 1 }}>
                <Skeleton variant="text" width="60%" height={30} />
                <Skeleton variant="text" width="40%" height={20} />
                <Skeleton variant="text" width="30%" height={20} />
              </Box>
              <Box>
                <Skeleton variant="text" width={80} height={30} />
              </Box>
            </Box>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="rectangular" height={48} sx={{ mt: 2 }} />
        </CardContent>
      </Card>
    </Container>
  );
}
