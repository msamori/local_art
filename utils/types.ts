import { ReactNode } from "react";

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


export { ArtPic, PhonePic, Props, UserData, Region };
