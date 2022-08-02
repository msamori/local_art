import { useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";
import { createNewUser } from "../../firebase";
import { Button, TextInput } from "../components";
import { emailValidator, nameValidator, passwordValidator } from "../../utils";
import { useNavigation } from "@react-navigation/native";

function Register() {
  const [userName, setUserName] = useState({ value: "", error: "" });
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  const navigation = useNavigation();

  async function onRegisterPress() {
    const userNameError = nameValidator(userName.value);
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError || userNameError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setUserName({ ...userName, error: userNameError });
      return;
    } else {
      await createNewUser(email.value, password.value, userName.value);
      setEmail({ value: "", error: "" });
      setPassword({ value: "", error: "" });
      setUserName({ value: "", error: "" });
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputs}>
        <TextInput
          label="User name"
          returnKeyType="next"
          value={userName.value}
          onChangeText={(text) => setUserName({ value: text, error: "" })}
          error={!!userName.error}
          errorText={userName.error}
          autoCapitalize="none"
        />
        <TextInput
          label="Email"
          returnKeyType="next"
          value={email.value}
          error={!!email.error}
          errorText={email.error}
          onChangeText={(text) => setEmail({ value: text, error: "" })}
          autoCapitalize="none"
          textContentType="emailAddress"
          keyboardType="email-address"
        />
        <TextInput
          label="Password"
          returnKeyType="done"
          value={password.value}
          onChangeText={(text) => setPassword({ value: text, error: "" })}
          error={!!password.error}
          errorText={password.error}
          secureTextEntry
          autoCapitalize="none"
        />
        <Button
          mode="contained"
          onPress={() => onRegisterPress()}
          disabled={!userName || !password || !email}
        >
          Register
        </Button>
        <View style={styles.row}>
          <Text> Have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.link}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export { Register };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F7d4",
  },
  inputs: {
    flex: 1,
    padding: 20,
    width: "100%",
    justifyContent: "center",
    top: Dimensions.get("window").height * 0.1,
  },
  link: {
    fontWeight: "bold",
  },
  row: {
    flexDirection: "row",
    marginTop: 4,
  }
});
