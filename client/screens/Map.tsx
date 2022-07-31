import MapView, { Marker } from "react-native-maps";
import { useEffect, useState } from "react";
import { Modal, Portal } from "react-native-paper";
import { Dimensions, StyleSheet, View } from "react-native";
import { MapModal, TopBar } from "../components";
import { useLocalArtContext } from "../../utils";
import { ArtPic, PhonePic } from "../../utils/types";
import { markArtAsSeen } from "../../firebase";
import { db } from "../../firebase/config";
import {
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";

function Map() {
  const { loading, loggedInUser, mapRegion, deviceArt, setMapRegion } =
    useLocalArtContext();
    const [art, setArt] = useState<ArtPic[]>([]);

  const [visible, setVisible] = useState(false);
  const [localLoading, setLocalLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<PhonePic>();

  function artListener() {
    // if (!loggedInUser) return;
    try {
      const q = query(collection(db, "Local Art"));
      let cloudArray: any[] = [];
      onSnapshot(q, (querySnapshot) => {
        setArt([]);
        querySnapshot.forEach((doc) => {
          const observation = doc.data();
          observation.id = doc.id;
          observation.pinColor = "green";
          cloudArray.push(observation);
        });
        setArt(cloudArray);
        cloudArray = [];
        setLocalLoading(false);

      });
    } catch (error) {
      console.error("artListener error:", error);
    }
  }

  useEffect(()=>{
    artListener();
    return ()=>{
      setArt([])
    }
  }, [])

  function showModal(item) {
    setSelectedImage(item);
    setVisible(true);
  }

  function hideModal() {
    setVisible(false);
  }

  function draggedMarker(coordinates: object, index: number) {
    deviceArt[index].latitude = coordinates.latitude;
    deviceArt[index].longitude = coordinates.longitude;
  }

  if (loading || localLoading) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <TopBar />
      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.modal}
        >
          <MapModal pic={selectedImage} func={hideModal} />
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
            <Marker
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
                showModal(pic);
              }}
            />
          );
        })}
        {deviceArt.map((pic, idx) => {
          return (
            <Marker
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
                showModal(pic);
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
    height: Dimensions.get("window").height,
    position: "absolute",
    top: 0,
  },
  modal: {
    width: Dimensions.get("window").width * 0.6,
    position: "absolute",
    top: Dimensions.get("window").height * 0.075,
    left: Dimensions.get("window").width * 0.2,
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

export { Map };
