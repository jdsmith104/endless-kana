// The Firebase Admin SDK to access Firestore.
import * as admin from 'firebase-admin';

admin.initializeApp();

const db: admin.firestore.Firestore = admin.firestore();
export {admin, db};
