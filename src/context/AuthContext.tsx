import React, { useContext, useState, useEffect, createContext, ReactNode } from "react";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  updateProfile, 
  GoogleAuthProvider, 
  signInWithPopup,
  updateEmail,
  updatePassword,
  sendEmailVerification,
  User,
  UserCredential
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc 
} from "firebase/firestore";
import { app } from "../firebase"; 
import { UserProfile } from "../types";

// Define types for the authentication context
interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  signin: (email: string, password: string) => Promise<UserCredential>;
  signout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  updateUserProfile: (profile: { displayName?: string; homeAddress?: string }) => Promise<void>;
  updateUserEmail: (newEmail: string) => Promise<void>;
  updateUserPassword: (newPassword: string) => Promise<void>;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook for accessing auth context (recommended pattern)
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// AuthProvider wraps your app and provides authentication state and actions
export function AuthProvider({ children }: { children: ReactNode }) {
  // State for the current Firebase user
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  // State for user profile info stored in Firestore
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  // Loading state to prevent rendering before auth is ready
  const [loading, setLoading] = useState(true);

  const auth = getAuth(app);
  const db = getFirestore(app);

  // --- SIGN UP: Create user in Firebase Auth and Firestore, send verification email ---
  async function signup(email: string, password: string, displayName: string): Promise<void> {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    // Use the current site origin for the verification link, so it works on any deployment
    const verificationUrl = `${window.location.origin}/signin`;
    await sendEmailVerification(userCredential.user, {
      url: verificationUrl,
      handleCodeInApp: false
    });
    // Save extra info in Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      displayName,
      email,
      createdAt: new Date()
    });
    setCurrentUser(userCredential.user);
    setUserProfile({ displayName, email });
  }

  // --- GOOGLE SIGN-IN: Handles Google OAuth and user doc creation ---
  async function signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    // Check if user doc exists, if not, create it
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        createdAt: new Date()
      });
    } else if (!userSnap.data().photoURL) {
      // Update Firestore doc if photoURL is missing
      await setDoc(userRef, {
        ...userSnap.data(),
        photoURL: user.photoURL
      }, { merge: true });
    }
    setCurrentUser(user);
    setUserProfile({
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL
    });
  }

  // --- EMAIL/PASSWORD SIGN-IN ---
  function signin(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // --- SIGN OUT ---
  function signout(): Promise<void> {
    return signOut(auth);
  }

  // --- UPDATE USER PROFILE (Display Name) ---
  async function updateUserProfile({ displayName, homeAddress }: { displayName?: string; homeAddress?: string }): Promise<void> {
    if (!currentUser) return;
    
    const updates: Partial<UserProfile> = {};
    if (displayName && currentUser.displayName !== displayName) {
      await updateProfile(currentUser, { displayName });
      updates.displayName = displayName;
    }
    if (homeAddress !== undefined) {
      updates.homeAddress = homeAddress;
    }
    
    if (Object.keys(updates).length > 0) {
      await setDoc(doc(db, "users", currentUser.uid), {
        ...userProfile,
        ...updates
      }, { merge: true });
    }
    
    // Refresh profile
    const userSnap = await getDoc(doc(db, "users", currentUser.uid));
    setUserProfile(userSnap.data() as UserProfile);
  }

  // --- UPDATE USER EMAIL ---
  async function updateUserEmail(newEmail: string): Promise<void> {
    if (!currentUser) return;
    await updateEmail(currentUser, newEmail);
    await setDoc(doc(db, "users", currentUser.uid), {
      ...userProfile,
      email: newEmail
    }, { merge: true });
    setUserProfile({ 
      displayName: userProfile?.displayName || null,
      email: newEmail,
      photoURL: userProfile?.photoURL || null
    });
  }

  // --- UPDATE USER PASSWORD ---
  function updateUserPassword(newPassword: string): Promise<void> {
    if (!currentUser) throw new Error("No user logged in");
    return updatePassword(currentUser, newPassword);
  }

  // --- LOAD USER PROFILE ON AUTH STATE CHANGE ---
  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Load user profile from Firestore
        const userSnap = await getDoc(doc(db, "users", user.uid));
        let profile = userSnap.exists() ? (userSnap.data() as UserProfile) : null;
        // Always prefer the latest photoURL from Firebase Auth
        if (profile) {
          profile = {
            ...profile,
            photoURL: user.photoURL || profile.photoURL || null
          };
        }
        setUserProfile(profile);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [auth, db]);

  // All auth state and actions provided to children
  const value = {
    currentUser,
    userProfile,
    signup,
    signin,
    signout,
    signInWithGoogle,
    updateUserProfile,
    updateUserEmail,
    updateUserPassword
  };

  // Only render children when not loading (prevents flicker)
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}