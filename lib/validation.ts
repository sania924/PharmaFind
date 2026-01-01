import { z } from 'zod';

// Pharmacy validation schema
export const pharmacySchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name is too long'),
  address: z.string().min(5, 'Address must be at least 5 characters').max(200, 'Address is too long'),
  city: z.string().min(2, 'City must be at least 2 characters').max(50, 'City is too long'),
  lat: z.number().min(-90, 'Invalid latitude').max(90, 'Invalid latitude'),
  lng: z.number().min(-180, 'Invalid longitude').max(180, 'Invalid longitude'),
  contact: z.string().min(7, 'Contact number is too short').max(20, 'Contact number is too long'),
});

// Medicine validation schema
export const medicineSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100, 'Name is too long'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description is too long'),
  category: z.string().min(2, 'Category is required').max(50, 'Category is too long'),
  dosage: z.string().min(2, 'Dosage is required').max(100, 'Dosage is too long'),
  usage: z.string().min(10, 'Usage instructions required').max(500, 'Usage is too long'),
  sideEffects: z.string().min(5, 'Side effects information required').max(500, 'Side effects text is too long'),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  imageHint: z.string().max(200, 'Image hint is too long').optional().or(z.literal('')),
});

// Inventory validation schema
export const inventorySchema = z.object({
  pharmacyId: z.string().min(1, 'Pharmacy ID is required'),
  medicineId: z.string().min(1, 'Medicine ID is required'),
  stock: z.number().int().min(0, 'Stock cannot be negative').max(100000, 'Stock value is too high'),
  price: z.number().min(0.01, 'Price must be greater than 0').max(10000, 'Price is too high'),
  expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
});

// Order validation schema
export const orderItemSchema = z.object({
  medicineId: z.string().min(1, 'Medicine ID is required'),
  pharmacyId: z.string().min(1, 'Pharmacy ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(100, 'Quantity too high'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
});

export const orderSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  items: z.array(orderItemSchema).min(1, 'Order must have at least one item'),
  totalAmount: z.number().min(0.01, 'Total amount must be greater than 0'),
});

// User validation schema
export const userSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters').max(100, 'Password is too long'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name is too long'),
  role: z.enum(['user', 'admin']),
});

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Search/Filter validation
export const searchParamsSchema = z.object({
  query: z.string().max(100, 'Search query is too long').optional(),
  category: z.string().max(50, 'Category is too long').optional(),
  pharmacy: z.string().optional(),
});

// Order status validation
export const orderStatusSchema = z.enum(['Pending', 'Completed', 'Cancelled']);

// Cart item validation
export const cartItemSchema = z.object({
  medicineId: z.string().min(1, 'Medicine ID is required'),
  pharmacyId: z.string().min(1, 'Pharmacy ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(100, 'Quantity too high'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
});

// Environment variables validation
export const envSchema = z.object({
  NEXT_PUBLIC_FIREBASE_API_KEY: z.string().min(1, 'Firebase API key is required'),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z.string().min(1, 'Firebase auth domain is required'),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z.string().min(1, 'Firebase project ID is required'),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z.string().min(1, 'Firebase storage bucket is required'),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1, 'Firebase messaging sender ID is required'),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, 'Firebase app ID is required'),
});

// Type exports
export type PharmacyInput = z.infer<typeof pharmacySchema>;
export type MedicineInput = z.infer<typeof medicineSchema>;
export type InventoryInput = z.infer<typeof inventorySchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CartItemInput = z.infer<typeof cartItemSchema>;

// Validation helper function
export function validateData<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  try {
    const validated = schema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return { success: false, error: firstError.message };
    }
    return { success: false, error: 'Validation failed' };
  }
}
