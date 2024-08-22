import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Button, TouchableOpacity } from "react-native";
import DocumentScanner from "react-native-document-scanner-plugin";
import ImagePicker from "react-native-image-crop-picker";

export default function App() {
  const [scannedImage, setScannedImage] = useState();

  const scanDocument = async () => {
    // start the document scanner
    const { scannedImages } = await DocumentScanner.scanDocument();

    // get back an array with scanned image file paths
    if (scannedImages.length > 0) {
      // set the img src, so we can view the first scanned image
      setScannedImage(scannedImages[0]);
    }
  };

  const pickImage = () => {
    ImagePicker.openPicker({
      multiple: true,
    }).then((images) => {
      console.log(images);
      setScannedImage(images[0]);
    });
  };

  // useEffect(() => {
  //   // call scanDocument on load
  //
  // }, []);

  return (
    <View style={styles.container}>
      <Text>Hello World!</Text>
      <View
        style={{
          display: "flex",
          flex: 1,
          width: "100%",
          borderBottomWidth: 1,
        }}
      >
        {scannedImage && (
          <Image
            resizeMode="contain"
            style={{ width: "80%", height: "auto" }}
            source={scannedImage}
          />
        )}
      </View>
      <TouchableOpacity title="Open Camera" onPress={() => scanDocument()} />
      <TouchableOpacity title="Pick photos " onPress={() => pickImage()}  style={{paddingBottom: 10, height: 60}}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
