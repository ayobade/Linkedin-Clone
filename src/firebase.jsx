// firebase.jsx
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
if (!firebaseConfig.apiKey || !firebaseConfig.authDomain || !firebaseConfig.projectId || !firebaseConfig.storageBucket || !firebaseConfig.appId) {
  // Surface a clear error to help diagnose invalid-api-key issues
  const missing = Object.entries(firebaseConfig)
    .filter(([k, v]) => !v && ["apiKey","authDomain","projectId","storageBucket","appId"].includes(k))
    .map(([k]) => k)
    .join(", ");
  console.error("Firebase config missing keys:", missing, firebaseConfig);
  throw new Error("Missing Firebase env variables. Check your .env VITE_* keys and restart the dev server.");
}

const firebaseApp = firebase.initializeApp(firebaseConfig);

// Services
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
const storage = firebase.storage();

export { auth, provider, storage };
export default db;

