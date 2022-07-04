import { useState } from "react";
import { Appbar, Button, Modal, Portal, Text } from "react-native-paper";
import { StyleSheet } from "react-native";
import { goAbout, goHome, goLogin, goRegister } from "../../utils";

function TopBar({ navigation }) {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <>
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
          >
            HOME
          </Button>
          <Button
            onPress={() => {
              goLogin(navigation);
              hideModal();
            }}
          >
            LOGIN
          </Button>
          <Button
            onPress={() => {
              goRegister(navigation);
              hideModal();
            }}
          >
            REGISTER
          </Button>
          <Button
            onPress={() => {
              goAbout(navigation);
              hideModal();
            }}
          >
            ABOUT
          </Button>
        </Modal>
      </Portal>
    </>
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
    top: 30,
  },
});
