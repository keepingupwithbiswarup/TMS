import { StatusBar, StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native'
import React, { useCallback, useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import CustomTextInput from '../components/CustomTextInput'
import BottomButton from '../components/BottomButton'
import { User } from '../utilities/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'

const Email = ({ navigation }: { navigation: any }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string>('');
  const [initialEmail, setInitialEmail] = useState<string>('');
  const [isEditable, setIsEditable] = useState<boolean>(true); 

  const checkUser = async () => {
    setLoading(true);
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);
        setCurrentUser(parsedUser);
        setEmail(parsedUser.Email || '');
        setInitialEmail(parsedUser.Email || '');
        if (parsedUser.Role !== 'Admin') {
          setIsEditable(false);
        }
      }
    } catch (error) {
      console.error("Error fetching user: ", error);
    }
    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      checkUser();
    }, [])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  const isButtonActive = email !== initialEmail;

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
            editable={isEditable} 
          />
        </View>
      </ScrollView>

      <BottomButton
        title="Save"
        onPress={() => { }}
        isActive={isButtonActive}
      />
    </SafeAreaView>
  );
}

export default Email;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  formContainer: {
    padding: 20,
    flex: 1,
  },
});
