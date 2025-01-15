import { StatusBar, StyleSheet, Text, View, ScrollView, ActivityIndicator, Alert } from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import BottomButton from '../components/BottomButton';
import { useFocusEffect } from '@react-navigation/native';
import DropDownPicker from 'react-native-dropdown-picker';
import IpRoute from '../utilities/iproute';

const UserRole = ({ route, navigation }: { route: any; navigation: any }) => {
  const { employeeId } = route.params;
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string>('');
  const [initialRole, setInitialRole] = useState<string>('');
  const [open, setOpen] = useState(false); 
  const [roles, setRoles] = useState<{ label: string; value: string }[]>([
    { label: 'Admin', value: 'Admin' },
    { label: 'Manager', value: 'Manager' },
    { label: 'Employee', value: 'Employee' },
    { label: 'Intern', value: 'Intern' },
    { label: 'Web Developer', value: 'Web Developer' },
    { label: 'Mobile Developer', value: 'Mobile Developer' },
  ]);
  

  const checkUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://${IpRoute}/api/employees`);
      if (response.ok) {
        const users = await response.json();
        const currentUser = users.find((user: any) => user.EmployeeId === employeeId);

        if (currentUser) {
          setRole(currentUser.Role || '');
          setInitialRole(currentUser.Role || '');
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

  const isButtonActive = role !== initialRole && role.length > 0;

  const updateRole = async () => {
    if (role !== initialRole && role.length > 0) {
      try {
        const response = await fetch(`http://${IpRoute}/api/updaterole/${employeeId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            role,
          }),
        });

        if (response.ok) {
          Alert.alert('Role updated successfully');
          navigation.goBack();
        } else {
          Alert.alert('Failed to update role');
        }
      } catch (error) {
        console.error('Error updating role:', error);
        Alert.alert('An error occurred while updating role');
      }
    } else {
      Alert.alert('Please select a valid role');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"white"} barStyle={'dark-content'} />
      <Header headingText="Role" />

      <View style={{ flexGrow: 1, paddingBottom: 100 }}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Select Role</Text>
          <DropDownPicker
            open={open}
            value={role}
            items={roles}
            setOpen={setOpen}
            setValue={setRole}
            setItems={setRoles}
            placeholder="Select Role"
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            placeholderStyle={styles.placeholderStyle}
            arrowIconStyle={styles.arrowIconStyle}
            listItemLabelStyle={styles.listItemLabelStyle}
          />
        </View>
      </View>

      <BottomButton
        title="Save"
        onPress={updateRole}
        isActive={isButtonActive}
      />
    </SafeAreaView>
  );
};

export default UserRole;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  formContainer: {
    padding: 20,
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  dropdown: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  dropdownContainer: {
    borderWidth: 1,
    borderColor: 'black',
  },
  placeholderStyle: {
    color: 'grey',
  },
  arrowIconStyle: {
    tintColor: 'black',
    height:20,
    width:20,
  },
  listItemLabelStyle: {
    color: '#000',
  },
});
