import { useContext, useState } from "react";
import { ActivityIndicator, Button, Text } from "react-native-paper";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { uploadPhotoToStorage } from "../../firebase";
import { Context } from "../../utils";

function MapModal({ pic, index, func }) {
  const { deviceArt, loggedInUser, pics } = useContext(Context);
  const [isUploading, setIsUploading] = useState(false);

  async function upload() {
    setIsUploading(true);

    let data = {
      filename: pic.filename,
      description: pic.description,
      latitude: pic.latitude,
      longitude: pic.longitude,
      createdBy: loggedInUser.userName,
      seenBy: [loggedInUser.id],
    };

    deviceArt.splice(index, 1);

    await uploadPhotoToStorage(data, pic.url);
    setIsUploading(false);
    func();
  }

  return (
    <View style={styles.container}>
      <Image source={{ uri: pic.url }} style={styles.selectedPic} />
      <Text>{pic.description}</Text>
      {pic.pinColor === "yellow" ? (
        <>
          <Button onPress={upload}> UPLOAD </Button>
          <ActivityIndicator animating={isUploading} />
        </>
      ) : (
        <>
          <Text>Added by: {pic.createdBy}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  selectedPic: {
    resizeMode: "cover",
    width: Dimensions.get("window").width * 0.6,
    height: Dimensions.get("window").height * 0.3,
  },
});

export { MapModal };
