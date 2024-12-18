import React, { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

const CustomTextInput = ({
  placeholder,
  value,
  onChangeText,
}: {
  placeholder: string
  value: string
  onChangeText: (text: string) => void
}) => {
  const [isFocused, setIsFocused] = useState(false) 

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
      />
    </View>
  )
}

export default CustomTextInput

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
})
