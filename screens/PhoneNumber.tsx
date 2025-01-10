import { StatusBar, StyleSheet, Text, View, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'

import BottomButton from '../components/BottomButton'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from '../utilities/types'

const PhoneNumber = ({ navigation }: { navigation: any }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [phone, setPhone] = useState<string>('');
  const [initialPhone, setInitialPhone] = useState<string>('');
  const [isEditable, setIsEditable] = useState<boolean>(true); 

  const checkUser = async () => {
    setLoading(true);
    try {
      const currentUser = await AsyncStorage.getItem('currentUser');
      if (currentUser) {
        const parsedUser = JSON.parse(currentUser);
        setCurrentUser(parsedUser);
        setPhone(parsedUser.PhoneNumber || '');
        setInitialPhone(parsedUser.PhoneNumber || '');
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

  const isButtonActive = phone !== initialPhone && phone.length===10


  const updatePhoneNumber = async () => {
    if (currentUser && phone !== initialPhone && phone.length === 10) {
      try {
        const response = await fetch(`http://192.168.10.122:5000/api/updatephone/${currentUser.EmployeeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: phone,
          }),
        });

        if (response.ok) {
          const updatedUser = { ...currentUser, PhoneNumber: phone };
          setCurrentUser(updatedUser);
          await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));  
          navigation.goBack();
        } else {
          Alert.alert('Failed to update phone number');
        }
      } catch (error) {
        console.error('Error updating phone number:', error);
        Alert.alert('An error occurred while updating phone number');
      }
    } else {
      Alert.alert('Please enter a valid phone number');
    }
  };

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
                             editable={true}
                         />
                     </View>
        </View>
      </ScrollView>


      <BottomButton
        title="Save"
        onPress={updatePhoneNumber}  
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
