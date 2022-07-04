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

export { MapRegion, UserData };
