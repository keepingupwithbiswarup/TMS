import { StatusBar, StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import CustomTextInput from '../components/CustomTextInput'
import BottomButton from '../components/BottomButton'

const PreferredName = ({ navigation }: { navigation: any }) => {
  const [preferredName, setPreferredName] = useState('Biswarup')
  const [initialPreferredName] = useState('Biswarup') 

  const isButtonActive = preferredName !== initialPreferredName

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"white"} barStyle={'dark-content'} />
      <Header headingText="Preferred Name" />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        <View style={styles.formContainer}>
          <CustomTextInput
            placeholder="Preferred Name"
            value={preferredName}
            onChangeText={(text) => setPreferredName(text)}
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

export default PreferredName

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
