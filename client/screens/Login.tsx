import { useState } from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, Headline } from "react-native-paper";
import { loginUser } from "../../firebase";
import { Button, TextInput, TopBar } from "../components";
import { emailValidator, passwordValidator } from "../../utils";

function Login(props) {
  const [email, setEmail] = useState({ value: "", error: "" });
  const [password, setPassword] = useState({ value: "", error: "" });

  async function onLoginPress() {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    } else {
      await loginUser(email.value, password.value);
      setEmail({ value: "", error: "" });
      setPassword({ value: "", error: "" });
    }
  }

  return (
    <View style={styles.container}>
      <TopBar navigation={props.navigation} />
      <Headline style={styles.title}> Local Art </Headline>
      <View style={styles.inputs}>
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
        <Button mode="contained" onPress={() => onLoginPress()}>
          Login
        </Button>
        <View style={styles.row}>
          <Text> Don't have an account? </Text>
          <TouchableOpacity
            onPress={() => props.navigation.navigate("Register")}
          >
            <Text style={styles.link}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export { Login };

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
  },
  title: {
    top: Dimensions.get("window").height * 0.2,
    padding: 10,
  },
});
