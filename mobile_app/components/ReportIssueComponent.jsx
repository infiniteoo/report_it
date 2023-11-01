import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import supabase from "../../supabase";

import Icon from "react-native-vector-icons/FontAwesome";

import BarcodeInput from "./BarcodeInput";
import LocationInput from "./LocationInput";
import ResolvedPicker from "./ResolvedDropDown";

const ReportIssueComponent = () => {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [description, setDescription] = useState("");
  const [barcodeData, setBarcodeData] = useState("");
  const [submittedBy, setSubmittedBy] = useState("");
  const [locationData, setLocationData] = useState("");
  const [resolved, setResolved] = useState("N");

  useEffect(() => {
    (async () => {
      const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
    })();
  }, []);

  const takePhotoWithCamera = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (result.canceled || !result.assets || result.assets.length === 0) {
      return;
    }
    setImageUri(result.assets[0].uri);
    console.log("imageUri", imageUri);
  };

  const handleSubmit = async () => {
    try {
      const { data, error } = await supabase.from("incidents").upsert([
        {
          description: description,
          barcodeData: barcodeData,
          submittedBy: submittedBy,
          location: locationData,
          resolved: resolved,
        },
      ]);

      if (!error) {
        console.log("Upload success!", data);
        // Clear out all the fields
        setImageUri(null);
        setDescription("");
        setBarcodeData("");
        setSubmittedBy("");
        setLocationData("");
        setResolved("N");
      } else {
        console.error("Error uploading:", error);
      }
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
      <Image
        source={require("../assets/report_it_icon.png")}
        style={styles.icon}
      />
      <TouchableOpacity style={styles.button} onPress={takePhotoWithCamera}>
        <Text style={styles.buttonText}>Take Picture</Text>
      </TouchableOpacity>
      <TextInput
        style={styles.inputDescription}
        placeholder="Enter the description here..."
        placeholderTextColor="#A9A9A9"
        multiline={true}
        numberOfLines={3}
        onChangeText={setDescription}
        value={description}
      />
      <TextInput
        style={styles.inputShort}
        placeholder="Submitted by..."
        placeholderTextColor="#A9A9A9"
        onChangeText={setSubmittedBy}
        value={submittedBy}
      />
      <View style={styles.row}>
        <LocationInput
          style={styles.halfInput}
          onChangeText={setLocationData}
          setLocationData={setLocationData}
          value={locationData}
        />
        <BarcodeInput
          style={styles.halfInput}
          barcodeData={barcodeData}
          setBarcodeData={setBarcodeData}
        />
      </View>
      <ResolvedPicker resolved={resolved} setResolve={setResolved} />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: "#20B2AA" }]}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "space-between", // changed from "center"
    backgroundColor: "#F5F5F5",
    width: "100%",
  },
  inputDescription: {
    backgroundColor: "#F0F0F0",
    width: "100%",
    height: 70,
    borderRadius: 10,
    padding: 15,
    textAlignVertical: "top",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  inputShort: {
    backgroundColor: "#F0F0F0",
    width: "100%",
    height: 40,
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 10,
  },

  halfInput: {
    width: "48%",
    marginBottom: 0, // Reset this to avoid double spacing due to the divider
  },
  icon: {
    position: "absolute",
    top: 10, // adjust based on your needs
    right: 10, // adjust based on your needs
    width: 60, // adjust based on your icon's dimensions
    height: 60, // adjust based on your icon's dimensions
  },
});

export default ReportIssueComponent;
