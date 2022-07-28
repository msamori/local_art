import { useState } from "react";
import { Appbar, Button, Modal, Portal } from "react-native-paper";
import { Dimensions, StyleSheet, View } from "react-native";
import {
  useLocalArtContext,
  goLogin,
  goMap,
  goRegister,
  goUpload,
} from "../../utils";
import { logoutUser } from "../../firebase";
import { useNavigation } from "@react-navigation/native";

function AltTopBar() {
  const { isLoggedIn } = useLocalArtContext();
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const navigation = useNavigation();

  return (
    <View>
      <Appbar style={styles.top}>
        <Appbar.Action
          color={"#F3F7D4"}
          size={36}
          icon="menu"
          onPress={showModal}
        />
      </Appbar>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          {isLoggedIn ? (
            <>
              <Button
                onPress={() => {
                  goMap(navigation);
                  hideModal();
                }}
                disabled={!isLoggedIn}
                color={"#F3F7D4"}
              >
                MAP
              </Button>
              <Button
                onPress={() => {
                  goUpload(navigation);
                  hideModal();
                }}
                disabled={!isLoggedIn}
                color={"#F3F7D4"}
              >
                UPLOAD
              </Button>
              <Button
                onPress={async () => {
                  await logoutUser();
                  hideModal();
                }}
                disabled={!isLoggedIn}
                color={"#F3F7D4"}
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
                color={"#F3F7D4"}
              >
                LOGIN
              </Button>
              <Button
                onPress={() => {
                  goRegister(navigation);
                  hideModal();
                }}
                disabled={isLoggedIn}
                color={"#F3F7D4"}
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

export { AltTopBar };

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
