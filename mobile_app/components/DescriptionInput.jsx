import React, { useState } from "react";
import { View, TextInput, StyleSheet, Text } from "react-native";

const DescriptionInput = (props) => {
  const [description, setDescription] = useState("");

  const handleInputChange = (text) => {
    setDescription(text);
    // if you want to pass the value to the parent or any other component
    if (props.onChangeText) {
      props.onChangeText(text);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Description of the issue:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the description here..."
        multiline={true}
        numberOfLines={4}
        onChangeText={handleInputChange}
        value={description}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 100,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    textAlignVertical: "top", // for multiline text input, this makes the cursor start from the top
  },
});

export default DescriptionInput;
