import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import React from 'react';

const MenuCard = ({ text, imageSource, onRightArrowPress }:{text:string,imageSource:any, onRightArrowPress:any}) => {
  return (
    <TouchableOpacity onPress={onRightArrowPress}>
    <View style={styles.card}>
      <View style={styles.row}>
        
        <Image source={imageSource} style={styles.image} />

        <Text style={styles.cardText}>{text}</Text>


        <TouchableOpacity onPress={onRightArrowPress}>
          <Image
            source={require('../assets/arrow-icon.png')} 
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
    </TouchableOpacity>
  );
};

export default MenuCard;

const styles = StyleSheet.create({
  card: {
    width: '100%',
    height: 80,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginBottom:2,
    paddingRight:12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  image: {
    width: 35,
    height: 35,
    marginLeft:5,
    tintColor:"#aaa"
  },
  cardText: {
    fontSize: 15,
    flex: 1,
    marginHorizontal: 20,
  },
  arrowIcon: {
    width: 20,
    height: 20,
    tintColor:"#aaa"
  },
});
