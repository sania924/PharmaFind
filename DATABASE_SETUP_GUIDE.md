# 🗄️ PharmFind Database Setup Guide

Your map is empty because the Firestore database hasn't been populated with data yet. Follow these steps to seed your database with pharmacies, medicines, and inventory.

## 📋 Prerequisites

You need a Firebase service account key to run the seeding script.

## Step 1: Get Firebase Service Account Key

1. **Go to Firebase Console**: https://console.firebase.google.com
2. **Select your project** (PharmFind)
3. **Click the gear icon** (Settings) → **Project Settings**
4. **Go to the "Service Accounts" tab**
5. **Click "Generate New Private Key"**
6. **Download the JSON file**
7. **Rename it to `serviceAccountKey.json`**
8. **Move it to your project root** (`f:\pharmafind\serviceAccountKey.json`)

⚠️ **IMPORTANT**: This file contains sensitive credentials. Never commit it to git!

The file should already be in `.gitignore`:
```
serviceAccountKey.json
```

## Step 2: Install tsx (TypeScript Execution Tool)

You need to **stop the dev server first** to avoid file lock issues:

1. **Stop the Next.js dev server** (Press `Ctrl+C` in the terminal running `npm run dev`)
2. **Install tsx**:
   ```bash
   npm install -D tsx
   ```
3. **Restart the dev server** (optional, for now):
   ```bash
   npm run dev
   ```

## Step 3: Run the Seed Script

Execute the seeding script to populate your database:

```bash
npm run seed
```

You should see output like:
```
🌱 Starting database seeding...

📍 Seeding pharmacies...
  ✓ Added: Downtown Health Pharmacy
  ✓ Added: Uptown Wellness Center
  ✓ Added: Riverside Meds
✅ Successfully seeded 3 pharmacies

💊 Seeding medicines...
  ✓ Added: Ibuprofen 200mg
  ✓ Added: Cetirizine 10mg
  ✓ Added: Vitamin D3 1000IU
  ✓ Added: Cold & Flu Relief
  ✓ Added: Antacid Tablets
  ✓ Added: Paracetamol 500mg
  ✓ Added: Omega-3 Fish Oil
  ✓ Added: Cough Syrup
✅ Successfully seeded 8 medicines

📦 Seeding inventory...
  ✓ Added: Ibuprofen 200mg at Downtown Health Pharmacy (Stock: 50)
  ✓ Added: Cetirizine 10mg at Downtown Health Pharmacy (Stock: 30)
  ... (more items)
✅ Successfully seeded 15 inventory items

🎉 Database seeding completed successfully!
```

## Step 4: Verify in Firebase Console

1. Go to Firebase Console → Firestore Database
2. You should now see three collections:
   - **pharmacies** (3 documents)
   - **medicines** (8 documents)
   - **inventory** (15 documents)

## Step 5: Refresh Your Application

1. Refresh your browser at http://localhost:3000
2. The map should now show **3 pharmacy markers**
3. Click on any marker to see available medicines
4. You should see the message "3 pharmacies available in Metropolis"

## 🎯 What Data Gets Seeded

### Pharmacies (3)
1. **Downtown Health Pharmacy** - 123 Main St, Metropolis
2. **Uptown Wellness Center** - 456 Oak Ave, Metropolis
3. **Riverside Meds** - 789 Pine Ln, Metropolis

### Medicines (8)
1. Ibuprofen 200mg (Pain Relief)
2. Cetirizine 10mg (Allergy)
3. Vitamin D3 1000IU (Vitamins & Supplements)
4. Cold & Flu Relief (Cold & Flu)
5. Antacid Tablets (Digestive Health)
6. Paracetamol 500mg (Pain Relief)
7. Omega-3 Fish Oil (Vitamins & Supplements)
8. Cough Syrup (Cold & Flu)

### Inventory (15 items)
Each pharmacy has 4-5 medicines in stock with varying quantities and prices.

## 🔧 Troubleshooting

### Error: "serviceAccountKey.json not found"
- Make sure you downloaded the service account key from Firebase
- Rename it to exactly `serviceAccountKey.json`
- Place it in the project root (`f:\pharmafind\`)

### Error: "EBUSY" or file lock issues
- Stop the dev server before installing tsx
- Close any file editors that might have files open
- Try running the command again

### Map still shows "0 pharmacies"
- Check Firestore Console to verify data was added
- Clear browser cache and refresh
- Check browser console for any errors
- Verify Firebase config is correct in `lib/firebase/config.ts`

### Permission Errors
- Make sure your Firestore security rules allow write access
- For development, you can use:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /{document=**} {
        allow read, write: if true;
      }
    }
  }
  ```

## 🔄 Re-seeding the Database

If you need to reset the database:

1. **Clear existing data** in Firebase Console (delete collections manually)
2. **Run the seed script again**:
   ```bash
   npm run seed
   ```

The script will recreate all the data.

## 📝 Next Steps

After seeding the database:

1. ✅ Map will show 3 pharmacy markers
2. ✅ Click markers to see available medicines
3. ✅ Add medicines to cart
4. ✅ Test the checkout process
5. ✅ Try the search and filter features on the Medicines page
6. ✅ Admin can add/edit pharmacies and inventory

## 🎉 Success!

Once you see pharmacy markers on the map, your database is successfully set up and you can start using all features of PharmFind!
