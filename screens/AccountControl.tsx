import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'

const AccountControl = () => {
  return (
    <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor={"white"} barStyle={'dark-content'} />
        <Header headingText="Account Control" />
        <View style={{ padding: 15,paddingBottom:17  }}>
                  <Text style={styles.labelText}>Once deleted , any account information will be gone forever.</Text>
                </View>
                <TouchableOpacity style={styles.card} onPress={()=>{}}>
                      <Image source={require('../assets/delete-icon.png')} style={styles.icon} />
                      <Text style={styles.cardText}>Delete Account</Text>
                    
                    </TouchableOpacity>
     
    </SafeAreaView>
  )
}

export default AccountControl

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8Fc',
    },
    labelText: {
        fontWeight: 'bold',
        color:"#373A40"
      },
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
        width: 25,
        height: 25,
        resizeMode: 'contain',
        marginRight: 15,
        tintColor:"#FF6969"
      },
      cardText: {
        fontSize: 14,
        flex: 1,
      },
})