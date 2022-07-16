import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";
import { Dimensions, Image, ScrollView, StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import { TopBar } from "../components";

function Upload(props){

  const [pics, setPics] = useState([]);
  const [singlePic, setSinglePic] = useState({ latitude: 0, longitude: 0 });
  const [loadingPics, setLoadingPics] = useState(true);

  useEffect(() => {
    getPhotos();
    return () => {
      setPics([]);
      setSinglePic({ latitude: 0, longitude: 0 });
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
    setSinglePic(picArray[0]);
    setLoadingPics(false);
  }

  console.log("test pic", pics[0]);

  if (loadingPics) {
    return <></>;
  }

  return (
    <View style={styles.container}>
      <TopBar navigation={props.navigation} />
      <Image style={styles.selectedPic} source={{uri: pics[1].uri}}/>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  selectedPic: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height * 0.6,
    top: Dimensions.get("window").height * 0.10,
  }
});

export { Upload };
