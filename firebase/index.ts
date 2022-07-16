import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "./config";
import { UserData } from "../utils/types";

async function createNewUser(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    writeUserDataInFirestore(userCredential.user.uid, email);
  } catch (error) {
    if (error.code === "auth/invalid-email") {
      console.log("Please enter a valid email address.");
    } else if (error.code === "auth/email-already-in-use") {
      console.log("That email is already in use.  Please login.");
    } else if (error.code === "auth/weak-password") {
      console.log("A stronger password is required.  Sorry.");
    } else {
      console.error("error trying to register user:", error);
    }
  }
}

async function writeUserDataInFirestore(uid: string, email: string) {
  try {
    const data: UserData = {
      id: uid,
      email,
      lastLogin: Date.now(),
    };

    const docRef = doc(db, "users", uid);
    await setDoc(docRef, data);
  } catch (error) {
    console.error("error writing user data to firestore:", error);
  }
}

async function getLoggedInUserData(userId: string) {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  const docData = docSnap.data();
  const userData = new Object(docData);
  return userData;
}

async function loginUser(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/invalid-email"
    ) {
      console.log(
        "That email address has not been found.  Register or try again."
      );
    } else if (error.code === "auth/wrong-password") {
      console.log("Incorrect password.  Please try again.");
    } else {
      console.error("error trying to login user:", error);
    }
  }
}

async function logoutUser() {
  try {
    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, "users", user.uid);
      const data = await getLoggedInUserData(user.uid);
      data.lastLogout = Date.now();
      await updateDoc(docRef, data);
      signOut(auth);
    } else {
      return;
    }
  } catch (error) {
    console.error("logoutUser error:", logoutUser);
  }
}

export { createNewUser, getLoggedInUserData, loginUser, logoutUser };
