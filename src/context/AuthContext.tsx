import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { getUserProfile, saveUserProfile } from '../firebase/firestoreService';
import { UserProfile } from '../types/travel';

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserPreferences: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          let profile = await getUserProfile(user.uid);
          if (!profile) {
            // First time login: create profile document
            await saveUserProfile({
              userId: user.uid,
              email: user.email || 'traveler@trippilot.ai',
              displayName: user.displayName || user.email?.split('@')[0] || 'Traveler',
              photoURL: user.photoURL || '',
              currency: 'INR',
              preferredStyle: 'Balanced',
              bio: 'Passionate globetrotter planning unforgettable journeys with TripPilot AI.'
            });
            profile = await getUserProfile(user.uid);
          }
          setUserProfile(profile);
        } catch (err) {
          console.error('Error fetching or creating user profile in Firestore:', err);
          // Set fallback profile in state
          setUserProfile({
            userId: user.uid,
            email: user.email || '',
            displayName: user.displayName || 'Traveler',
            photoURL: user.photoURL || '',
            currency: 'INR',
            preferredStyle: 'Balanced',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const result = await signInWithPopup(auth, provider);
    if (result.user) {
      await saveUserProfile({
        userId: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || 'Traveler',
        photoURL: result.user.photoURL || '',
      });
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email.trim(), pass);
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
    if (userCredential.user) {
      if (name.trim()) {
        await updateProfile(userCredential.user, { displayName: name.trim() });
      }
      await saveUserProfile({
        userId: userCredential.user.uid,
        email: userCredential.user.email || email.trim(),
        displayName: name.trim() || email.split('@')[0],
      });
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email.trim());
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
  };

  const updateUserPreferences = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    await saveUserProfile({
      userId: currentUser.uid,
      email: currentUser.email || '',
      ...userProfile,
      ...data,
    });
    const updated = await getUserProfile(currentUser.uid);
    if (updated) setUserProfile(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        logout,
        updateUserPreferences,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
