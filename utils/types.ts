type Region = {
  latitude: number,
  longitude: number,
  latitudeDelta: number,
  longitudeDelta: number,
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
