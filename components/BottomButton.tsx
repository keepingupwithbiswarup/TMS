
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const BottomButton = ({ title,isActive, onPress }: { title: string,isActive:Boolean, onPress: () => void }) => {
  return (
    <View style={styles.buttonContainer}>
    <TouchableOpacity
      style={[styles.button, { backgroundColor: isActive ? '#602bf9' : '#B5B5B5' }]}
      onPress={onPress}
      disabled={!isActive} 
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  </View>
  )
}

export default BottomButton

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    width: '90%',
    alignSelf: 'center',
  },
  button: {
    backgroundColor: '#602bf9',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
})
