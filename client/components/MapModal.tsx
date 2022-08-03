import { useState } from "react";
import { ActivityIndicator, Text } from "react-native-paper";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import { uploadPhotoToStorage } from "../../firebase";
import { useLocalArtContext } from "../../utils";
import { PhonePic } from "../../utils/types";

type Props = {
  pic: PhonePic;
  func(): void;
};

function MapModal({ pic, func }: Props) {
  const { deviceArt, setDeviceArt, loggedInUser } = useLocalArtContext();
  const [isUploading, setIsUploading] = useState(false);

  async function upload() {
    setIsUploading(true);

    let data = {
      addedAt: Date.now(),
      description: pic.description,
      latitude: pic.latitude,
      longitude: pic.longitude,
      createdBy: loggedInUser.userName,
      seenBy: [loggedInUser.id],
      url: "",
    };

    setDeviceArt(
      deviceArt.filter((item: PhonePic) => item.url !== pic.url)
    );

    await uploadPhotoToStorage(data, pic.url);
    setIsUploading(false);
    func();
  }

  function remove() {
    setDeviceArt(
      deviceArt.filter((item: PhonePic) => item.url !== pic.url)
    );
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
            <Text style={styles.bold}>  — {pic.createdBy}</Text>
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
    color: "white",
    margin: 0.5,
    textAlign: "center",
  },
  upload: {
    display: "flex",
    fontWeight: "bold",
    color: "white",
    margin: 0.5,
    alignSelf: "center",
    alignContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#340926",
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
