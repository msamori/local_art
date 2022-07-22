import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Context } from "./utils";
import { Login, Map, Upload, Register } from "./client/screens";

function Routes() {
  const Stack = createNativeStackNavigator();

  const { loading, isLoggedIn } = useContext(Context);

  const navOptions = {
    headerShown: false,
    gestureEnabled: true,
  };

  if (loading) {
    return <></>;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={navOptions}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Map" component={Map} />
            <Stack.Screen name="Upload" component={Upload} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export { Routes };
