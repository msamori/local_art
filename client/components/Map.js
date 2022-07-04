import { useState } from "react";
import { Dimensions, StyleSheet } from "react-native";
import MapView from "react-native-maps";


function Map() {

  const [mapRegion, setMapRegion] = useState({
    latitude: 40.85209694527278,
    longitude: -73.94126596326808,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  })

  return (
    <MapView
        style={styles.map}
        initialRegion={mapRegion}
      ></MapView>
  )
}

export { Map }

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2.5,
    position: "absolute",
    bottom: 0,
  },
});
