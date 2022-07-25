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
import { Modal, Portal } from "react-native-paper";
import AppIntroSlider from "react-native-app-intro-slider";
import { UploadModal, TopBar, TextInput } from "../components";
import { Context } from "../../utils";

function Upload(props) {
  const {
    currentLocation,
    deviceArt,
    loggedInUser,
    pics,
    setLoggedInUser,
    setDeviceArt,
  } = useContext(Context);

  const [newDescription, setNewDescription] = useState("");

  function hideModal() {
    setLoggedInUser({ ...loggedInUser, showUploadModal: false });
  }

  const renderItem = ({ item }) => {
    return (
      <View style={styles.container}>
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
    setDeviceArt([...deviceArt, toAdd]);
  }

  const keyExtractor = (item) => item.filename;
  const sliderEl = useRef(null);

  return (
    <View style={styles.container}>
      <TopBar navigation={props.navigation} inputStyles={styles} />
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
  bold: {
    fontWeight: "bold",
    color: "#F3F7D4",
    margin: 0.5,
    textAlign: "center",
  },
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
  topModal: {
    position: "absolute",
    left: 100,
    right: 100,
    top: 50,
  },
  topButtons: {
    color: "#F3F7D4",
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
