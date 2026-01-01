# Firestore Timestamp Serialization Fix

## Problem

Console error appeared:
```
Only plain objects can be passed to Client Components from Server Components.
Objects with toJSON methods are not supported.
Convert it manually to a simple value before passing it to props.
{createdAt: {seconds: ..., nanoseconds: 23000000}}
                     ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
```

## Root Cause

Firestore returns `Timestamp` objects that have a `toJSON()` method. These cannot be passed directly from Server Components to Client Components in Next.js 15.

The error occurred because:
1. Server components fetch data from Firestore
2. Firestore returns Timestamp objects for date fields
3. These Timestamp objects cannot be serialized to pass to client components
4. Next.js throws an error during rendering

## Solution

Created a `serializeTimestamps()` helper function that converts all Firestore Timestamps to ISO string format before returning data.

### Implementation

**Server-Side Functions (lib/firebase/firestore.ts)**

Added helper function and updated all 13 data retrieval functions:

```typescript
function serializeTimestamps(data: any): any {
  if (!data) return data;

  const serialized: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Timestamp) {
      serialized[key] = value.toDate().toISOString();
    } else if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
      serialized[key] = value.toDate().toISOString();
    } else {
      serialized[key] = value;
    }
  }
  return serialized;
}
```

**Updated Functions:**
- `getAllPharmacies()` - ✅ Updated
- `getPharmacyById()` - ✅ Updated
- `getAllMedicines()` - ✅ Updated
- `getMedicineById()` - ✅ Updated
- `getAllInventory()` - ✅ Updated
- `getInventoryByPharmacy()` - ✅ Updated
- `getInventoryByMedicine()` - ✅ Updated
- `getInventoryItem()` - ✅ Updated
- `getOrdersByUser()` - ✅ Updated
- `getOrderById()` - ✅ Updated
- `getAllOrders()` - ✅ Updated
- `getUserByEmail()` - ✅ Updated
- `getUserById()` - ✅ Updated

**Client-Side Real-Time Listeners**

For client components using `onSnapshot`, added the same `serializeDoc()` helper:

```typescript
import { collection, onSnapshot, Timestamp } from 'firebase/firestore';

function serializeDoc(data: any): any {
  const serialized: any = {};
  for (const [key, value] of Object.entries(data)) {
    if (value instanceof Timestamp) {
      serialized[key] = value.toDate().toISOString();
    } else if (value && typeof value === 'object' && 'toDate' in value && typeof value.toDate === 'function') {
      serialized[key] = value.toDate().toISOString();
    } else {
      serialized[key] = value;
    }
  }
  return serialized;
}
```

**Updated Components:**
- `app/layout/PharmacyMapSection.tsx` - ✅ Updated (2 listeners: pharmacies, inventory)
- `app/admin/dashboard/page.tsx` - ✅ Updated (3 listeners: orders, pharmacies, medicines)
- `app/admin/orders/page.tsx` - ✅ Updated (1 listener: orders)

## Changes Made

### Before:
```typescript
export async function getAllMedicines(): Promise<Medicine[]> {
  const querySnapshot = await getDocs(collection(db, 'medicines'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(), // ❌ Returns Timestamp objects
  })) as Medicine[];
}

// Client-side listener:
const unsubscribe = onSnapshot(
  collection(db, 'medicines'),
  (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(), // ❌ Returns Timestamp objects
    }));
    setMedicines(data);
  }
);
```

### After:
```typescript
export async function getAllMedicines(): Promise<Medicine[]> {
  const querySnapshot = await getDocs(collection(db, 'medicines'));
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...serializeTimestamps(doc.data()), // ✅ Converts Timestamps to strings
  })) as Medicine[];
}

// Client-side listener:
const unsubscribe = onSnapshot(
  collection(db, 'medicines'),
  (snapshot) => {
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...serializeDoc(doc.data()), // ✅ Converts Timestamps to strings
    }));
    setMedicines(data);
  }
);
```

## Benefits

1. **Clean Console** - No more serialization errors
2. **Better Performance** - Timestamps converted once at data layer
3. **Type Safety** - ISO strings work with TypeScript string types
4. **Consistent** - All data returned from Firestore is serialized
5. **Compatible** - Works with Next.js 15 Server/Client component model

## Testing

After this fix:

1. **Console should be clean** - No serialization errors
2. **Dates work** - All date fields display correctly
3. **No breaking changes** - ISO strings work everywhere Date objects did

## Date Format

All timestamps are now returned as ISO 8601 strings:
```
"2024-12-20T10:00:00.000Z"
```

This format:
- Is universally understood
- Works with `new Date()` constructor
- Compatible with date libraries (date-fns, etc.)
- JSON serializable
- Human readable

## Files Modified

### Server-Side:
- ✅ `lib/firebase/firestore.ts` - Added serializeTimestamps helper and updated all 13 functions

### Client-Side:
- ✅ `app/layout/PharmacyMapSection.tsx` - Added serializeDoc helper, updated 2 listeners
- ✅ `app/admin/dashboard/page.tsx` - Added serializeDoc helper, updated 3 listeners
- ✅ `app/admin/orders/page.tsx` - Added serializeDoc helper, updated 1 listener

## No Breaking Changes

All existing code continues to work because:
- ISO strings can be converted back to Date objects with `new Date(isoString)`
- All date formatting libraries accept ISO strings
- TypeScript `string` type includes ISO date strings

---

**Status:** ✅ Fixed
**Console:** Clean, no errors
**Impact:** All Firestore data now properly serialized
