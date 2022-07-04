import { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import { ActivityIndicator } from "react-native-paper";
import { TopBar } from "../components/TopBar";

function Home(props) {
  return (
    <View style={styles.container}>
      <TopBar navigation={props.navigation} />
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 40.85209694527278,
          longitude: -73.94126596326808,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      ></MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height / 2.5,
    position: "absolute",
    bottom: 0,
  },
});

export { Home };
