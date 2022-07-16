import * as Location from 'expo-location';
import { createContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getLoggedInUserData } from '../firebase';
import { auth } from '../firebase/config';

const Context = createContext();
type State = {
  currentLocation: object;
  isLoggedIn: boolean;
  loading: boolean;
  locationPermission: boolean;
  loggedInUser: object;
  mapRegion: object;
  setMapRegion: object;
}

const Provider = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true)
  const [loggedInUser, setLoggedInUser ] = useState({});
  const [locationPermission, setLocationPermission] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.85209694527278,
    longitude: -73.94126596326808,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const [currentLocation, setCurrentLocation] = useState({
    coords: {
      accuracy: 0,
      altitude: 0,
      altitudeAccuracy: 0,
      heading: 0,
      latitude: 0,
      longitude: 0,
      speed: 0,
    },
    mocked: false,
    timestamp: 0,
  })

  const checkPermission = async () => {
    const hasPermission = await Location.requestForegroundPermissionsAsync();
    if (hasPermission.status === 'granted') {
      setLocationPermission(true);
      let location = await Location.getCurrentPositionAsync({});
      console.log(location);
      setCurrentLocation(location);
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else {
      console.log("sucks to suck")
    }
  };

  async function currentUserListener() {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userData = await getLoggedInUserData(user.uid);
          console.log("currentUserListener user:", userData);
          setLoggedInUser(userData);
          setIsLoggedIn(true)
          setLoading(false);
        } else {
          console.log("currentUserListener: no user logged in.");
          setLoggedInUser({});
          setIsLoggedIn(false);
          setLoading(false);
        }
        return unsubscribe;
      });
    } catch (error) {
      console.error("currentUserListener error:", error);
    }
  }

  useEffect(()=>{
    checkPermission();
    currentUserListener();
    return ()=>{
      setLocationPermission(false)
      setLoggedInUser({});
      setLoading(true);
    }
  }, []);

  const context: State = {
    currentLocation,
    isLoggedIn,
    loading,
    locationPermission,
    loggedInUser,
    mapRegion,
    setMapRegion,
  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export { Context, Provider };
