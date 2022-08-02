import { useState } from "react";
import { Appbar, Menu } from "react-native-paper";
import { StatusBar} from "react-native";
import {
  useLocalArtContext,
  goLogin,
  goMap,
  goRegister,
  goUpload,
} from "../../utils";
import { logoutUser } from "../../firebase";

function AltTopBar({ navigation }) {
  const { isLoggedIn } = useLocalArtContext();
  const [visible, setVisible] = useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
      <Appbar.Header statusBarHeight={0}>
        <StatusBar backgroundColor="#340926" barStyle="light-content"/>
        <Appbar.Content title="Local Art" />
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <Appbar.Action
              icon={visible ? "close" : "menu"}
              color="white"
              onPress={openMenu}
            />
          }
        >
          {isLoggedIn ? (
            <>
              <Menu.Item
                onPress={() => {
                  goMap(navigation);
                  closeMenu();
                }}
                title="Map"
                disabled={!isLoggedIn}
              />
              <Menu.Item
                onPress={() => {
                  goUpload(navigation);
                  closeMenu();
                }}
                title="Upload"
                disabled={!isLoggedIn}
              />
              <Menu.Item
                onPress={async () => {
                  await logoutUser();
                  closeMenu();
                }}
                title="Logout"
                disabled={!isLoggedIn}
              />
            </>
          ) : (
            <>
              <Menu.Item
                onPress={async () => {
                  goLogin(navigation);
                  closeMenu();
                }}
                title="Login"
                disabled={isLoggedIn}
              />
              <Menu.Item
                onPress={async () => {
                  goRegister(navigation);
                  closeMenu();
                }}
                title="Register"
                disabled={isLoggedIn}
              />
            </>
          )}
        </Menu>
      </Appbar.Header>
  );
}

export { AltTopBar };
