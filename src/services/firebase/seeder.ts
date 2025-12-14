import { writeBatch, doc } from 'firebase/firestore';
import { db, COLLECTIONS, auth } from './';
import { useAuthStore } from '@/stores/authStore';
import { 
  KRAKOW_TRIP, 
  KRAKOW_DAYS, 
  KRAKOW_PLACES, 
  KRAKOW_OFFERS,
  KRAKOW_TRIP_ID
} from '@/data/krakowDemoData';

/**
 * Seeds Firestore with Krakow demo data
 * WARN: This will overwrite existing documents with the same IDs
 * Uses current authenticated user's ID from store or Firebase Auth
 */
export async function seedKrakowData(): Promise<void> {
  console.log('[Seeder] Starting Krakow data seed...');
  
  // Get current user ID from store first (handles bypass mode), then Firebase Auth
  const storeUser = useAuthStore.getState().user;
  const firebaseUser = auth.currentUser;
  
  const userId = storeUser?.uid || firebaseUser?.uid;
  
  if (!userId) {
    throw new Error('[Seeder] No authenticated user. Please login first.');
  }
  console.log(`[Seeder] Using user ID: ${userId}`);
  
  try {
    const batch = writeBatch(db);
    let operationCount = 0;

    // 1. Seed Trip with current user's ID
    const tripData = { ...KRAKOW_TRIP, user_id: userId };
    const tripRef = doc(db, COLLECTIONS.TRIPS, KRAKOW_TRIP.id);
    batch.set(tripRef, tripData);
    operationCount++;
    console.log(`[Seeder] Added trip: ${KRAKOW_TRIP.id} for user: ${userId}`);

    // 2. Seed Days
    KRAKOW_DAYS.forEach((day) => {
      const dayRef = doc(db, COLLECTIONS.TRIP_DAYS, day.id);
      batch.set(dayRef, day);
      operationCount++;
    });
    console.log(`[Seeder] Queued ${KRAKOW_DAYS.length} days`);

    // 3. Seed Places
    KRAKOW_PLACES.forEach((place) => {
      const placeRef = doc(db, COLLECTIONS.PLACES, place.id);
      batch.set(placeRef, place);
      operationCount++;
    });
    console.log(`[Seeder] Queued ${KRAKOW_PLACES.length} places`);

    // 4. Seed Offers
    KRAKOW_OFFERS.forEach((offer) => {
      const offerRef = doc(db, COLLECTIONS.OFFERS, offer.offer_id);
      batch.set(offerRef, offer);
      operationCount++;
    });
    console.log(`[Seeder] Queued ${KRAKOW_OFFERS.length} offers`);

    // Commit batch
    console.log(`[Seeder] Committing ${operationCount} operations...`);
    await batch.commit();
    console.log('[Seeder] Seed completed successfully!');
    
  } catch (error) {
    console.error('[Seeder] Error seeding data:', error);
    throw error;
  }
}

