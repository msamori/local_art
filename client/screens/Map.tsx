import MapView from "react-native-maps";
import { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  Modal,
  Portal,
  Text,
  TextInput,
} from "react-native-paper";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { TopBar } from "../components";
import { uploadPhotoToStorage } from "../../firebase";
import { Context } from "../../utils";


function Map(props) {
  const { art, mapRegion, pics, setMapRegion } = useContext(Context);

  const [visible, setVisible] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [imageDescription, setImageDescription] = useState("");
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const [newDescription, setNewDescription] = useState("");
  const [uploadItem, setUploadItem] = useState({});

  const modal = StyleSheet.create({
    container: {
      width: Dimensions.get("window").width * 0.4,
      height: Dimensions.get("window").height * 0.2,
      position: "absolute",
      top: touchPosition.y / 2.8,
      left: touchPosition.x / 2.6,
    },
    description: {
      backgroundColor: "black",
      color: "purple",
    },
  });

  function showModal(evt, item) {
    let source = item.url ? item.url : item.uri;
    if (item.description) setImageDescription(item.description);
    if (!item.description){
      setUploadItem(item);
    }
    setTouchPosition(evt.nativeEvent.position);
    setImageURL(source);
    setVisible(true);
  }

  function hideModal() {
    setVisible(false);
    setImageDescription("");
    setNewDescription("");
  }

  async function photoUpload(){
    setIsUploading(true);
    const data = {
      description: newDescription,
      filename: uploadItem.filename,
      latitude: uploadItem.latitude,
      longitude: uploadItem.longitude,
    }
    setNewDescription("");
    await uploadPhotoToStorage(data, uploadItem.uri);
    setUploadItem({});
    setIsUploading(false);
    hideModal();
  }

  return (
    <View style={styles.container}>
      <TopBar navigation={props.navigation} />
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={modal.container}
        >
          <Image source={{ uri: imageURL }} style={styles.selectedPic} />
          {imageDescription ? (
            <>
            <Text style={modal.description}>{imageDescription}</Text>
            </>
          ) : (
            <>
              <TextInput
                mode="outlined"
                outlineColor="purple"
                placeholder="add description"
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setNewDescription(text)}
                value={newDescription}
                autoCapitalize="none"
              />
              <Button
              disabled={!newDescription}
              onPress={() => photoUpload()}>
                Upload
              </Button>
              <ActivityIndicator animating={isUploading} />
            </>
          )}
        </Modal>
      </Portal>
      <MapView
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
        moveOnMarkerPress={false}
        onRegionChangeComplete={(region) => {
          setMapRegion(region);
        }}
      >
        {pics.map((pic, idx) => {
          return (
            <MapView.Marker
              pinColor={"yellow"}
              key={idx}
              coordinate={{
                latitude: pic.latitude,
                longitude: pic.longitude,
              }}
              onPress={(evt) => {
                showModal(evt, pic);
              }}
            />
          );
        })}
        {art.map((pic, idx) => {
          return (
            <MapView.Marker
              pinColor={"green"}
              key={idx}
              coordinate={{
                latitude: pic.latitude,
                longitude: pic.longitude,
              }}
              onPress={(evt) => {
                showModal(evt, pic);
              }}
            />
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * .96,
    position: "absolute",
    bottom: 0,
  },
  selectedPic: {
    width: Dimensions.get("window").width * 0.4,
    height: Dimensions.get("window").height * 0.2,
  },
});

export { Map };
