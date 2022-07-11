import { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import AppIntroSlider from "react-native-app-intro-slider";
import { db } from "../../firebase/config";
import { collection, query, onSnapshot } from "firebase/firestore";
import { TopBar } from "../components";
import { Context } from "../../utils/state";

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
    top: Dimensions.get("window").height * 0.1,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
  },
});

const renderItem = ({ item }) => (
  <View>
    <Image source={{ uri: item.url }} style={styles.selectedPic} />
  </View>
);

function Home(props) {
  const { mapRegion, setIsLoggedIn } = useContext(Context);

  const [loading, setLoading] = useState(true);

  const [art, setArt] = useState([]);
  const [singlePic, setSinglePic] = useState({});

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
        setSinglePic(cloudArray[0]);
        cloudArray = [];
        setLoading(false);
      });
    } catch (error) {
      console.error("artListener error:", error);
    }
  }

  useEffect(() => {
    artListener();
    setSinglePic(art[0]);
    setIsLoggedIn(true);
    return () => {
      setArt([]);
      setSinglePic({});
      setIsLoggedIn(false);
    };
  }, []);

  const keyExtractor = (item) => item.url;
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
      <MapView style={styles.map} initialRegion={mapRegion}>
        {art.map((pic) => {
          return (
            <MapView.Marker
              key={pic.id}
              coordinate={{
                latitude: pic.latitude,
                longitude: pic.longitude,
              }}
              onPress={() => {
                setSinglePic(pic);
              }}
            />
          );
        })}
      </MapView>
    </View>
  );
}

export { Home };
