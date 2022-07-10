import "react-native-gesture-handler";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { DefaultTheme, Provider as PaperProvider } from "react-native-paper";
import { onAuthStateChanged } from "firebase/auth";
import { About, Home, Login, Register } from "./client/screens";
import { Provider } from "./utils";
import { getLoggedInUserData } from "./firebase";
import { auth } from "./firebase/config";

export default function App() {
  const Stack = createNativeStackNavigator();
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  const theme = {
    ...DefaultTheme,
    dark: true,
    version: 3,
    colors: {
      ...DefaultTheme.colors,
      primary: "purple",
      background: "black",
      text: "white",
    },
  };

  const navOptions = {
    headerShown: false,
    gestureEnabled: true,
  };

  async function currentUserListener() {
    try {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userData = await getLoggedInUserData(user.uid);
          console.log("currentUserListener user:", userData);
          setUser(userData);
          setLoading(false);
        } else {
          console.log("currentUserListener: no user logged in.");
          setLoading(false);
        }
        return unsubscribe;
      });
    } catch (error) {
      console.error("currentUserListener error:", error);
    }
  }

  useEffect(() => {
    currentUserListener();
    return () => {
      setUser(null);
    };
  }, []);

  if (loading) {
    return (
      <></>
    )
  }

  return (
    <Provider>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={navOptions}>
            { user ? (
              <>
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            </>
            ) : (
            <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            </>
            )}
            <Stack.Screen name="About" component={About} />
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  );
}
