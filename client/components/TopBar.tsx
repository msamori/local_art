import { useContext, useState } from "react";
import { Appbar, Button, Modal, Portal, Text } from "react-native-paper";
import { Dimensions, StyleSheet, View } from "react-native";
import { Context, goAbout, goHome, goLogin, goMap, goUpload } from "../../utils";
import { logoutUser } from "../../firebase";

function TopBar({ navigation }) {
  const { isLoggedIn } = useContext(Context);
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View>
      <Appbar style={styles.top}>
        <Text> Local Art </Text>
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
              goHome(navigation);
              hideModal();
            }}
            disabled={!isLoggedIn}
          >
            HOME
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
              goMap(navigation);
              hideModal();
            }}
            disabled={!isLoggedIn}
          >
            MAP
          </Button>
          <Button
            onPress={() => {
              goLogin(navigation);
              hideModal();
            }}
            disabled={isLoggedIn}
          >
            LOGIN / REGISTER
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
    backgroundColor: "black",
    color: "purple",
    position: "absolute",
    left: 200,
    right: 0,
    top: 50,
  },
  top: {
    flex: 1,
    justifyContent: "space-between",
    position: "absolute",
    left: 0,
    right: 0,
    top: Dimensions.get("window").height * 0.05,
    height: Dimensions.get("window").height * 0.05,
    zIndex: 3,
    elevation: 3,
  },
});
