import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { About, Home, Login, Register } from "./client/screens"

export default function App() {

  const Stack = createNativeStackNavigator();

  const theme = {
    ...DefaultTheme,
    dark: true,
    version: 3,
    colors: {
      ...DefaultTheme.colors,
      primary: "purple",
      background: "black",
      text: "white"
    },
  };

  const navOptions = {
    headerShown: false,
    gestureEnabled: true
    }

  return (
    <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={navOptions}>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="About" component={About} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
  );
}
