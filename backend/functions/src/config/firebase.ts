// The Firebase Admin SDK to access Firestore.
import * as admin from 'firebase-admin';

admin.initializeApp();

const db: admin.firestore.Firestore = admin.firestore();

const kanaCollectionName = 'kanasv2';

export {admin, db, kanaCollectionName};
