import { useContext, useState } from "react";
import { Appbar, Button, Modal, Portal } from "react-native-paper";
import { Dimensions, StyleSheet, View } from "react-native";
import { Context, goLogin, goMap, goRegister, goUpload } from "../../utils";
import { logoutUser } from "../../firebase";

function TopBar({ navigation, inputStyles = null }) {
  const { isLoggedIn } = useContext(Context);
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return (
    <View>
      <Appbar style={styles.top}>
        <Appbar.Action
          color={inputStyles ? inputStyles.topButtons.color : "#340926"}
          size={36}
          icon="menu"
          onPress={showModal}
        />
      </Appbar>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={
            inputStyles ? inputStyles.topModal : styles.modal
          }
        >
          {isLoggedIn ? (
            <>
              <Button
                onPress={() => {
                  goMap(navigation);
                  hideModal();
                }}
                disabled={!isLoggedIn}
                color={inputStyles ? inputStyles.topButtons.color : "#340926"}
              >
                MAP
              </Button>
              <Button
                onPress={() => {
                  goUpload(navigation);
                  hideModal();
                }}
                disabled={!isLoggedIn}
                color={inputStyles ? inputStyles.topButtons.color : "#340926"}
              >
                UPLOAD
              </Button>
              <Button
                onPress={async () => {
                  await logoutUser();
                  hideModal();
                }}
                disabled={!isLoggedIn}
                color={inputStyles ? inputStyles.topButtons.color : "#340926"}
              >
                LOGOUT
              </Button>
            </>
          ) : (
            <>
              <Button
                onPress={() => {
                  goLogin(navigation);
                  hideModal();
                }}
                disabled={isLoggedIn}
                color={inputStyles ? inputStyles.topButtons.color : "#340926"}
              >
                LOGIN
              </Button>
              <Button
                onPress={() => {
                  goRegister(navigation);
                  hideModal();
                }}
                disabled={isLoggedIn}
                color={inputStyles ? inputStyles.topButtons.color : "#340926"}
              >
                Register
              </Button>
            </>
          )}
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
