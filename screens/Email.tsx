import { StatusBar, StyleSheet, Text, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import CustomTextInput from '../components/CustomTextInput'
import BottomButton from '../components/BottomButton'

const Email = ({ navigation }: { navigation: any }) => {
  const [email, setEmail] = useState('duttabiswarup2003@gmail.com')
  const [initialEmail] = useState('duttabiswarup2003@gmail.com') 

  const isButtonActive = email !== initialEmail

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"white"} barStyle={'dark-content'} />
      <Header headingText="Email" />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        <View style={styles.formContainer}>
          <CustomTextInput
            placeholder="Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
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

export default Email

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
