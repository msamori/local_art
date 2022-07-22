import MapView from "react-native-maps";
import { useContext, useState } from "react";
import { Modal, Portal, Text } from "react-native-paper";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import { MapModal, TopBar } from "../components";
import { Context } from "../../utils";
import { markArtAsSeen } from "../../firebase";

function Map(props) {
  const { art, loading, loggedInUser, mapRegion, deviceArt, setMapRegion } =
    useContext(Context);

  const [visible, setVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(-1);

  function showModal(item, idx) {
    setSelectedImage(item);
    setSelectedIndex(idx);
    setVisible(true);
  }

  function hideModal() {
    setVisible(false);
  }

  function draggedMarker(coordinates, index) {
    deviceArt[index].latitude = coordinates.latitude;
    deviceArt[index].longitude = coordinates.longitude;
  }

  if (loading) {
    return <></>;
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
          <MapModal
            pic={selectedImage}
            index={selectedIndex}
            func={hideModal}
          />
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
          if (!pic.seenBy.includes(loggedInUser.id)) pic.pinColor = "blue";
          return (
            <MapView.Marker
              pinColor={pic.pinColor}
              key={idx}
              coordinate={{
                latitude: pic.latitude,
                longitude: pic.longitude,
              }}
              onPress={() => {
                if (pic.pinColor === "blue") {
                  pic.pinColor = "green";
                  markArtAsSeen(pic.id, loggedInUser.id);
                }
                showModal(pic, idx);
              }}
            />
          );
        })}
        {deviceArt.map((pic, idx) => {
          return (
            <MapView.Marker
              pinColor={pic.pinColor}
              key={pic.url}
              coordinate={{
                latitude: pic.latitude,
                longitude: pic.longitude,
              }}
              draggable
              onDragEnd={(e) => {
                draggedMarker(e.nativeEvent.coordinate, idx);
              }}
              onPress={() => {
                showModal(pic, idx);
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
});

export { Map };
