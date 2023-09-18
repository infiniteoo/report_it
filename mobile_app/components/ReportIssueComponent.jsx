import React, { useState, useEffect } from "react";
import {
  Button,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // You'll need to install @expo/vector-icons if you haven't already
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
  const [isCameraReady, setCameraReady] = useState(false);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();

      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera && isCameraReady) {
      try {
        let photo = await camera.takePictureAsync();
        console.log("photo", photo);
        setImageUri(photo.uri);
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  const takePhotoWithImagePicker = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImageUri(result.uri);
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
      const response = await axios.post("http://10.0.2.2:7777", formData, {
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
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        ref={(ref) => setCamera(ref)}
        onMountError={(error) => console.error("Camera error:", error)}
        onCameraReady={() => setCameraReady(true)}
      />
      <View style={styles.form}>
        <TouchableOpacity
          style={styles.button}
          onPress={takePhotoWithImagePicker}
        >
          <Text style={styles.buttonText}>Take Picture</Text>
          {/* You can also add a camera icon here */}
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Enter the description here..."
          placeholderTextColor="#A9A9A9"
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
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#20B2AA" }]}
          onPress={handleSubmit}
        >
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  camera: {
    flex: 0.5,
    width: "100%",
    borderRadius: 15, // Increased border radius for a rounded appearance
    marginBottom: 15,
    overflow: "hidden", // Ensures that the camera view respects the borderRadius
    // Drop shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
  form: {
    flex: 0.5,
    padding: 20,
    justifyContent: "center", // Ensure the contents are centered
    backgroundColor: "#FFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  input: {
    backgroundColor: "#F0F0F0",
    width: "90%",
    alignSelf: "center",
    height: 100,
    borderRadius: 15,
    padding: 15,
    textAlignVertical: "top",
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FFA07A",
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "center",
    margin: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.36,
    shadowRadius: 6.68,
    elevation: 11,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ReportIssueComponent;
