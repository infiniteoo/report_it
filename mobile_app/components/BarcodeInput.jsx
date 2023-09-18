import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";

const BarcodeInput = () => {
  const [barcodeData, setBarcodeData] = useState("");

  const handleInputChange = (text) => {
    setBarcodeData(text);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <TextInput
        placeholder="Scan a barcode..."
        value={barcodeData}
        onChangeText={handleInputChange}
        style={{
          borderColor: "gray",
          borderWidth: 1,
          padding: 10,
        }}
        autoFocus={true}
      />
      {barcodeData !== "" && <Text>Scanned Barcode: {barcodeData}</Text>}
    </View>
  );
};

export default BarcodeInput;
