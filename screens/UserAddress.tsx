import { StatusBar, StyleSheet, Text, View, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import BottomButton from '../components/BottomButton'
import { useFocusEffect } from '@react-navigation/native'
import IpRoute from '../utilities/iproute'

const UserAddress = ({ route, navigation }: { route: any; navigation: any }) => {
  const { employeeId } = route.params; 
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<string>('');
  const [initialAddress, setInitialAddress] = useState<string>('');
  const [isEditable, setIsEditable] = useState<boolean>(true);

  const checkUser = async () => {
    setLoading(true);
    try {

      const response = await fetch(`http://${IpRoute}/api/employees`);
      if (response.ok) {
        const users = await response.json(); 
        const currentUser = users.find((user: any) => user.EmployeeId === employeeId);

        if (currentUser) {
          setAddress(currentUser.Address || '');
          setInitialAddress(currentUser.Address || '');
          if (currentUser.Role !== 'Admin') {
            setIsEditable(false);
          }
        } else {
          Alert.alert('User not found');
        }
      } else {
        Alert.alert('Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      Alert.alert('An error occurred while fetching the user');
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
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  const isButtonActive = address !== initialAddress && address.length > 0;

  const updateAddress = async () => {
    if (address !== initialAddress && address.length > 0) {
      try {
        const response = await fetch(`http://${IpRoute}/api/updateaddress/${employeeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address,
          }),
        });

        if (response.ok) {
          Alert.alert('Address updated successfully');
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"white"} barStyle={'dark-content'} />
      <Header headingText="Address" />

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 100 }}>
        <View style={styles.formContainer}>
          <TextInput
            style={styles.addressInput}
            placeholder="Enter Address"
            multiline
            numberOfLines={4}
            value={address}
            onChangeText={setAddress}
            editable={true}
          />
        </View>
      </ScrollView>

      <BottomButton
        title="Save"
        onPress={updateAddress}
        isActive={isButtonActive}
      />
    </SafeAreaView>
  );
};

export default UserAddress;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  formContainer: {
    padding: 20,
    flex: 1,
  },
  addressInput: {
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 5,
    backgroundColor: "white",
    height: 100,
    padding: 10,
    fontSize: 15,
    textAlignVertical: 'top', 
    color: "#000",
  },
});
