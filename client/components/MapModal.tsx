import { useContext, useState } from "react";
import { ActivityIndicator, Text } from "react-native-paper";
import { Dimensions, Image, StyleSheet, Pressable, View } from "react-native";
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

  function remove() {
    deviceArt.splice(index, 1);
    func();
  }

  return (
    <>
      <View style={styles.container}>
        <Image source={{ uri: pic.url }} style={styles.selectedPic} />
        <Text style={styles.bold}>"{pic.description}"</Text>
        {pic.pinColor === "yellow" ? (
          <>
            <View style={styles.row}>
              <Pressable onPress={upload}>
                <Text style={styles.upload}> * UPLOAD * </Text>
              </Pressable>
              <Pressable onPress={remove}>
                <Text style={styles.upload}> * REMOVE * </Text>
              </Pressable>
            </View>
          </>
        ) : (
          <View style={styles.row}>
            <Text style={styles.bold}>-{pic.createdBy}</Text>
          </View>
        )}
      </View>
      <ActivityIndicator animating={isUploading} />
    </>
  );
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
    color: "#F3F7D4",
    margin: 0.5,
    textAlign: "center",
  },
  upload: {
    display: "flex",
    fontWeight: "bold",
    color: "#B81484",
    margin: 0.5,
    alignSelf: "center",
    alignContent: "center",
  },
  buttonContainer: {
    width: Dimensions.get("window").width * 0.6,
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  selectedPic: {
    resizeMode: "cover",
    width: Dimensions.get("window").width * 0.6,
    height: Dimensions.get("window").height * 0.3,
  },
});

export { MapModal };
