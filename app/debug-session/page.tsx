'use client';

import { useSession } from 'next-auth/react';
import { Box, Card, CardContent, Typography, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function DebugSessionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <Typography>Loading...</Typography>;
  }

  if (status === 'unauthenticated') {
    return (
      <Box sx={{ p: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Not Logged In
            </Typography>
            <Button variant="contained" onClick={() => router.push('/login')}>
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Session Debug Information
          </Typography>

          <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
            Session Status: {status}
          </Typography>

          <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
            User Data:
          </Typography>

          <pre style={{
            overflow: 'auto',
            backgroundColor: '#f5f5f5',
            padding: '16px',
            borderRadius: '4px',
            fontSize: '14px'
          }}>
            {JSON.stringify(session, null, 2)}
          </pre>

          <Box sx={{ mt: 3 }}>
            <Typography variant="body1">
              <strong>User ID:</strong> {session?.user?.id || 'NOT FOUND'}
            </Typography>
            <Typography variant="body1">
              <strong>User Email:</strong> {session?.user?.email || 'NOT FOUND'}
            </Typography>
            <Typography variant="body1">
              <strong>User Name:</strong> {session?.user?.name || 'NOT FOUND'}
            </Typography>
            <Typography variant="body1">
              <strong>User Role:</strong> {(session?.user as any)?.role || 'NOT FOUND'}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
