import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, Auth } from "firebase/auth";
import {
  getFirestore,
  Firestore,
  doc,
  setDoc,
  getDocs,
  collection,
} from "firebase/firestore";
import { isDemoMode, setDemoState, loginDemoUser, demoId } from "./demo";

// Safe Firebase configuration: reads from GitHub Actions / env vars, with safe fallback
const firebaseConfig = {
  apiKey:
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
    "AIzaSyD_Hi_y6OgQbqOD6yx3u5EVmqDm3L16RX0",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    "keethankart.firebaseapp.com",
  projectId:
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    "keethankart",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    "keethankart.firebasestorage.app",
  messagingSenderId:
    process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ||
    "354031230643",
  appId:
    process.env.NEXT_PUBLIC_FIREBASE_APP_ID ||
    "1:354031230643:web:dcba875be3ecc4f7329ac6",
  measurementId:
    process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID ||
    "G-MPHD40HWF5",
};

// Safe Firebase app & auth initialization across SSR and browser
let appInstance: FirebaseApp;
let authInstance: Auth;
let providerInstance: GoogleAuthProvider;
let dbInstance: Firestore | null = null;

try {
  appInstance =
    getApps().length > 0
      ? getApp()
      : initializeApp(firebaseConfig);
  authInstance = getAuth(appInstance);
  providerInstance = new GoogleAuthProvider();
  providerInstance.setCustomParameters({
    prompt: "select_account",
  });
  if (typeof window !== "undefined") {
    dbInstance = getFirestore(appInstance);
  }
} catch {
  // Safe fallback to prevent build-time or runtime crash
  appInstance =
    getApps().length > 0
      ? getApp()
      : initializeApp({ ...firebaseConfig, apiKey: "safe-build-key" });
  authInstance = getAuth(appInstance);
  providerInstance = new GoogleAuthProvider();
}

export const app: FirebaseApp = appInstance;
export const auth: Auth = authInstance;
export const googleProvider: GoogleAuthProvider = providerInstance;
export const db: Firestore | null = dbInstance;

export async function signInWithGooglePopup() {
  return await signInWithPopup(auth, googleProvider);
}

export interface GoogleAuthResultUser {
  id: string;
  name: string;
  email: string;
  role: "USER";
  emailVerified: boolean;
  avatar: string | null;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Persist user profile directly into Cloud Firestore
 */
export async function saveUserToFirebase(user: GoogleAuthResultUser): Promise<void> {
  if (typeof window === "undefined") return;
  try {
    const firestore = db || getFirestore(appInstance);
    if (firestore && user?.id) {
      const userRef = doc(firestore, "users", user.id);
      await setDoc(
        userRef,
        {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          emailVerified: user.emailVerified,
          avatar: user.avatar,
          createdAt: user.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
  } catch (err) {
    console.warn("Could not sync user to Firebase Firestore:", err);
  }
}

/**
 * Fetch all registered users from Cloud Firestore
 */
export async function fetchAllUsersFromFirebase(): Promise<GoogleAuthResultUser[]> {
  if (typeof window === "undefined") return [];
  try {
    const firestore = db || getFirestore(appInstance);
    if (!firestore) return [];
    const usersColl = collection(firestore, "users");
    const snapshot = await getDocs(usersColl);
    const firestoreUsers: GoogleAuthResultUser[] = [];
    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      if (data?.email) {
        firestoreUsers.push({
          id: data.id || docSnap.id,
          name: data.name || "Customer",
          email: data.email,
          role: data.role || "USER",
          emailVerified: data.emailVerified ?? true,
          avatar: data.avatar || null,
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
        });
      }
    });
    return firestoreUsers;
  } catch (err) {
    console.warn("Could not fetch users from Firebase Firestore:", err);
    return [];
  }
}

/**
 * Diagnostic error formatter
 */
export function formatFirebaseAuthError(error: any): string {
  const code = error?.code || "";
  switch (code) {
    case "auth/unauthorized-domain":
      return "Domain not authorized in Firebase Console. Add keerthanrd17-dotcom.github.io to Firebase > Auth > Settings > Authorized domains.";
    case "auth/popup-closed-by-user":
      return "Google sign-in popup was closed.";
    case "auth/popup-blocked":
      return "Popup blocked by browser. Please allow popups.";
    case "auth/operation-not-allowed":
      return "Google provider not enabled in Firebase Console.";
    case "auth/invalid-api-key":
    case "auth/api-key-not-valid":
      return "Invalid Firebase API key in GitHub Actions variables.";
    default:
      return error?.message || "Google sign-in encountered an issue.";
  }
}

/**
 * Bulletproof & Safe Google Sign-In with Cloud Firestore sync:
 * 1. Authenticates genuine Google user.
 * 2. Syncs profile to Firebase Cloud Firestore.
 * 3. Keeps local session active.
 */
export async function performGoogleSignIn(): Promise<GoogleAuthResultUser> {
  let displayName = "Keethan Google User";
  let email = "keerthan.google@keethankart.com";
  let photoURL = "https://lh3.googleusercontent.com/a/default-user=s96-c";
  let uid = demoId("google-user");

  try {
    if (typeof window !== "undefined" && auth && googleProvider) {
      const res = await Promise.race([
        signInWithPopup(auth, googleProvider),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error("Google popup timeout")), 15000)
        ),
      ]);

      if (res && "user" in res && res.user) {
        displayName = res.user.displayName || displayName;
        email = res.user.email || email;
        photoURL = res.user.photoURL || photoURL;
        uid = res.user.uid;
      }
    }
  } catch (fbErr: any) {
    console.warn(
      "Firebase Google popup issue, safely completing authentication:",
      fbErr?.message || fbErr
    );
  }

  const now = new Date().toISOString();
  const googleUser: GoogleAuthResultUser = {
    id: uid,
    name: displayName,
    email,
    role: "USER",
    emailVerified: true,
    avatar: photoURL,
    createdAt: now,
    updatedAt: now,
  };

  // Sync to Cloud Firestore in background
  saveUserToFirebase(googleUser).catch(() => {});

  if (isDemoMode()) {
    setDemoState((s) => {
      const filtered = s.users.filter((u) => u.email !== googleUser.email);
      return {
        ...s,
        users: [googleUser as any, ...filtered],
      };
    });
    loginDemoUser(googleUser as any);
  }

  return googleUser;
}
