import { useEffect, useState } from "react";
import * as MediaLibrary from "expo-media-library";
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
import { UploadModal, TextInput } from "../components";
import { useLocalArtContext } from "../../utils";
import { PhonePic } from "../../utils/types";

function Upload() {
  const {
    currentLocation,
    deviceArt,
    loggedInUser,
    setLoggedInUser,
    setDeviceArt,
  } = useLocalArtContext();

  const [newDescription, setNewDescription] = useState("");
  const [pics, setPics] = useState<PhonePic[]>([]);

  async function getPhotos() {
    const albumName = "Camera";
    const getAlbum = await MediaLibrary.getAlbumAsync(albumName);

    const { assets } = await MediaLibrary.getAssetsAsync({
      first: 10,
      album: getAlbum,
      sortBy: ["creationTime"],
      mediaType: ["photo"],
    });

    let picArray = [];

    for (let i = 0; i < assets.length; i++) {
      let assetInformation = await MediaLibrary.getAssetInfoAsync(assets[i]);
      let selectedPic: PhonePic = {
        createdBy: loggedInUser.userName,
        filename: assetInformation.filename,
        url: assetInformation.uri,
        timeCreated: assetInformation.creationTime,
        timeModified: assetInformation.modificationTime,
        description: "",
        latitude: 40.85209694527278,
        longitude: -73.94126596326808,
      };

      if (assetInformation.location !== undefined) {
        selectedPic.latitude = assetInformation.location.latitude;
        selectedPic.longitude = assetInformation.location.longitude;
      }

      picArray.push(selectedPic);
    }

    setPics([...pics, ...picArray]);
  }

  function hideModal() {
    setLoggedInUser({ ...loggedInUser, showUploadModal: false });
  }

  useEffect(()=>{
    getPhotos();
    return ()=>{
      setPics([])
    }
  }, [])

  const renderItem = ({ item }:any) => {
    return (
      <View style={styles.container}>
        <Pressable
        android_ripple={{color: 'blue', borderless: false, foreground: true}}
          disabled={!newDescription}
          onPress={() => {
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
    backgroundColor: "#F3F7d4",
    flexDirection: "column",
  },
  input: {
    bottom: Dimensions.get("window").height * 0.2,
    width: Dimensions.get("window").width * 0.9,
    alignSelf: "center",
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
    marginTop: 20,
    marginBottom: 20,
  },
});


export { Upload };
