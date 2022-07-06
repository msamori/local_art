import { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";

const dummyData = [
  {
    id: "LAS1Lgeru3Q1io1snNpV",
    latitude: 40.852,
    longitude: -73.9412,
    url: "https://firebasestorage.googleapis.com/v0/b/samori-local-art.appspot.com/o/94134239.jpeg?alt=media&token=a997b35a-65f7-4522-b0fd-324665ccfd26",
  },
  {
    id: "yh5p2e5JXQClQZm4MTzp",
    latitude: 40.8532,
    longitude: -73.952,
    url: "https://firebasestorage.googleapis.com/v0/b/samori-local-art.appspot.com/o/Picture%20190.jpg?alt=media&token=2810e2d0-fced-4266-8126-f096730b4b52",
  },
];

function HomeImage({style}) {

  const [pics, setPics] = useState(dummyData);
  const [singlePic, setSinglePic] = useState(dummyData[1]);

  useEffect(()=>{
    console.log("singlePic", singlePic)
  }, [])

  return (
      <Image source={{ uri: singlePic.url }} style={style} />
  );
}

export { HomeImage };
