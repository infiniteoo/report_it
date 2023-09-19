import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

const ResolvedPicker = ({ resolved, setResolved }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Resolved?</Text>
      <Picker
        selectedValue={resolved}
        style={styles.picker}
        onValueChange={(itemValue) => setResolved(itemValue)}
      >
        <Picker.Item label="Y" value="Y" />
        <Picker.Item label="N" value="N" />
      </Picker>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8, // Adjust padding
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  label: {
    fontSize: 15, // Adjust font size
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 30, // Adjust height
  },
});

export default ResolvedPicker;
