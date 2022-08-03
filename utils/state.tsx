import * as Location from "expo-location";
import * as ImagePicker from 'expo-image-picker';
import { Region } from "react-native-maps";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getLoggedInUserData } from "../firebase";
import { auth } from "../firebase/config";
import { PhonePic, Props, UserData } from "./types";

type ContextType = {
  deviceArt: PhonePic[];
  setDeviceArt(art: PhonePic[]): void;
  currentLocation: Location.LocationObject;
  isLoggedIn: boolean;
  setLoggedInUser(user: UserData): void;
  loading: boolean;
  locationPermission: boolean;
  mediaPermission: boolean;
  loggedInUser: UserData;
  mapRegion: Region;
  setMapRegion(region: Region): void;
};

const Context = createContext<ContextType | undefined>(undefined);

function useLocalArtContext(): ContextType {
  const context = useContext(Context);
  if (context === undefined) {
    throw Error(
      "Context muse be used inside of a Provider, " +
        "otherwise it will not function correctly."
    );
  }

  return context;
}

const Provider = ({ children }: Props) => {
  const emptyUser: UserData = {
    id: "",
    userName: "",
    email: "",
    lastLogin: 0,
    lastLogout: 0,
    showUploadModal: true,
  };

  const [currentLocation, setCurrentLocation] = useState<Location.LocationObject>({
    coords: {
      latitude: 0,
      longitude: 0,
      altitude: 0 || null,
      accuracy: 0,
      altitudeAccuracy: 0,
      heading: 0,
      speed: 0
    },
    timestamp: 0
  });

  const [deviceArt, setDeviceArt] = useState<PhonePic[]>([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState<UserData>(emptyUser);
  const [locationPermission, setLocationPermission] = useState(false);
  const [mediaPermission, setMediaPermission] = useState(false);
  const [mapRegion, setMapRegion] = useState<Region>({
    latitude: currentLocation.coords.latitude || 40.85209694527278,
    longitude: currentLocation.coords.longitude || -73.94126596326808,
    latitudeDelta: 0.01,
    longitudeDelta: 0.001,
  });


  const checkLocationPermission = async () => {
    const hasPermission = await Location.requestForegroundPermissionsAsync();
    if (hasPermission.status === "granted") {
      setLocationPermission(true);
      let location: Location.LocationObject =
        await Location.getCurrentPositionAsync({});
      setCurrentLocation(location);
      setMapRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    } else {
      console.log("sucks to suck");
    }
  };

  async function checkMediaPermission() {
    let permissionStatus = await ImagePicker.getMediaLibraryPermissionsAsync();
    if (permissionStatus.granted) {
      setMediaPermission(true);
      return true;
    }

    permissionStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionStatus.granted) {
      setMediaPermission(true);
      return true;
    }

    console.log("permission denied response:", permissionStatus);

    alert(
      "Map page disabled until permission granted.  To grant permission see your device privacy settings."
    );
  }

  async function currentUserListener() {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userData = await getLoggedInUserData(user.uid);
          console.log("currentUserListener user:", userData);
          setLoggedInUser(userData);
          setIsLoggedIn(true);
          setLoading(false);
        } else {
          console.log("currentUserListener: no user logged in.");
          setLoggedInUser(emptyUser);
          setIsLoggedIn(false);
          setLoading(false);
        }
        return unsubscribe;
      });
    } catch (error) {
      console.error("currentUserListener error:", error);
    }
  }

  useEffect(() => {
    init();
    return () => {
      cleanUp();
    };
  }, []);

  async function init() {
    await checkLocationPermission();
    await checkMediaPermission();
    await currentUserListener();
  }

  function cleanUp() {
    setLocationPermission(false);
    setMediaPermission(false);
    setLoggedInUser(emptyUser);
    setLoading(true);
  }

  const context = {
    deviceArt,
    setDeviceArt,
    currentLocation,
    isLoggedIn,
    setIsLoggedIn,
    setLoggedInUser,
    loading,
    locationPermission,
    mediaPermission,
    loggedInUser,
    mapRegion,
    setMapRegion,
  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export { Provider, useLocalArtContext };
