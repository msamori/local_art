import { useContext, useState } from "react";
import { Appbar, Button, Modal, Portal, Text } from "react-native-paper";
import { Dimensions, StyleSheet, View } from "react-native";
import { Context, goAbout, goHome, goLogin, goRegister } from "../../utils";
import { logoutUser } from "../../firebase";

function TopBar({ navigation }) {

  const { isLoggedIn, setIsLoggedIn } = useContext(Context);
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
            onPress={ async () => {
              setIsLoggedIn(false);
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
    top: Dimensions.get("window").height * .05,
    height: Dimensions.get("window").height * .05,
    zIndex: 3,
    elevation: 3
  },
});
