import React, { useEffect, useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  StatusBar, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import IpRoute from '../utilities/iproute';
import MyVideoComponent from '../components/MyVideoComponent';

interface Department {
  DeptName: string;
}

const AddAnnouncement: React.FC = () => {
  const [announcementText, setAnnouncementText] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentItems, setDepartmentItems] = useState<Array<{ label: string; value: string }>>([]);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

  const checkUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user?.EmployeeId) {
          setEmployeeId(user.EmployeeId);
        } else {
          Alert.alert('Error', 'EmployeeId not found in current user data.');
        }
      } else {
        Alert.alert('Error', 'Current user not found.');
      }
    } catch (error) {
      console.error('Error retrieving current user:', error);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`http://${IpRoute}/api/departments`);
      if (!response.ok) throw new Error('Failed to fetch departments');
      
      const data: Department[] = await response.json();
      setDepartments(data);
      const items = data.map(dept => ({
        label: dept.DeptName,
        value: dept.DeptName,
      }));
      setDepartmentItems(items);
      if (items.length > 0) setSelectedDept(items[0].value);
    } catch (error) {
      console.error('Error fetching departments:', error);
      Alert.alert('Error', 'Failed to load departments');
    }
  };

  useEffect(() => {
    checkUser();
    fetchDepartments();
  }, []);

  const handleSubmit = async () => {
    if (!announcementText.trim() || !selectedDept || !employeeId) {
      Alert.alert('Missing Information', 'Please fill in all fields before submitting.');
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`http://${IpRoute}/api/addannouncement`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          DeptName: selectedDept,
          EmployeeId: employeeId,
          Announcement: announcementText.trim()
        })
      });
      
      if (response.ok) {
        Alert.alert('Success', 'Your announcement has been posted successfully.');
        setAnnouncementText('');
        setSelectedDept(departmentItems[0]?.value || null);
      } else {
        throw new Error('Server response was not ok');
      }
    } catch (error) {
      console.error('Error adding announcement:', error);
      Alert.alert('Error', 'Unable to post announcement. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Render the background video */}
      <MyVideoComponent onLoad={() => setVideoLoaded(true)} />

      {/* Until the video loads, display a full-screen loader */}
      {!videoLoaded ? (
        <View style={styles.videoLoading}>
          <ActivityIndicator size="large" color="#ffffff" />
        </View>
      ) : (
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.overlayContainer}
        >
          <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
          <ScrollView 
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.header}>
              <Text style={styles.title}>New Announcement</Text>
              <Text style={styles.subtitle}>Share important updates with your department</Text>
            </View>

            <View style={styles.form}>
              <Text style={styles.label}>Department</Text>
              <DropDownPicker
                open={open}
                value={selectedDept}
                items={departmentItems}
                setOpen={setOpen}
                setValue={setSelectedDept}
                setItems={setDepartmentItems}
                containerStyle={styles.dropdownContainer}
                style={styles.dropdown}
                dropDownContainerStyle={styles.dropdownList}
                textStyle={styles.dropdownText}
                placeholder="Select department"
                listMode="SCROLLVIEW"
              />

              <Text style={styles.label}>Announcement Content</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Type your announcement here..."
                value={announcementText}
                onChangeText={setAnnouncementText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                placeholderTextColor="white"
              />

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <Image 
                      source={require("../assets/announce.png")} 
                      style={{ tintColor: "white", height: 30, width: 30, marginRight: 5 }} 
                    />
                    <Text style={styles.submitButtonText}>Make Announcement</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  videoLoading: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
    paddingTop: 20,
    marginTop: 140,
  },
  title: {
    fontSize: 22,
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: 'white',
    marginLeft: 1,
  },
  form: {
    backgroundColor:"rgba(255,255,255,0.5)",
    borderRadius:20,
    padding: 20,
  },
  label: {
    fontSize: 16,
    color: 'white',
    marginBottom: 8,
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdown: {
    borderColor: '#dee2e6',
    borderRadius: 8,
    borderWidth: 1,
    minHeight: 50,
  },
  dropdownList: {
    borderColor: '#dee2e6',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownText: {
    fontSize: 16,
    color: '#495057',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: 'white',
    minHeight: 120,
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: 'teal',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
  },
});

export default AddAnnouncement;
