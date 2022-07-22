import { useContext, useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
} from "react-native";
import AppIntroSlider from "react-native-app-intro-slider";
import { TopBar, TextInput } from "../components";
import { Context } from "../../utils";

function Upload(props) {
  const { currentLocation, deviceArt, loading, pics } = useContext(Context);

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
        </Pressable>
      </View>
    );
  };

  function addToMap(pic) {
    const toAdd = {
      filename: pic.filename,
      description: newDescription,
      latitude: pic.latitude || currentLocation.coords.latitude,
      longitude: pic.longitude || currentLocation.coords.longitude,
      url: pic.uri,
      pinColor: "yellow",
    };
    setNewDescription("");
    Keyboard.dismiss();
    deviceArt.push(toAdd);
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
        renderPagination={(activeIndex) => (
          <RenderPagination
            data={pics}
            activeIndex={activeIndex}
            slider={sliderEl.current}
            onIntroCompleted={() => {
              console.log("complete");
            }}
          />
        )}
        data={pics}
        ref={sliderEl}
      />
      <TextInput
        label="Description"
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
  },
  input: {
    bottom: 200,
    width: Dimensions.get("window").width * 0.9,
    alignSelf: "center",
  },
  selectedPic: {
    resizeMode: "contain",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.6,
  },
  paginationContainer: {
    bottom: 250,
    display: "none",
    left: 10,
    right: 10,
  },
  paginationDots: {
    height: 16,
    margin: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
});

const RenderPagination = ({ activeIndex, slider, data, onIntroCompleted }) => {
  return (
    <View style={styles.paginationContainer}>
      <SafeAreaView>
        <View style={styles.paginationDots}>
          {data.length > 1 &&
            data.map((_, i) => (
              <Pressable
                key={i}
                style={[
                  styles.dot,
                  i === activeIndex
                    ? { backgroundColor: "white" }
                    : { backgroundColor: "rgba(0, 0, 0, 0.2)" },
                ]}
                onPress={() => slider?.goToSlide(i, true)}
              />
            ))}
        </View>
      </SafeAreaView>
    </View>
  );
};

export { Upload };
