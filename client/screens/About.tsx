import { Dimensions, View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { TopBar } from "../components";

function About(props) {
  return (
    <View style={styles.container}>
      <TopBar navigation={props.navigation} />
      <View style={styles.inputs}>
      <Text> About the app and me </Text>
      </View>
    </View>
  );
}

export { About };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "space-between"
  },
  inputs: {
    flex: 1,
    justifyContent: "center",
    top: Dimensions.get("window").height * .10,
  }
});
