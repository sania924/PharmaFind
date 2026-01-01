// Server-side Firebase Admin configuration
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';

// Initialize Firebase Admin (only once)
if (!getApps().length) {
  const serviceAccount = require('../../firebase-service-account.json');

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'pharmafind-4321',
  });
}

// Export Firestore instance
export const adminDb = admin.firestore();
export const adminAuth = admin.auth();

export default admin;
