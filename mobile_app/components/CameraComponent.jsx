import React, { useState, useEffect } from "react";
import { TouchableOpacity, View, Text } from "react-native";
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
        style={{
          flex: 0.5,
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 8, // This gives the outer View rounded edges
          overflow: "hidden", // This is important for the child Camera component to adhere to the rounded edges
        }}
      >
        <Camera
          style={{ flex: 1, aspectRatio: 1 }}
          ref={(ref) => setCamera(ref)}
        />
      </View>
      <View style={{ padding: 10, flex: 0.1, alignItems: "center" }}>
        <TouchableOpacity
          style={{
            backgroundColor: "#2196F3", // Use any color of your choice
            padding: 10,
            borderRadius: 8,
          }}
          onPress={takePicture}
        >
          <Text style={{ color: "white" }}>Take Picture</Text>
        </TouchableOpacity>
        {imageUri && (
          <Text style={{ marginTop: 5, fontSize: 20 }}>Image saved.</Text>
          // Removing the Image component
        )}
      </View>
    </View>
  );
};

export default CameraComponent;
