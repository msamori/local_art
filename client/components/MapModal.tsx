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
      seenBy: [loggedInUser.id]
    };

    deviceArt.splice(index, 1);

    await uploadPhotoToStorage(data, pic.url);
    setIsUploading(false);
    func();
  }

  return (
    <View>
      <Image source={{ uri: pic.url }} style={styles.selectedPic} />
      <Text style={styles.description}>{pic.description}</Text>
      {pic.pinColor === "yellow" ? (
        <>
          <Button onPress={upload}> UPLOAD </Button>
          <ActivityIndicator animating={isUploading} />
        </>
      ) : (
        <>
          <Text style={styles.description}>Added by: {pic.createdBy}</Text>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  description: {
    backgroundColor: "white",
    color: "black",
  },
  selectedPic: {
    width: Dimensions.get("window").width * 0.6,
    height: Dimensions.get("window").height * 0.3,
  },
});

export { MapModal };
