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

// User Profile Operations
export async function getUserProfile(userId: string): Promise<UserProfile | null> {
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
    } catch (fallbackErr) {
      handleFirestoreError(fallbackErr, OperationType.LIST, path);
      return [];
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
    return null;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
    return null;
  }
}

export async function saveTrip(trip: Trip): Promise<void> {
  const path = `trips/${trip.id}`;
  try {
    const docRef = doc(db, 'trips', trip.id);
    await setDoc(docRef, trip);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function updateTrip(tripId: string, updates: Partial<Trip>): Promise<void> {
  const path = `trips/${tripId}`;
  try {
    const docRef = doc(db, 'trips', tripId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteTrip(tripId: string): Promise<void> {
  const path = `trips/${tripId}`;
  try {
    const docRef = doc(db, 'trips', tripId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}
