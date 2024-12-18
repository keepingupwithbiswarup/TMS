import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';

const OptionCard = ({ iconSource, text, onPress }:{iconSource:any,text:string,onPress:any}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Image source={iconSource} style={styles.icon} />
      <Text style={styles.cardText}>{text}</Text>
      <Image
        source={require('../assets/arrow-icon.png')} 
        style={styles.arrowIcon}
      />
    </TouchableOpacity>
  );
};

export default OptionCard;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 60, 
    width: '100%',
    marginBottom: 2,
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginRight: 15,
    tintColor:"#aaa"
  },
  cardText: {
    fontSize: 14,
    flex: 1,
  },
  arrowIcon: {
    width: 16, 
    height: 16,
    resizeMode: 'contain',
    tintColor:"#aaa"
  },
});
