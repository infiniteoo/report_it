import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";

const LocationInput = ({ locationData, setLocationData }) => {
  const handleInputChange = (text) => {
    setLocationData(text);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TextInput
        placeholder="Scan/Enter Location..."
        value={locationData}
        onChangeText={handleInputChange}
        style={{
          borderColor: "gray",
          borderWidth: 1,
          padding: 10,
        }}
        autoFocus={true}
      />
      {/*  {locationData !== "" && <Text>Scanned Barcode: {locationData}</Text>} */}
    </View>
  );
};

export default LocationInput;
