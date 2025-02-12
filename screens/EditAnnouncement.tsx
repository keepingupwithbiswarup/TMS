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
import DropDownPicker from 'react-native-dropdown-picker';
import { useRoute } from '@react-navigation/native';
import IpRoute from '../utilities/iproute';
import MyVideoComponent from '../components/MyVideoComponent';

interface Department {
  DeptName: string;
}

interface Announcement {
  AnnouncementId: number;
  DeptName: string;
  EmployeeId: number;
  Announcement: string;
  AnnouncementDate: string;
  Username: string;
}

const EditAnnouncement= ({route}:{route:any}) => {
  const { announcementId } = route.params;

  const [announcementText, setAnnouncementText] = useState<string>('');
  const [employeeId, setEmployeeId] = useState<number | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentItems, setDepartmentItems] = useState<Array<{ label: string; value: string }>>([]);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);

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

  const fetchAnnouncementDetails = async () => {
    try {
      const response = await fetch(`http://${IpRoute}/api/announcements`);
      if (!response.ok) throw new Error('Failed to fetch announcements');
      
      const data: Announcement[] = await response.json();
      const announcement = data.find(item => item.AnnouncementId === announcementId);
  
      if (!announcement) throw new Error('Announcement not found');
  
      setAnnouncementText(announcement.Announcement);
      setSelectedDept(announcement.DeptName);
      setEmployeeId(announcement.EmployeeId);
    } catch (error) {
      console.error('Error fetching announcement details:', error);
      Alert.alert('Error', 'Failed to load announcement details');
    }
  };

  useEffect(() => {
    fetchDepartments();
    fetchAnnouncementDetails();
  }, []);

  const handleSubmit = async () => {
    if (!announcementText.trim() || !selectedDept || employeeId === null) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://${IpRoute}/api/updateannouncement`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          AnnouncementId: announcementId,
          DeptName: selectedDept,
          EmployeeId: employeeId,
          Announcement: announcementText
        })
      });
      if (response.ok) {
        Alert.alert('Success', 'Announcement updated successfully.');
      } else {
        Alert.alert('Error', 'Failed to update announcement.');
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
      Alert.alert('Error', 'An error occurred while updating the announcement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Full-screen video background */}
      <MyVideoComponent onLoad={() => setVideoLoaded(true)} />

      {/* Until video loads, show a full-screen loader */}
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
              <Text style={styles.title}>Edit Announcement</Text>
              <Text style={styles.subtitle}>Modify your announcement details below</Text>
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
              <Text style={styles.label}>Announcement</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Edit your announcement here..."
                placeholderTextColor="#6c757d"
                value={announcementText}
                onChangeText={setAnnouncementText}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
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
                                  <Text style={styles.submitButtonText}>Update Announcement</Text>
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

export default EditAnnouncement;

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
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderRadius: 20,
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
    backgroundColor: 'transparent',
    minHeight: 120,
    marginBottom: 24,
  },
  submitButton: {
    backgroundColor: 'teal',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 54,
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 15,
  },
});
