import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../firebase/config";
import { getLoggedInUserData } from "../firebase";


const Context = createContext();

const Provider = ({ children }) => {
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.85209694527278,
    longitude: -73.94126596326808,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [currentUser, setCurrentUser] = useState({});

  async function currentUserListener() {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userData = await getLoggedInUserData(user.uid);
          console.log("currentUserListener user:", userData);
          setCurrentUser(userData);
        } else {
          console.log("currentUserListener: no user logged in.");
        }
        return unsubscribe;
      });
    } catch (error) {
      console.error("currentUserListener error:", error);
    }
  }

  useEffect(() => {
    const unsubscribeCurrentUserListener = currentUserListener();
    return () => {
      unsubscribeCurrentUserListener();
      setCurrentUser({});
    };
  }, []);

  const context = {
    currentUser,
    mapRegion,
    setMapRegion
  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export { Context, Provider };
