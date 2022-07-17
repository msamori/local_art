import MapView from "react-native-maps";
import { useContext, useEffect, useRef, useState } from "react";
import { Modal, Portal } from "react-native-paper";
import { TopBar } from "../components";
import { Context } from "../../utils";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";

function Map(props) {
  const { art, currentLocation, loading, locationPermission, mapRegion, pics, setMapRegion} =
    useContext(Context);

  const [visible, setVisible] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [touchPosition, setTouchPosition] = useState({x: 0, y: 0})

  const mod = StyleSheet.create({
    modalStyle: {
      width: Dimensions.get("window").width * 0.2,
      height: Dimensions.get("window").height * 0.1,
      position: "absolute",
      top: touchPosition.y / 2.8,
      left: touchPosition.x / 2.6
    }
  })


  function showModal(evt, url){
    console.log("touch event position", evt.nativeEvent.position);
    console.log("top, left", mod.modalStyle.top, mod.modalStyle.left)
    setTouchPosition(evt.nativeEvent.position)
    setImageURL(url);
    setVisible(true);
  };
  const hideModal = () => setVisible(false);

  return (
    <View style={styles.container}>
      <TopBar navigation={props.navigation} />
      <Portal>
        <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={mod.modalStyle}
        >
        <Image source={{ uri: imageURL }} style={styles.selectedPic} />
        </Modal>
      </Portal>
          <MapView
          style={styles.map}
          region={mapRegion}
          showsUserLocation={true}
          moveOnMarkerPress={false}
          onRegionChangeComplete={(region)=>{
            setMapRegion(region);
          }}
          >
            {pics.map((pic) => {
              return (
                <MapView.Marker
                  pinColor={"yellow"}
                  key={pic.uri}
                  coordinate={{
                    latitude: pic.latitude,
                    longitude: pic.longitude,
                  }}
                  onPress={(evt)=>{
                    showModal(evt, pic.uri);
                  }}
                />
              );
            })}
            {art.map((pic) => {
              return (
                <MapView.Marker
                  pinColor={"green"}
                  key={pic.url}
                  coordinate={{
                    latitude: pic.latitude,
                    longitude: pic.longitude,
                  }}
                  onPress={(evt)=>{
                    showModal(evt, pic.url);
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
    height: Dimensions.get("window").height,
    position: "absolute",
    bottom: 0,
  },
  selectedPic: {
    width: Dimensions.get("window").width * 0.2,
    height: Dimensions.get("window").height * 0.1,
  },
});

export { Map };
