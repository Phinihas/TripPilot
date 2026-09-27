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
} from 'firebase/firestore';
import { db, auth } from './config';
import { Trip, UserProfile } from '../types/travel';

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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
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

const LOCAL_STORAGE_TRIPS_KEY = 'trippilot_cached_trips';

function getLocalTrips(userId: string): Trip[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY);
    if (!raw) return [];
    const trips: Trip[] = JSON.parse(raw);
    return trips.filter(t => t.userId === userId);
  } catch {
    return [];
  }
}

function saveLocalTrip(trip: Trip): void {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY);
    const trips: Trip[] = raw ? JSON.parse(raw) : [];
    const index = trips.findIndex(t => t.id === trip.id);
    if (index >= 0) {
      trips[index] = trip;
    } else {
      trips.unshift(trip);
    }
    localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(trips));
  } catch (e) {
    console.warn('Local storage write warning:', e);
  }
}

function deleteLocalTrip(tripId: string): void {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY);
    if (!raw) return;
    const trips: Trip[] = JSON.parse(raw);
    const filtered = trips.filter(t => t.id !== tripId);
    localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(filtered));
  } catch (e) {
    console.warn('Local storage delete warning:', e);
  }
}

// User Profile Operations
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (userId === 'demo_traveler_guest') {
    return {
      userId: 'demo_traveler_guest',
      email: 'traveler.demo@trippilot.ai',
      displayName: 'Alex Rivers (Demo)',
      photoURL: '',
      currency: 'INR',
      preferredStyle: 'Balanced',
      bio: 'Demo globetrotter exploring TripPilot AI.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  const path = `users/${userId}`;
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

export async function saveUserProfile(profile: Partial<UserProfile> & { userId: string; email: string }): Promise<void> {
  if (profile.userId === 'demo_traveler_guest') return;

  const path = `users/${profile.userId}`;
  try {
    const docRef = doc(db, 'users', profile.userId);
    const existing = await getDoc(docRef);
    const now = new Date().toISOString();

    const data: UserProfile = {
      userId: profile.userId,
      email: profile.email,
      displayName: profile.displayName || profile.email.split('@')[0] || 'Traveler',
      photoURL: profile.photoURL || '',
      currency: profile.currency || 'USD',
      bio: profile.bio || 'Exploring the world one itinerary at a time.',
      preferredStyle: profile.preferredStyle || 'Balanced',
      createdAt: existing.exists() ? existing.data()?.createdAt || now : now,
      updatedAt: now,
    };

    await setDoc(docRef, data, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Trips Operations
export async function getTripsByUser(userId: string): Promise<Trip[]> {
  if (userId === 'demo_traveler_guest') {
    return getLocalTrips(userId);
  }

  const path = 'trips';
  try {
    const q = query(
      collection(db, 'trips'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const trips: Trip[] = [];
    snapshot.forEach(docSnap => {
      trips.push(docSnap.data() as Trip);
    });
    return trips;
  } catch (err) {
    // If composite index is pending, fallback to un-ordered query
    try {
      const fallbackQuery = query(
        collection(db, 'trips'),
        where('userId', '==', userId)
      );
      const snapshot = await getDocs(fallbackQuery);
      const trips: Trip[] = [];
      snapshot.forEach(docSnap => {
        trips.push(docSnap.data() as Trip);
      });
      return trips.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch {
      // Fallback to local trips cache
      return getLocalTrips(userId);
    }
  }
}

export async function getTripById(tripId: string): Promise<Trip | null> {
  const path = `trips/${tripId}`;
  try {
    const docRef = doc(db, 'trips', tripId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Trip;
    }
    // Check local storage fallback
    const raw = localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY);
    if (raw) {
      const trips: Trip[] = JSON.parse(raw);
      const found = trips.find(t => t.id === tripId);
      if (found) return found;
    }
    return null;
  } catch {
    const raw = localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY);
    if (raw) {
      const trips: Trip[] = JSON.parse(raw);
      const found = trips.find(t => t.id === tripId);
      if (found) return found;
    }
    return null;
  }
}

export async function saveTrip(trip: Trip): Promise<void> {
  // Always mirror in local storage for instant responsiveness & offline resilience
  saveLocalTrip(trip);

  if (trip.userId === 'demo_traveler_guest') {
    return;
  }

  const path = `trips/${trip.id}`;
  try {
    const docRef = doc(db, 'trips', trip.id);
    await setDoc(docRef, trip);
  } catch (err) {
    console.warn('Firestore trip save warning, saved locally:', err);
  }
}

export async function updateTrip(tripId: string, updates: Partial<Trip>): Promise<void> {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_TRIPS_KEY);
    if (raw) {
      const trips: Trip[] = JSON.parse(raw);
      const index = trips.findIndex(t => t.id === tripId);
      if (index >= 0) {
        trips[index] = { ...trips[index], ...updates, updatedAt: new Date().toISOString() };
        localStorage.setItem(LOCAL_STORAGE_TRIPS_KEY, JSON.stringify(trips));
      }
    }
  } catch (e) {
    console.warn('Local update warning:', e);
  }

  const path = `trips/${tripId}`;
  try {
    const docRef = doc(db, 'trips', tripId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Firestore update warning:', err);
  }
}

export async function deleteTrip(tripId: string): Promise<void> {
  deleteLocalTrip(tripId);

  const path = `trips/${tripId}`;
  try {
    const docRef = doc(db, 'trips', tripId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Firestore delete warning:', err);
  }
}
