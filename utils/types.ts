import { ReactNode } from "react";
import { Region } from "react-native-maps";
import * as Location from "expo-location";

type ArtPic = {
  id?: string;
  addedAt: number;
  createdBy: string;
  description: string;
  latitude: number;
  seenBy: string[];
  longitude: number;
  url: string;
  pinColor?: string;
};

type ContextType = {
  art: ArtPic[];
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
  setIsLoggedIn: any;
  setMapRegion(region: Region): void;
  pics: PhonePic[];
};

type PhonePic = {
  filename: string;
  createdBy: string;
  url: string;
  timeCreated?: number;
  timeModified?: number;
  description: string;
  latitude: number;
  longitude: number;
  pinColor?: string;
};

type Props = {
  children?: ReactNode;
};

type UserData = {
  id: string;
  userName: string;
  email: string;
  lastLogin: number;
  lastLogout: number;
  showUploadModal: boolean;
};


export { ArtPic, ContextType, PhonePic, Props, UserData, Region };
