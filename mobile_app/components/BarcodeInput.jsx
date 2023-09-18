import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";

const BarcodeInput = ({ barcodeData, setBarcodeData }) => {
  const handleInputChange = (text) => {
    setBarcodeData(text);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TextInput
        placeholder="Scan/Enter Pallet LPN..."
        value={barcodeData}
        onChangeText={handleInputChange}
        style={{
          borderColor: "gray",
          borderWidth: 1,
          padding: 10,
        }}
        autoFocus={true}
      />
    </View>
  );
};

export default BarcodeInput;
