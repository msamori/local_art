import { useContext } from "react";
import { Dimensions, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { Context } from "../../utils";


function Map() {

  const globalState = useContext(Context);

  return (
    <MapView
        style={styles.map}
        initialRegion={globalState.mapRegion}
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
