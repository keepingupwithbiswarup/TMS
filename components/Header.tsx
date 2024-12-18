import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

const Header = ({ headingText }:{headingText: string}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image
          source={require('../assets/back-arrow.png')} 
          style={styles.backIcon}
        />
      </TouchableOpacity>


      <Text style={styles.headerText}>{headingText}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 15,
    elevation: 1,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 20,
    zIndex: 10,
  },
  backIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
  },
});
