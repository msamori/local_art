import { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import AppIntroSlider from "react-native-app-intro-slider";
import { db } from "../../firebase/config";
import { collection, query, onSnapshot } from "firebase/firestore";
import { TopBar } from "../components";
import { Context } from "../../utils";
import { ArtPic, Region } from "../../utils/types";


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.4,
    position: "absolute",
    bottom: 0,
  },
  selectedPic: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.6,
    top: Dimensions.get("window").height * 0.10,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
  },
});

function Home(props) {
  const { currentLocation, locationPermission, mapRegion, setMapRegion } = useContext(Context);

  const [loading, setLoading] = useState(true);

  const [art, setArt] = useState([]);

  function artListener() {
    try {
      const q = query(collection(db, "seed_art"));
      let cloudArray = [];
      onSnapshot(q, (querySnapshot) => {
        setArt([]);
        querySnapshot.forEach((doc) => {
          const observation = doc.data();
          observation.id = doc.id;
          cloudArray.push(observation);
        });
        setArt(cloudArray);
        cloudArray = [];
        setLoading(false);
      });
    } catch (error) {
      console.error("artListener error:", error);
    }
  }

  useEffect(() => {
    artListener();
    return () => {
      setArt([]);
    };
  }, []);

  function shiftMap(item: ArtPic){
    const newRegion: Region = {
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01
    }
    setMapRegion(newRegion)
  }

  const renderItem = ({ item }) => {
    return (
      <View>
      <Pressable onLongPress={()=>{
        shiftMap(item);
      }}
      >
      <Image source={{ uri: item.url }} style={styles.selectedPic} />
      </Pressable>
    </View>

  )};

  const keyExtractor = (item: ArtPic) => item.url;
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
        data={art}
        ref={sliderEl}
      />
      <MapView style={styles.map} region={mapRegion}>
        {art.map((pic: ArtPic) => {
          return (
            <MapView.Marker
            pinColor={"purple"}
              key={pic.id}
              coordinate={{
                latitude: pic.latitude,
                longitude: pic.longitude,
              }}

            />
          );
        })}
        { locationPermission ? (
          <MapView.Marker
          pinColor={"blue"}
          coordinate={{
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
          }}
        />
        ) : (
          <></>
        )}
      </MapView>
    </View>
  );
}

export { Home };
