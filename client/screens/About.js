import { View, StyleSheet } from "react-native";
import { Text } from "react-native-paper";
import { TopBar } from "../components/TopBar";

function About(props) {
  return (
    <View style={styles.container}>
      <TopBar navigation={props.navigation} />
      <Text> About the app and me </Text>
    </View>
  );
}

export { About };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
});
