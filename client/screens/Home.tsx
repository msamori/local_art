import { useContext, useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { HomeImage, Map, TopBar } from "../components";
import { Context } from "../../utils/state"

function Home(props) {

  const globalState = useContext(Context);

  return (
    <View style={styles.container}>
      <TopBar navigation={props.navigation} />
      <HomeImage style={styles.selectedPic}/>
      <Map style={styles.map}/>
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
    height: Dimensions.get("window").height * .4,
    position: "absolute",
    bottom: 0,
  },
  selectedPic: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * .6,
    top: Dimensions.get("window").height * .10,
  },
});

export { Home };
