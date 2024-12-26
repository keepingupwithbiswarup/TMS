import React, { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

const CustomTextInput = ({
  placeholder,
  value,
  onChangeText,
  editable = true,
}: {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  editable?: boolean; 
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <TextInput
        style={[styles.input, { borderColor: isFocused ? '#602bf9' : '#000' }]}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#AAA"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        editable={editable} // Use the editable prop here
      />
    </View>
  );
};

export default CustomTextInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 15,
    backgroundColor: 'white',
  },
});
