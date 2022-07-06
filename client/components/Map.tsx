import { useContext } from "react";
import { Dimensions, StyleSheet } from "react-native";
import MapView from "react-native-maps";
import { Context } from "../../utils";


function Map({style}) {

  const globalState = useContext(Context);

  return (
    <MapView
        style={style}
        initialRegion={globalState.mapRegion}
      ></MapView>
  )
}

export { Map }
