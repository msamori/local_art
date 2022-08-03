import React, { useState, useEffect } from 'react';
import { Dimensions, Image, Keyboard, Pressable, StyleSheet, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalArtContext } from "../../utils";
import { PhonePic } from "../../utils/types";
import { TextInput } from "../components/TextInput";

function PhotoSelector({func}) {
  const [image, setImage] = useState(null);
  const [newDescription, setNewDescription] = useState("");

  const {currentLocation, deviceArt, setDeviceArt} = useLocalArtContext();

  function addToMap(pic: PhonePic) {
    const toAdd: PhonePic = {
      createdBy: "",
      filename: "",
      description: newDescription,
      latitude: pic.exif.GPSLatitude || currentLocation.coords.latitude,
      longitude: pic.exif.GPSLongitude || currentLocation.coords.longitude,
      url: pic.uri,
      pinColor: "yellow",
    };
    setNewDescription("");
    Keyboard.dismiss();
    setDeviceArt([...deviceArt, toAdd]);
    func();
  }

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      exif: true
    });

    if (!result.cancelled) {

      setImage(result);
    } else {
      func();
    }
  };

  useEffect(()=>{
    pickImage()
  }, []);



  return (
    <View style={styles.container}>
      {image &&

      <Pressable
        android_ripple={{color: 'blue', borderless: false, foreground: true}}
          disabled={!newDescription}
          onPress={() => {
            addToMap(image);
          }}
        >
      <Image source={{ uri: image.uri }} style={styles.selectedPic} />
      </Pressable>}
      {image && <TextInput
        placeholder="Description"
        returnKeyType="done"
        onChangeText={(text) => setNewDescription(text)}
        value={newDescription}
        autoCapitalize="none"
        style={styles.input}
      />}
    </View>
  );
}

export { PhotoSelector }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    position: "absolute",
    top: Dimensions.get("window").height * 0.02,
    width: Dimensions.get("window").width * 0.6,
    alignSelf: "center",

  },
  selectedPic: {
    resizeMode: "contain",
    width: Dimensions.get("window").width * 0.6,
    height: Dimensions.get("window").height * 0.3,
  },
});
