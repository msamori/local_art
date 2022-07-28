import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  arrayUnion,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth, db, storageRef } from "./config";
import { UserData, ArtPic } from "../utils/types";
import { uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";

// The regular Error object does not have a "code" property
// This class lets Typescript know to expect that property from Firebase AuthErrors
class AuthenticationError{
  code: string;
  message: string;
  name: string;

  constructor(code: string, message: string, name: string){
    this.code = code;
    this.message = message;
    this.name = name;
  }
}

async function createNewUser(
  email: string,
  password: string,
  userName: string
) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    writeUserDataInFirestore(userCredential.user.uid, email, userName);
  } catch (error) {
    if (error instanceof AuthenticationError && error.code === "auth/invalid-email") {
      console.log("Please enter a valid email address.");
    } else if (error instanceof AuthenticationError && error.code === "auth/email-already-in-use") {
      console.log("That email is already in use.  Please login.");
    } else if (error instanceof AuthenticationError && error.code === "auth/weak-password") {
      console.log("A stronger password is required.  Sorry.");
    } else {
      console.error("error trying to register user:", error);
    }
  }
}

async function writeUserDataInFirestore(
  uid: string,
  email: string,
  userName: string
) {
  try {
    const data: UserData = {
      id: uid,
      userName,
      email,
      lastLogin: Date.now(),
      lastLogout: 0,
      showUploadModal: true,
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
  const userData: UserData = {
    id: userId,
    userName: docData?.userName,
    email: docData?.email,
    lastLogin: docData?.lastLogin,
    lastLogout: docData?.lastLogout,
    showUploadModal: docData?.showUploadModal,
  };
  return userData;
}

async function loginUser(email: string, password: string) {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    if (error instanceof AuthenticationError &&
      (error.code === "auth/user-not-found" ||
      error.code === "auth/invalid-email")
    ) {
      console.log(
        "That email address has not been found.  Register or try again."
      );
    } else if (error instanceof AuthenticationError && error.code === "auth/wrong-password") {
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

async function uploadPhotoToStorage(data: ArtPic, uri: string) {
  try {
    const DOC_ID = await uploadDataToFirestore(data);
    const response = await fetch(uri);
    const blob = await response.blob();

    const observationsRef = ref(storageRef, "Local Art");
    const imageRef = ref(observationsRef, DOC_ID);
    await uploadBytesResumable(imageRef, blob);
    const downloadURL = await getDownloadURL(imageRef);
    data.url = downloadURL;
    await setDoc(doc(db, "Local Art", DOC_ID), data);
  } catch (error) {
    console.error("error adding photo to storage:", error);
  }
}

async function uploadDataToFirestore(data: object) {
  const docRef = await addDoc(collection(db, "Local Art"), data);
  return docRef.id;
}

async function markArtAsSeen(artID: string, userId: string) {
  const docRef = doc(db, "Local Art", artID);
  await updateDoc(docRef, {
    seenBy: arrayUnion(userId),
  });
}

async function neverShowModalAgain(userId: string) {
  const docRef = doc(db, "users", userId);
  await updateDoc(docRef, {
    showUploadModal: false,
  });
}

export {
  createNewUser,
  getLoggedInUserData,
  loginUser,
  logoutUser,
  markArtAsSeen,
  neverShowModalAgain,
  uploadPhotoToStorage,
};
