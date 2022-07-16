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

  useEffect(()=>{
    checkPermission();
    return ()=>{
      setLocationPermission(false)
    }
  }, []);

  const context = {
    currentLocation,
    isLoggedIn,
    locationPermission,
    mapRegion,
    setIsLoggedIn,
    setMapRegion,
  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export { Context, Provider };
