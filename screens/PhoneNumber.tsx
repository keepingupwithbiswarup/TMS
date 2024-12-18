import { StatusBar, StyleSheet, Text, View, ScrollView, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import CustomTextInput from '../components/CustomTextInput'
import BottomButton from '../components/BottomButton'

const PhoneNumber = ({ navigation }: { navigation: any }) => {
  const [phone, setPhone] = useState('')
  const [initialPhone] = useState('') 

  const isButtonActive = phone !== initialPhone && phone.length===10

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"white"} barStyle={'dark-content'} />
      <Header headingText="Phone Number" />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        <View style={styles.formContainer}>
         <View style={styles.phoneInputContainer}>
                         <Text style={styles.countryCode}>+91</Text>
                         <TextInput
                             style={styles.phoneInput}
                             placeholder="Phone Number"
                             keyboardType="phone-pad"
                             maxLength={10}
                             value={phone}
                             onChangeText={setPhone}
                         />
                     </View>
        </View>
      </ScrollView>


      <BottomButton
        title="Save"
        onPress={() => {}}
        isActive={isButtonActive} 
      />
    </SafeAreaView>
  )
}

export default PhoneNumber

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  formContainer: {
    padding: 20,
    flex: 1,
  },
  phoneInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    backgroundColor: "white",
    paddingLeft: 10,
},
countryCode: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginRight: 8,
    marginLeft: 2,
    marginBottom:1,
},
phoneInput: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: "#000",
    fontWeight: "bold",
    paddingLeft: 5,
},
})
