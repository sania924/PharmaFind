
import { getOrdersForUser } from "@/lib/data";
import { format } from "date-fns";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  CardContent,
  Typography,
  Chip,
  Divider,
  Box,
} from "@mui/material";
import { ExpandMore, ShoppingCart } from "@mui/icons-material";

export default async function OrdersPage() {
  const orders = await getOrdersForUser("u1"); // Assuming a single user for demo

  if (orders.length === 0) {
    return (
      <Box className="container mx-auto px-4 md:px-6 py-12 text-center">
        <ShoppingCart sx={{ fontSize: 64, color: 'text.secondary', mx: 'auto', mb: 2 }} />
        <Typography variant="h3" component="h1" className="font-bold mb-2">
          No Orders Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You haven't placed any orders yet.
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="container mx-auto px-4 md:px-6 py-8">
      <Typography variant="h3" component="h1" className="font-bold mb-6">
        My Orders
      </Typography>
      <Card className="shadow-md">
        <CardContent className="p-0">
          {orders.map((order, index) => (
            <Accordion key={order.id} className="border-b last:border-b-0">
              <AccordionSummary
                expandIcon={<ExpandMore />}
                className="px-6 py-4 hover:bg-gray-50"
              >
                <Box className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full pr-4">
                  <Box className="mb-2 sm:mb-0">
                    <Typography variant="h6" component="p" className="font-semibold">
                      Order #{order.id}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      From: {order.pharmacyName}
                    </Typography>
                  </Box>
                  <Box className="flex flex-col items-start sm:items-end gap-1">
                    <Chip
                      label={order.status}
                      color={order.status === 'Completed' ? 'success' : 'default'}
                      size="small"
                      variant={order.status === 'Completed' ? 'filled' : 'outlined'}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(order.createdAt), "MMMM d, yyyy")}
                    </Typography>
                  </Box>
                </Box>
              </AccordionSummary>
              <AccordionDetails className="px-6 pb-4">
                <Box className="space-y-2">
                  {order.items.map((item) => (
                    <Box key={item.medicineId} className="flex justify-between items-center">
                      <Typography variant="body2">
                        {item.medicineName}{" "}
                        <Typography component="span" variant="body2" color="text.secondary">
                          x{item.quantity}
                        </Typography>
                      </Typography>
                      <Typography variant="body2">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Box>
                  ))}
                  <Divider className="my-2" />
                  <Box className="flex justify-between font-bold">
                    <Typography variant="body1">Total</Typography>
                    <Typography variant="body1">${order.total.toFixed(2)}</Typography>
                  </Box>
                </Box>
              </AccordionDetails>
            </Accordion>
          ))}
        </CardContent>
      </Card>
    </Box>
  );
}