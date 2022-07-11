interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface UserData {
  id: string;
  email: string;
  lastLogin?: number;
  lastLogout?: number;
}
interface ArtPic {
  id: string;
  latitude: number;
  longitude: number;
  url: string;
}

export { ArtPic, MapRegion, UserData };
