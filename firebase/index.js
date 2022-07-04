import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./config.js";

async function createNewUser(email, password) {
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

async function writeUserDataInFirestore(uid, email) {
  try {
    const data = {
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

async function loginUser(email, password) {
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

export { createNewUser, loginUser };
