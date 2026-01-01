'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Alert, AlertTitle, Collapse } from '@mui/material';

export default function SuccessAlert() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);
  const success = searchParams.get('success');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    if (success === 'true') {
      setShow(true);
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => setShow(false), 10000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  if (!success) return null;

  return (
    <Collapse in={show}>
      <Alert
        severity="success"
        onClose={() => setShow(false)}
        sx={{ mb: 3 }}
      >
        <AlertTitle>Order Placed Successfully!</AlertTitle>
        Your order has been placed and inventory has been updated.
        {orderId && <> Order ID: <strong>{orderId}</strong></>}
      </Alert>
    </Collapse>
  );
}
