import { useContext, useState } from "react";
import { Appbar, Button, Modal, Portal, Text } from "react-native-paper";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  Context,
  goAbout,
  goLogin,
  goMap,
  goRegister,
  goUpload,
} from "../../utils";
import { logoutUser } from "../../firebase";

function TopBar({ navigation }) {
  const { isLoggedIn } = useContext(Context);
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View>
      <Appbar style={styles.top}>
        <Appbar.Action icon="menu" onPress={showModal} />
      </Appbar>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <Button
            onPress={() => {
              goMap(navigation);
              hideModal();
            }}
            disabled={!isLoggedIn}
          >
            MAP
          </Button>
          <Button
            onPress={() => {
              goUpload(navigation);
              hideModal();
            }}
            disabled={!isLoggedIn}
          >
            UPLOAD
          </Button>
          <Button
            onPress={() => {
              goLogin(navigation);
              hideModal();
            }}
            disabled={isLoggedIn}
          >
            LOGIN
          </Button>
          <Button
            onPress={() => {
              goRegister(navigation);
              hideModal();
            }}
            disabled={isLoggedIn}
          >
            Register
          </Button>
          <Button
            onPress={() => {
              goAbout(navigation);
              hideModal();
            }}
          >
            ABOUT
          </Button>
          <Button
            onPress={async () => {
              await logoutUser();
              hideModal();
            }}
            disabled={!isLoggedIn}
          >
            LOGOUT
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

export { TopBar };

const styles = StyleSheet.create({
  modal: {
    position: "absolute",
    left: 100,
    right: 100,
    top: 50,
  },
  top: {
    flex: 1,
    justifyContent: "center",
    position: "absolute",
    backgroundColor: "transparent",
    top: Dimensions.get("window").height * 0.06,
    left: Dimensions.get("window").width * 0.03,
    height: Dimensions.get("window").height * 0.05,
    width: Dimensions.get("window").width * 0.11,
    zIndex: 3,
    elevation: 3,
  },
});
