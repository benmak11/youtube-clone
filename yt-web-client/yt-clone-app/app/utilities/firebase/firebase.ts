// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth,
        signInWithPopup,
        GoogleAuthProvider,
        onAuthStateChanged,
        User
} from "firebase/auth"
import { experimental_taintObjectReference } from "react";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA1tsgbzXxM8WQoRFzXoopDGiLRGaURz64",
  authDomain: "yt-clone-71fe7.firebaseapp.com",
  projectId: "yt-clone-71fe7",
  //storageBucket: "yt-clone-71fe7.appspot.com",
  //messagingSenderId: "914117207641",
  appId: "1:914117207641:web:58427b78d388574caff348",
  measurementId: "G-QLKJLP5SPN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app)

/**
 * Signs in the user in with Google popup.
 * @returns A promise that resolves with the user's credentials
 */
export function signInWithGoogle() {
    return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Signs the user out
 * @returns A promise that resolves when the user is signed out
 */
export function signOut() {
    return auth.signOut();
}

/**
 * Trigger a callback when user auth state changes
 * @returns A function to unsubscribe callback
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
    return onAuthStateChanged(auth, callback);
}