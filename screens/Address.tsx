import { StatusBar, StyleSheet, Text, View, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import CustomTextInput from '../components/CustomTextInput'
import BottomButton from '../components/BottomButton'
import { useFocusEffect } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { User } from '../utilities/types'

const Address = ({ navigation }: { navigation: any }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [address, setAddress] = useState('');
    const [initialAddress,setInitialAddress] = useState('');
   
    
    const [isEditable, setIsEditable] = useState<boolean>(true); 
  
    const checkUser = async () => {
      setLoading(true);
      try {
        const currentUser = await AsyncStorage.getItem('currentUser');
        if (currentUser) {
          const parsedUser = JSON.parse(currentUser);
          setCurrentUser(parsedUser);
          setAddress(parsedUser.Address || '');
          setInitialAddress(parsedUser.Address || '');
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


    const updateAddress = async () => {

        if (currentUser && address !== initialAddress) {
          if (!address.trim()) {
            Alert.alert('Please enter a valid address');
            return;
          }
          
          try {
            const response = await fetch(`http://192.168.10.122:5000/api/updateaddress/${currentUser.EmployeeId}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                address: address,  
              }),
            });
      
            if (response.ok) {
              const updatedUser = { ...currentUser, Address: address };
              setCurrentUser(updatedUser);
              await AsyncStorage.setItem('currentUser', JSON.stringify(updatedUser));  
              navigation.goBack();  
            } else {
              Alert.alert('Failed to update address');
            }
          } catch (error) {
            console.error('Error updating address:', error);
            Alert.alert('An error occurred while updating address');
          }
        } else {
          Alert.alert('Please enter a valid address');
        }
      };
      
    
  

    const isButtonActive = address !== initialAddress

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"white"} barStyle={'dark-content'} />
            <Header headingText="Address" />

            <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
                <View style={styles.formContainer}>
                    <CustomTextInput
                        placeholder="Address"
                        value={address}
                        onChangeText={(text) => setAddress(text)}
                    />
                </View>
            </ScrollView>


            <BottomButton
                title="Save"
                onPress={updateAddress}
                isActive={isButtonActive}
            />
        </SafeAreaView>
    )
}

export default Address

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    formContainer: {
        padding: 20,
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
})
