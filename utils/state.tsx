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

  const [loggedIn, setLoggedIn] = useState(false);

  const context = {
    loggedIn,
    setLoggedIn,
    mapRegion,
    setMapRegion,
  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export { Context, Provider };
