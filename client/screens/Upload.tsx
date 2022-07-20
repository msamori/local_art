import { useContext, useRef, useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { TopBar } from "../components";
import { Context } from "../../utils";

import {
  TextInput,
} from "react-native-paper";


function Upload(props) {
  const {
    art,
    currentLocation,
    loading,
    pics,
  } = useContext(Context);

  const [newDescription, setNewDescription] = useState("");

  const renderItem = ({ item }) => {
    return (
      <View>
        <Pressable
          disabled={!newDescription}
          onLongPress={() => {
            addToMap(item);
          }}
        >
          <Image source={{ uri: item.uri }} style={styles.selectedPic} />
          <TextInput
                mode="outlined"
                outlineColor="purple"
                placeholder="add description"
                placeholderTextColor="#aaaaaa"
                onChangeText={(text) => setNewDescription(text)}
                value={newDescription}
                autoCapitalize="none"
              />
        </Pressable>
      </View>
    );
  };

  function addToMap(pic){
    const toAdd = {
      filename: pic.filename,
      description: newDescription,
      latitude: pic.latitude || currentLocation.coords.latitude,
      longitude: pic.longitude || currentLocation.coords.longitude,
      url: pic.uri,
      pinColor: "yellow"
    };
    setNewDescription("");
    art.push(toAdd);
  }

  const keyExtractor = (item) => item.uri;
  const sliderEl = useRef(null);

  if (loading) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <TopBar navigation={props.navigation} />
      <AppIntroSlider
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        data={pics}
        ref={sliderEl}
      />
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
    height: Dimensions.get("window").height * 0.4,
    position: "absolute",
    top: Dimensions.get("window").height * 0.6,
  },
  selectedPic: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.6,
    top: Dimensions.get("window").height * 0.05,
  },
});

export { Upload };
