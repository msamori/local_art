import { ReactNode } from "react";

type ContextType = {
  art: object[];
  deviceArt: PhonePic[];
  setDeviceArt(art: PhonePic[]): void;
  currentLocation: object;
  isLoggedIn: boolean;
  setLoggedInUser(user: UserData): void;
  loading: boolean;
  locationPermission: boolean;
  mediaPermission: boolean;
  loggedInUser: UserData;
  mapRegion: object;
  setMapRegion(region: object): void;
  pics: object[];
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

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};
type UserData = {
  id: string;
  userName: string;
  email: string;
  lastLogin: number;
  lastLogout: number;
  showUploadModal: boolean;
};
type ArtPic = {
  id?: string;
  addedAt: number;
  createdBy: string;
  description: string;
  latitude: number;
  seenBy: string[];
  longitude: number;
  url: string;
};

export { ArtPic, ContextType, Props, PhonePic, UserData, Region };
