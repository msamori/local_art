import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Context } from "./utils";
import { About, Home, Login } from "./client/screens";

function Routes() {
  const Stack = createNativeStackNavigator();

  const { loading, isLoggedIn } = useContext(Context);

  const navOptions = {
    headerShown: false,
    gestureEnabled: true,
  };

  if (loading) {
    return (
      <></>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={navOptions}>
        { isLoggedIn ? (
          <>
        <Stack.Screen name="Home" component={Home} />
        </>
        ) : (
        <Stack.Screen name="Login" component={Login} />
        )}
        <Stack.Screen name="About" component={About} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export { Routes };
