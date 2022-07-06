import { useState } from "react";
import { Dimensions, View, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { loginUser } from "../../firebase";
import { goHome } from "../../utils";
import { TopBar } from "../components";

function Login(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onLoginPress() {
    await loginUser(email, password);
    setEmail("");
    setPassword("");
    goHome(props.navigation)
  }

  return (
    <View style={styles.container}>
      <TopBar navigation={props.navigation} />
      <View style={styles.inputs}>
      <TextInput
        mode="outlined"
        outlineColor="purple"
        placeholder="E-mail"
        placeholderTextColor="#aaaaaa"
        onChangeText={(text) => setEmail(text)}
        value={email}
        autoCapitalize="none"
      />
      <TextInput
        mode="outlined"
        outlineColor="purple"
        secureTextEntry
        placeholder="Password"
        placeholderTextColor="#aaaaaa"
        onChangeText={(text) => setPassword(text)}
        value={password}
        autoCapitalize="none"
      />
      <Button onPress={() => onLoginPress()}>Login</Button>
      </View>
    </View>
  );
}

export { Login };

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
