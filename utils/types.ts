type Region = {
  latitude: Number,
  longitude: Number,
  latitudeDelta: Number,
  longitudeDelta: Number,
}

interface UserData {
  id: string;
  email: string;
  lastLogin?: number;
  lastLogout?: number;
}
type ArtPic = {
  id: string;
  latitude: number;
  longitude: number;
  url: string;
}

export { ArtPic, UserData, Region };
