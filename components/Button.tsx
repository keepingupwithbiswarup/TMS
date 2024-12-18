import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

const ButtonCustom = ({ text, onPress}:{text:string,onPress:any}) => {
  
  return (
    <View>
      <TouchableOpacity 
        onPress={onPress} 
        style={styles.loginButton}
      >
        <Text style={styles.btnText}>{text}</Text> 
      </TouchableOpacity>
    </View>
  );
};

export default ButtonCustom;

const styles = StyleSheet.create({
    loginButton:{
        paddingHorizontal:80,
        paddingVertical:15,
        backgroundColor:"#602bf9",
        borderRadius:8,
        width:"90%",
    
      },
      btnText:{
        color:"white",
        fontWeight:"bold",
        textAlign:"center",
      }
});
