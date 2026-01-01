'use client';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { CartProvider } from '@/context/cart-context';
import { SessionProvider } from 'next-auth/react';
import { NavigationProgress } from './NavigationProgress';
import { Suspense } from 'react';

const theme = createTheme();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Suspense fallback={null}>
          <NavigationProgress />
        </Suspense>
        <CartProvider>
          {children}
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}