import { useState } from "react";
import { Checkbox, Text } from "react-native-paper";
import { Pressable, StyleSheet, View } from "react-native";
import { useLocalArtContext } from "../../utils";
import { neverShowModalAgain } from "../../firebase";

function UploadModal() {
  const { loggedInUser, setLoggedInUser } = useLocalArtContext();
  const [checked, setChecked] = useState(false);

  function okay() {
    setLoggedInUser({ ...loggedInUser, showUploadModal: false });
    if (checked) {
      neverShowModalAgain(loggedInUser.id);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.bold}>
          {" "}
          Swipe through your photos and find one you'd like to add to your map.
          To add the photo write a short description of the art and instructions
          to help find it or whatever else you like, then press on the photo.
          Constinue swiping and adding more if you like. When you're finished
          head back to the map and find the yellow pins, your new pics! GPS
          isn't perfect so move them to where they belong and tap on them to
          upload!{" "}
        </Text>
        <View style={styles.row}>
          <Pressable onPress={okay}>
            <Text style={styles.upload}> * OKAY * </Text>
          </Pressable>
          <View style={styles.checkboxContainer}>
            <Text style={{ color: "#B81484" }}> Don't show this again </Text>
            <Checkbox
              uncheckedColor="#B81484"
              color="#F3F7D4"
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                setChecked(!checked);
              }}
            />
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  bold: {
    fontWeight: "bold",
    color: "#F3F7D4",
    margin: 0.5,
    textAlign: "center",
  },
  checkboxContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  upload: {
    display: "flex",
    fontWeight: "bold",
    color: "#B81484",
    margin: 0.5,
    alignSelf: "center",
    alignContent: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export { UploadModal };
