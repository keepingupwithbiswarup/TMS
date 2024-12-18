import { StatusBar, StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import CustomTextInput from '../components/CustomTextInput'
import BottomButton from '../components/BottomButton'

const Fullname = ({ navigation }: { navigation: any }) => {
  const [fullName, setFullName] = useState('Biswarup Dutta')
  const [initialFullName] = useState('Biswarup Dutta') 

  const isButtonActive = fullName !== initialFullName

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"white"} barStyle={'dark-content'} />
      <Header headingText="Full name" />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        <View style={styles.formContainer}>
          <CustomTextInput
            placeholder="Full Name"
            value={fullName}
            onChangeText={(text) => setFullName(text)}
          />
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

export default Fullname

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  formContainer: {
    padding: 20,
    flex: 1,
  },
})
