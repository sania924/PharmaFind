'use client';

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { CartProvider } from '@/context/cart-context';

const theme = createTheme();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <CartProvider>
        {children}
      </CartProvider>
    </ThemeProvider>
  );
}