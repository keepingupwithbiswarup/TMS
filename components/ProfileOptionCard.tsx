import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import React from 'react'

const ProfileOptionCard = ({ header, subheader, onPress }: { header: string, subheader: string, onPress: any }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>

      <View style={styles.leftContainer}>
        <Text style={styles.headerText}>{header}</Text>
        <Text style={styles.subheaderText}>{subheader}</Text>
      </View>


      <Image
        source={require('../assets/arrow-icon.png')}  
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  )
}

export default ProfileOptionCard

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginVertical: 1,
    paddingRight:15,
  },
  leftContainer: {
    flex: 1,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom:5,
  },
  subheaderText: {
    fontSize: 14,
    color: '#777',
  },
  arrowIcon: {
    width: 17,
    height: 17,
    tintColor: '#aaa', 
  },
})
