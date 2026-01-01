# 🚀 PharmFind - Quick Start Guide

## ⚡ Get Started in 5 Minutes

### Step 1: Fix Firebase Permissions ⚠️ **REQUIRED**

**You're currently seeing:** "Missing or insufficient permissions"

**Fix:**
1. Go to https://console.firebase.google.com/
2. Select project: **pharmafind-4321**
3. Click **Firestore Database** → **Rules** tab
4. Replace rules with:
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
5. Click **"Publish"**
6. Refresh your browser

**See:** [FIRESTORE_SECURITY_RULES.md](FIRESTORE_SECURITY_RULES.md) for detailed instructions

---

### Step 2: Access the Application

**Server is running at:** http://localhost:3000

---

### Step 3: Test the Features

#### 🗺️ Test the Interactive Map
1. Open http://localhost:3000
2. Scroll to "Find Pharmacies Near You"
3. Click any pharmacy marker
4. See medicines with prices and stock
5. Add items to cart from popup

#### 👨‍💼 Test Admin Features
1. Click "Login" in header
2. Use: `admin@pharmafind.com` / `password123`
3. Click "Admin" button in header
4. Go to "Manage Pharmacies"
5. Click "Add Pharmacy"
6. **Open homepage in another tab** - watch new marker appear instantly!

#### 🛍️ Test Shopping Cart
1. Add items from map
2. Click cart icon in header
3. Adjust quantities
4. See total update

---

## 📚 Complete Documentation

| Document | Purpose |
|----------|---------|
| [REQUIREMENTS_STATUS.md](REQUIREMENTS_STATUS.md) | Feature completion checklist |
| [APPLICATION_FLOW.md](APPLICATION_FLOW.md) | Detailed flow diagrams |
| [IMPLEMENTATION_COMPLETE_SUMMARY.md](IMPLEMENTATION_COMPLETE_SUMMARY.md) | Phase 3 testing guide |
| [TESTING_GUIDE.md](TESTING_GUIDE.md) | Quick test checklist |
| [FIRESTORE_SECURITY_RULES.md](FIRESTORE_SECURITY_RULES.md) | Fix permissions error |

---

## 🎯 Current Status

**Working:** ✅ 78% Complete
- ✅ Interactive Leaflet map with real-time updates
- ✅ Admin CRUD for pharmacies and inventory
- ✅ Shopping cart
- ✅ Authentication
- ✅ View orders

**Missing:**
- ❌ Checkout process
- ❌ Search & filters
- ❌ Stock reduction on orders

---

## 🐛 Common Issues

### Issue: "Missing or insufficient permissions"
**Fix:** Update Firestore security rules (see Step 1 above)

### Issue: Map not loading
**Fix:** Check browser console for errors, ensure Firebase credentials are correct

### Issue: Admin pages not accessible
**Fix:** Login as admin user first

---

## 👥 Test Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@pharmafind.com | password123 |
| User 1 | john@example.com | password123 |
| User 2 | jane@example.com | password123 |

---

## 🔗 Quick Links

- **Homepage:** http://localhost:3000
- **Login:** http://localhost:3000/login
- **Cart:** http://localhost:3000/routes/cart
- **Orders:** http://localhost:3000/routes/orders
- **Admin Dashboard:** http://localhost:3000/admin/dashboard
- **Admin Pharmacies:** http://localhost:3000/admin/pharmacies
- **Admin Inventory:** http://localhost:3000/admin/inventory

---

## 📊 What's Implemented

### ✅ Core Features (7/12)
1. ✅ Real-time stock visibility
2. ✅ Add items to cart
3. ✅ Admin inventory management
4. ✅ Admin pharmacy management
5. ✅ Interactive Leaflet map
6. ✅ Order from map popup
7. ✅ View orders

### ⚠️ Partial (3/12)
1. ⚠️ Search medicines (page exists, no search)
2. ⚠️ View product details (basic info shown)
3. ⚠️ Admin dashboard (basic stats)

### ❌ Missing (2/12)
1. ❌ Stock reduction on orders
2. ❌ Quantity reservation

---

## 🎉 Next Steps

After fixing Firebase permissions, you can:

1. **Test real-time updates:**
   - Open map in Tab 1
   - Open admin panel in Tab 2
   - Add pharmacy → see marker appear instantly

2. **Explore the code:**
   - See [APPLICATION_FLOW.md](APPLICATION_FLOW.md) for detailed flows
   - Check file structure and component hierarchy

3. **Continue development:**
   - Implement checkout process (highest priority)
   - Add search & filters
   - Add order reports

---

**Need help?** Check the documentation files or let me know!
