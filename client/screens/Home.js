import { StyleSheet, View } from "react-native";
import { Map, TopBar } from "../components";

function Home(props) {

  return (
    <View style={styles.container}>
      <TopBar navigation={props.navigation} />
      <Map />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
});

export { Home };
