import * as MediaLibrary from "expo-media-library";
import { useContext, useEffect, useRef, useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, View } from "react-native";
import MapView from "react-native-maps";
import AppIntroSlider from "react-native-app-intro-slider";
import { TopBar } from "../components";
import { Context } from "../../utils";

function Upload(props){

  const { currentLocation, locationPermission, mapRegion, setMapRegion } = useContext(Context);

  const [pics, setPics] = useState([]);
  const [loadingPics, setLoadingPics] = useState(true);

  useEffect(() => {
    getPhotos();
    return () => {
      setPics([]);
    };
  }, []);


  async function getPhotos() {
    const albumName = "Camera";
    const getAlbum = await MediaLibrary.getAlbumAsync(albumName);

    const { assets } = await MediaLibrary.getAssetsAsync({
      first: 5,
      album: getAlbum,
      sortBy: ["creationTime"],
      mediaType: ["photo"],
    });

    let picArray = [];

    for (let i = 0; i < assets.length; i++) {
      let assetInformation = await MediaLibrary.getAssetInfoAsync(assets[i]);
      let selectedPic = {
        filename: assetInformation.filename,
        uri: assetInformation.uri,
        timeCreated: assetInformation.creationTime,
        timeModified: assetInformation.modificationTime,
        latitude: assetInformation.location.latitude,
        longitude: assetInformation.location.longitude,
      };

      picArray.push(selectedPic);
    }

    setPics([...pics, ...picArray]);
    setLoadingPics(false);
  }

  console.log("test pic", pics[0]);

  function shiftMap(item){
    const newRegion = {
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
      <Image source={{ uri: item.uri }} style={styles.selectedPic} />
      </Pressable>
    </View>

  )};

  const keyExtractor = (item) => item.uri;
  const sliderEl = useRef(null);

  if (loadingPics) {
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
      <MapView style={styles.map} region={mapRegion}>
        {pics.map((pic) => {
          return (
            <MapView.Marker
            pinColor={"purple"}
              key={pic.uri}
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

export { Upload };
