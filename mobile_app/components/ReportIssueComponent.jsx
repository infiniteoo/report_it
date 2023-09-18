import React, { useState, useEffect } from "react";
import { Button, View, Text, StyleSheet, TextInput } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "expo-camera";
import axios from "axios";

import BarcodeInput from "./BarcodeInput";

const ReportIssueComponent = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [description, setDescription] = useState("");
  const [barcodeData, setBarcodeData] = useState("");

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      let photo = await camera.takePictureAsync();
      console.log("photo", photo);
      setImageUri(photo.uri);
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("description", description);
    formData.append("barcodeData", barcodeData);
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg",
      name: "image.jpg",
    });

    try {
      const response = await axios.post("http://localhost:7777", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload success!", response);
    } catch (error) {
      console.error("Error uploading:", error);
    }
  };

  if (hasCameraPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ flex: 1 }}>
      <Camera
        style={{ flex: 0.7, aspectRatio: 2, borderRadius: 8 }}
        ref={(ref) => setCamera(ref)}
      />
      <View style={{ flex: 0.3, padding: 10 }}>
        <Button title="Take Picture" onPress={takePicture} />
        <TextInput
          style={styles.input}
          placeholder="Enter the description here..."
          multiline={true}
          numberOfLines={4}
          onChangeText={setDescription}
          value={description}
        />
        <BarcodeInput
          style={styles.barcodeInputStyle}
          barcodeData={barcodeData}
          setBarcodeData={setBarcodeData}
        />
        <Button title="Submit" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: "top", // for multiline text input
    marginTop: 20,
  },
});

export default ReportIssueComponent;
