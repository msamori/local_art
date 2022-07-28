import { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { Modal, Portal } from "react-native-paper";
import AppIntroSlider from "react-native-app-intro-slider";
import { UploadModal, AltTopBar, TextInput } from "../components";
import { useLocalArtContext } from "../../utils";
import { PhonePic } from "../../utils/types";

function Upload() {
  const {
    currentLocation,
    deviceArt,
    loggedInUser,
    pics,
    setLoggedInUser,
    setDeviceArt,
  } = useLocalArtContext();

  const [newDescription, setNewDescription] = useState("");

  function hideModal() {
    setLoggedInUser({ ...loggedInUser, showUploadModal: false });
  }

  const renderItem = ({ item }:any) => {
    return (
      <View style={styles.container}>
        <Pressable
          disabled={!newDescription}
          onLongPress={() => {
            addToMap(item);
          }}
        >
          <Image source={{ uri: item.url }} style={styles.selectedPic} />
        </Pressable>
      </View>
    );
  };

  function addToMap(pic: PhonePic) {
    const toAdd: PhonePic = {
      createdBy: "",
      filename: pic.filename,
      description: newDescription,
      latitude: pic.latitude || currentLocation.coords.latitude,
      longitude: pic.longitude || currentLocation.coords.longitude,
      url: pic.url,
      pinColor: "yellow",
    };
    setNewDescription("");
    Keyboard.dismiss();
    setDeviceArt([...deviceArt, toAdd]);
  }

  const keyExtractor = (item: any) => item.filename;

  return (
    <View style={styles.container}>
      <AltTopBar />
      <Portal>
        <Modal
          visible={loggedInUser.showUploadModal}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <UploadModal />
        </Modal>
      </Portal>
      <AppIntroSlider
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderPagination={() =>(<></>)}
        data={pics}
      />
      <TextInput
        placeholder="Description"
        returnKeyType="done"
        onChangeText={(text) => setNewDescription(text)}
        value={newDescription}
        autoCapitalize="none"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    flexDirection: "column",
  },
  input: {
    bottom: Dimensions.get("window").height * 0.35,
    width: Dimensions.get("window").width * 0.9,
    alignSelf: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.25,
    position: "absolute",
    top: Dimensions.get("window").height * 0.7,
  },
  modal: {
    width: Dimensions.get("window").width * 0.6,
    position: "absolute",
    top: Dimensions.get("window").height * 0.075,
    left: Dimensions.get("window").width * 0.2,
  },
  selectedPic: {
    resizeMode: "contain",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.6,
  },
});


export { Upload };
