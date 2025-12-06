import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  DocumentData,
  QueryConstraint,
  DocumentReference,
  CollectionReference,
  Timestamp,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './config';

// Collection names as constants
export const COLLECTIONS = {
  USERS: 'users',
  TRIPS: 'trips',
  TRIP_DAYS: 'tripDays', // Top-level collection: tripDays/{tripId}_day{dayIndex}
  PLACES: 'places',      // Top-level collection: places/{tripId}_{placeId}
  OFFERS: 'offers',      // Top-level collection: offers/{offerId}
  LIVE_SESSIONS: 'liveSessions',
  SHARED_PLANS: 'sharedPlans',
  VOTES: 'votes',
} as const;

/**
 * Get a document reference
 */
export function getDocRef<T = DocumentData>(
  collectionName: string,
  docId: string
): DocumentReference<T> {
  return doc(db, collectionName, docId) as DocumentReference<T>;
}

/**
 * Get a collection reference
 */
export function getCollectionRef<T = DocumentData>(
  collectionName: string
): CollectionReference<T> {
  return collection(db, collectionName) as CollectionReference<T>;
}

/**
 * Get a single document by ID
 */
export async function getDocument<T = DocumentData>(
  collectionName: string,
  docId: string
): Promise<T | null> {
  const docRef = getDocRef<T>(collectionName, docId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as T;
  }
  return null;
}

/**
 * Get multiple documents with query constraints
 */
export async function getDocuments<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  const collectionRef = getCollectionRef<T>(collectionName);
  const q = query(collectionRef, ...constraints);
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as T[];
}

/**
 * Create or update a document
 */
export async function setDocument<T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T,
  merge = true
): Promise<void> {
  const docRef = getDocRef(collectionName, docId);
  return setDoc(docRef, data, { merge });
}

/**
 * Update specific fields in a document
 */
export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Partial<DocumentData>
): Promise<void> {
  const docRef = getDocRef(collectionName, docId);
  return updateDoc(docRef, data);
}

/**
 * Delete a document
 */
export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  const docRef = getDocRef(collectionName, docId);
  return deleteDoc(docRef);
}

/**
 * Subscribe to document changes
 */
export function subscribeToDocument<T = DocumentData>(
  collectionName: string,
  docId: string,
  callback: (data: T | null) => void
): () => void {
  const docRef = getDocRef<T>(collectionName, docId);
  return onSnapshot(docRef, (docSnap) => {
    if (docSnap.exists()) {
      callback({ id: docSnap.id, ...docSnap.data() } as T);
    } else {
      callback(null);
    }
  });
}

/**
 * Subscribe to collection changes
 */
export function subscribeToCollection<T = DocumentData>(
  collectionName: string,
  constraints: QueryConstraint[],
  callback: (data: T[]) => void
): () => void {
  const collectionRef = getCollectionRef<T>(collectionName);
  const q = query(collectionRef, ...constraints);
  
  return onSnapshot(q, (querySnapshot) => {
    const data = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as T[];
    callback(data);
  });
}

/**
 * Create a batch write
 */
export function createBatch() {
  return writeBatch(db);
}

// Re-export commonly used Firestore utilities
export {
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  db,
};

