import MapView from "react-native-maps";
import { useContext, useState } from "react";
import { Modal, Portal, Text } from "react-native-paper";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { MapModal, TopBar } from "../components";
import { Context } from "../../utils";

function Map(props) {
  const { art, mapRegion, setMapRegion } = useContext(Context);

  const [visible, setVisible] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
  const [selectedImage, setSelectedImage] = useState({})
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const modal = StyleSheet.create({
    container: {
      width: Dimensions.get("window").width * 0.4,
      height: Dimensions.get("window").height * 0.2,
      position: "absolute",
      top: touchPosition.y / 2.8,
      left: touchPosition.x / 2.6,
    },
    description: {
      backgroundColor: "white",
      color: "black",
    },
  });

  function showModal(item, idx) {
    setSelectedImage(item);
    setSelectedIndex(idx);
    setVisible(true);
  }

  function hideModal() {
    setVisible(false);
  }

  return (
    <View style={styles.container}>
      <TopBar navigation={props.navigation} />
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <MapModal pic={selectedImage} index={selectedIndex}/>
        </Modal>
      </Portal>
      <MapView
        style={styles.map}
        region={mapRegion}
        showsUserLocation={true}
        onRegionChangeComplete={(region) => {
          setMapRegion(region);
        }}
      >
        {art.map((pic, idx) => {
          return (
            <MapView.Marker
              pinColor={pic.pinColor}
              key={idx}
              coordinate={{
                latitude: pic.latitude,
                longitude: pic.longitude,
              }}
              onPress={() => {
                showModal( pic, idx);
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
    height: Dimensions.get("window").height * 0.95,
    position: "absolute",
    top: Dimensions.get("window").height * 0.05,
  },
  modal: {
    width: Dimensions.get("window").width * 0.6,
    position: "absolute",
    top: Dimensions.get("window").height * 0.075,
    left: Dimensions.get("window").width * 0.2,
  },
  selectedPic: {
    width: Dimensions.get("window").width * 0.6,
    height: Dimensions.get("window").height * 0.3,
  },
});

export { Map };
