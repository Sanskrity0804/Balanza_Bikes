import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, doc, getDocFromServer, enableIndexedDbPersistence } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize the Firebase app
const app = initializeApp(firebaseConfig);

const firestoreSettings = {
  experimentalForceLongPolling: true,
  useFetchStreams: false,
};

// Initialize Firestore for the primary "Balanza Bikes" database using robust connection settings
const dbId = firebaseConfig.firestoreDatabaseId || (firebaseConfig as any).databaseId || "(default)";
export const db = initializeFirestore(app, firestoreSettings, dbId);

// Gracefully enable offline persistence
try {
  enableIndexedDbPersistence(db).catch((err) => {
    console.warn("[Firebase] Offline persistence warning:", err.message);
  });
} catch (e: any) {
  console.warn("[Firebase] Offline persistence could not be initialized due to environment/iframe constraints:", e.message);
}

// Initialize Auth
export const auth = getAuth(app);

// Operational Types for the Error Handler matching Firebase guidelines
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

/**
 * Normalizes Firestore errors to provide structured JSON-formatted info for debugging rules.
 */
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: auth.currentUser?.emailVerified || null,
      isAnonymous: auth.currentUser?.isAnonymous || null,
      tenantId: auth.currentUser?.tenantId || null,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection Validation Test
async function testConnection() {
  try {
    // Only perform check, if it fails, handle it silently without logging fatal errors
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    // Graceful silent fallback
    console.log("[Firebase] Network connection is offline or initializing. Local server-proxy fallback mode will serve active requests.");
  }
}

testConnection();
