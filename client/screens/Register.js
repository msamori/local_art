import { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { createNewUser } from "../../firebase";
import { TopBar } from "../components/TopBar";

function Register(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function onRegisterPress() {
    await createNewUser(email, password);
  }

  return (
    <View style={styles.container}>
      <TopBar navigation={props.navigation} />
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
      <Button onPress={() => onRegisterPress()}>Register</Button>
    </View>
  );
}

export { Register };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
  },
});
