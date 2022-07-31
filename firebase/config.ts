import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApp, getApps, initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage, ref } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCT20riVHvZZFPCgGrfcpkHeazsIPmY-cg",
  authDomain: "samori-local-art.firebaseapp.com",
  projectId: "samori-local-art",
  storageBucket: "samori-local-art.appspot.com",
  messagingSenderId: "807808859373",
  appId: "1:807808859373:web:6518afc9b39eb83020a0e4",
  measurementId: "G-Q3H11B9CMW",
};

const initiatedAlready: number = getApps().length;
const firebaseApp =
  initiatedAlready === 0 ? initializeApp(firebaseConfig) : getApp();

const auth =
  initiatedAlready === 0
    ? initializeAuth(firebaseApp, {
        persistence: getReactNativePersistence(AsyncStorage),
      })
    : getAuth();
const db = getFirestore(firebaseApp);
const functions = getFunctions(firebaseApp);

const storage = getStorage(firebaseApp);
const storageRef = ref(storage);

export { auth, db, storageRef, functions };
