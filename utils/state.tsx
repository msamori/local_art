import * as Location from 'expo-location';
import { createContext, useEffect, useState } from "react";

const Context = createContext();

const Provider = ({ children }) => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loggedInUser, setLoggedInUser ] = useState({});
  const [locationPermission, setLocationPermission] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.85209694527278,
    longitude: -73.94126596326808,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });




  const checkPermission = async () => {
    const hasPermission = await Location.requestForegroundPermissionsAsync();
    if (hasPermission.status === 'granted') {
      setLocationPermission(true);
      let location = await Location.getCurrentPositionAsync({});
      console.log(location);
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

  useEffect(()=>{
    checkPermission();
    return ()=>{
      setLocationPermission(false)
    }
  }, []);

  const context = {
    isLoggedIn,
    setIsLoggedIn,
    loggedInUser,
    setLoggedInUser,
    locationPermission,
    mapRegion,
    setMapRegion,


  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export { Context, Provider };
