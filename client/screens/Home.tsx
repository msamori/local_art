import { useContext, useEffect, useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { db } from "../../firebase/config"
import {
  collection,
  query,
  onSnapshot,
} from "firebase/firestore";
import { TopBar } from "../components";
import { Context } from "../../utils/state";


function Home(props) {

  const globalState = useContext(Context);

  const [loading, setLoading] = useState(true)

  const [art, setArt] = useState([]);
  const [picsIndex, setPicsIndex] = useState(0);
  const [singlePic, setSinglePic] = useState({});

  function artListener() {
    try {
      const q = query(
        collection(db, "seed_art"),
      );
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
      console.error("observationsListener error:", error);
    }
  }

  useEffect(()=>{
    artListener();
    setSinglePic(art[0]);
    return ()=>{
      setArt([]);
      setSinglePic({});
    }
  }, [])

  if (loading) {
    return (
      <></>
    )
  }

  return (
    <View style={styles.container}>
      <TopBar navigation={props.navigation} />
      <Pressable onPress={()=>console.log("pressed")}>
      <Image source={{ uri: singlePic.url }} style={styles.selectedPic} />
      </Pressable>
      <MapView
        style={styles.map}
        initialRegion={globalState.mapRegion}
      >
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
            />);
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
    height: Dimensions.get("window").height * .4,
    position: "absolute",
    bottom: 0,
  },
  selectedPic: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * .6,
    top: Dimensions.get("window").height * .10,
  },
});

export { Home };
