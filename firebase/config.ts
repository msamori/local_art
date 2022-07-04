import AsyncStorage from "@react-native-async-storage/async-storage";
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCT20riVHvZZFPCgGrfcpkHeazsIPmY-cg",
  authDomain: "samori-local-art.firebaseapp.com",
  projectId: "samori-local-art",
  storageBucket: "samori-local-art.appspot.com",
  messagingSenderId: "807808859373",
  appId: "1:807808859373:web:6518afc9b39eb83020a0e4",
  measurementId: "G-Q3H11B9CMW",
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = initializeAuth(firebaseApp, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// const analytics = getAnalytics(firebaseApp);
const db = getFirestore(firebaseApp);
const functions = getFunctions(firebaseApp);
const storage = getStorage(firebaseApp);

export { auth, db, storage, functions };
