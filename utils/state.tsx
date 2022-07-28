import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { getLoggedInUserData } from "../firebase";
import { auth, db } from "../firebase/config";
import {
  collection,
  DocumentData,
  onSnapshot,
  query,
} from "firebase/firestore";
import { ContextType, PhonePic, Props, UserData } from "./types";

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

  const [art, setArt] = useState<object[]>([]);
  const [pics, setPics] = useState<PhonePic[]>([]);
  const [deviceArt, setDeviceArt] = useState<PhonePic[]>([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState<UserData>(emptyUser);
  const [locationPermission, setLocationPermission] = useState(false);
  const [mediaPermission, setMediaPermission] = useState(false);
  const [mapRegion, setMapRegion] = useState({
    latitude: 40.85209694527278,
    longitude: -73.94126596326808,
    latitudeDelta: 0.01,
    longitudeDelta: 0.001,
  });

  const [currentLocation, setCurrentLocation] = useState({});

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
    let permissionStatus = await MediaLibrary.getPermissionsAsync();
    if (permissionStatus.granted) {
      setMediaPermission(true);
      return true;
    }

    permissionStatus = await MediaLibrary.requestPermissionsAsync();

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

  function artListener() {
    try {
      const q = query(collection(db, "seed_art"));
      let cloudArray: DocumentData[] = [];
      onSnapshot(q, (querySnapshot) => {
        setArt([]);
        querySnapshot.forEach((doc) => {
          const observation = doc.data();
          observation.id = doc.id;
          observation.pinColor = "green";
          const obsObj = new Object(observation);
          cloudArray.push(obsObj);
        });
        setArt(cloudArray);
        cloudArray = [];
      });
    } catch (error) {
      console.error("artListener error:", error);
    }
  }

  async function getPhotos() {
    const albumName = "Camera";
    const getAlbum = await MediaLibrary.getAlbumAsync(albumName);

    const { assets } = await MediaLibrary.getAssetsAsync({
      first: 10,
      album: getAlbum,
      sortBy: ["creationTime"],
      mediaType: ["photo"],
    });

    let picArray = [];

    for (let i = 0; i < assets.length; i++) {
      let assetInformation = await MediaLibrary.getAssetInfoAsync(assets[i]);
      let selectedPic: PhonePic = {
        createdBy: loggedInUser.userName,
        filename: assetInformation.filename,
        url: assetInformation.uri,
        timeCreated: assetInformation.creationTime,
        timeModified: assetInformation.modificationTime,
        description: "",
        latitude: 40.85209694527278,
        longitude: -73.94126596326808,
      };

      if (assetInformation.location !== undefined) {
        selectedPic.latitude = assetInformation.location.latitude;
        selectedPic.longitude = assetInformation.location.longitude;
      }

      picArray.push(selectedPic);
    }

    setPics([...pics, ...picArray]);
  }

  useEffect(() => {
    init();
    return () => {
      cleanUp();
    };
  }, []);

  useEffect(() => {
    artListener();
    return () => {
      setArt([]);
    };
  }, [loggedInUser]);

  async function init() {
    await checkLocationPermission();
    await checkMediaPermission();
    await currentUserListener();
    await artListener();
    await getPhotos();
  }

  function cleanUp() {
    setLocationPermission(false);
    setMediaPermission(false);
    setLoggedInUser(emptyUser);
    setArt([]);
    setPics([]);
    setLoading(true);
  }

  const context = {
    art,
    deviceArt,
    setDeviceArt,
    currentLocation,
    isLoggedIn,
    setLoggedInUser,
    loading,
    locationPermission,
    mediaPermission,
    loggedInUser,
    mapRegion,
    setMapRegion,
    pics,
  };

  return <Context.Provider value={context}>{children}</Context.Provider>;
};

export { Provider, useLocalArtContext };
