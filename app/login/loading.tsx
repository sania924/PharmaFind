import { Box, Card, CardContent, Skeleton, Container } from '@mui/material';

export default function Loading() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Card>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Skeleton variant="text" width={200} height={50} sx={{ mx: 'auto' }} />
              <Skeleton variant="text" width={300} height={25} sx={{ mx: 'auto', mt: 1 }} />
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <Skeleton variant="rectangular" height={56} />
              <Skeleton variant="rectangular" height={56} />
              <Skeleton variant="rectangular" height={48} />
            </Box>

            <Box sx={{ mt: 3, textAlign: 'center' }}>
              <Skeleton variant="text" width={250} height={25} sx={{ mx: 'auto' }} />
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
