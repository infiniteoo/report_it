import React, { useState, useEffect } from "react";
import { Button, View, Image, Text } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Camera } from "expo-camera";
import * as Permissions from "expo-permissions";

const CameraComponent = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasFileSystemPermission, setHasFileSystemPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      setHasCameraPermission(cameraStatus.status === "granted");
      setHasFileSystemPermission(status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      let photo = await camera.takePictureAsync();
      console.log("photo", photo);
      setImageUri(photo.uri);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImageUri(result.uri);
    }
  };

  if (hasCameraPermission === null || hasFileSystemPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasFileSystemPermission === false) {
    return <Text>No access to camera or file system</Text>;
  }
  return (
    <View style={{ flex: 1, flexDirection: "column" }}>
      <View
        style={{ flex: 0.5, justifyContent: "center", alignItems: "center" }}
      >
        <Camera
          style={{ flex: 1, aspectRatio: 1, borderRadius: 8 }}
          ref={(ref) => setCamera(ref)}
        />
      </View>
      <View style={{ padding: 10, flex: 0.1 }}>
        <Button title="Take Picture" onPress={takePicture} />
      </View>
      {imageUri && (
        <Text>Image captured!</Text>
        // Removing the Image component
      )}
    </View>
  );
};

export default CameraComponent;
