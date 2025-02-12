import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  StyleSheet
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import { useRoute } from '@react-navigation/native';
import IpRoute from '../utilities/iproute';

interface Feedback {
  FeedbackId: number;
  ReviewerId: number;
  EmployeeId: number;
  FeedbackText: string;
  Rating: number;
  CreatedOn: string;
  ModifiedOn: string;
  Response: string;
  Username: string;
  Reviewer: string;
}

interface Employee {
  label: string;
  value: number;
}

const FeedbackEdit: React.FC = () => {
  const route = useRoute();
  const { feedbackId } = route.params as { feedbackId: number };

  const [reviewerId, setReviewerId] = useState<number | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState('');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // checkUser();
    fetchEmployees();
    fetchFeedbackDetails();
  }, []);

  // Retrieve current user and set ReviewerId
  // const checkUser = async () => {
  //   try {
  //     const storedUser = await AsyncStorage.getItem('currentUser');
  //     if (storedUser) {
  //       const user = JSON.parse(storedUser);
  //       if (user && user.EmployeeId) {
  //         setReviewerId(user.EmployeeId);
  //       } else {
  //         Alert.alert('Error', 'EmployeeId not found in current user data.');
  //       }
  //     } else {
  //       Alert.alert('Error', 'Current user not found.');
  //     }
  //   } catch (error) {
  //     console.error('Error retrieving current user:', error);
  //   }
  // };

  // Fetch employees for the dropdown
  const fetchEmployees = async () => {
    try {
      const response = await fetch(`http://${IpRoute}/api/employees`);
      if (!response.ok) {
        throw new Error('Failed to fetch employees');
      }
      const data = await response.json();
      const employeeList = data.map((emp: { EmployeeId: number; Username: string }) => ({
        label: emp.Username,
        value: emp.EmployeeId,
      }));
      setEmployees(employeeList);
    } catch (error) {
      console.error('Error fetching employees:', error);
      Alert.alert('Error', 'Failed to load employees.');
    }
  };

  // Fetch feedback details and populate form fields
  const fetchFeedbackDetails = async () => {
    try {
      const response = await fetch(`http://${IpRoute}/api/getfeedbacks`);
      if (!response.ok) {
        throw new Error('Failed to fetch feedbacks');
      }
      const data: Feedback[] = await response.json();
      const feedback = data.find((fb) => fb.FeedbackId === feedbackId);
      if (feedback) {
        setSelectedEmployeeId(feedback.EmployeeId);
        setFeedbackText(feedback.FeedbackText);
        setRating(feedback.Rating.toString());
        setReviewerId(feedback.ReviewerId)
      } else {
        Alert.alert('Error', 'Feedback not found.');
      }
    } catch (error) {
      console.error('Error fetching feedback details:', error);
      Alert.alert('Error', 'Failed to load feedback details.');
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission to update feedback
  const handleSubmit = async () => {
    const parsedRating = parseInt(rating, 10);
    const modifiedOn = new Date().toISOString();

    if (
      !selectedEmployeeId ||
      !reviewerId ||
      !feedbackText ||
      isNaN(parsedRating) ||
      parsedRating < 1 ||
      parsedRating > 5
    ) {
      Alert.alert('Error', 'Please fill all fields correctly.');
      return;
    }

    try {
      const response = await fetch(`http://${IpRoute}/api/updatefeedback`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          FeedbackId: feedbackId,
          EmployeeId: selectedEmployeeId,
          ReviewerId: reviewerId,
          FeedbackText: feedbackText,
          Rating: parsedRating,
          ModifiedOn: modifiedOn,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Feedback updated successfully!');
      } else {
        Alert.alert('Error', 'Failed to update feedback.');
      }
    } catch (error) {
      console.error('Error updating feedback:', error);
      Alert.alert('Error', 'An error occurred while updating feedback.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'black'} barStyle={'light-content'} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ImageBackground
          source={require('../assets/bg.jpg')}
          style={styles.headerBackground}
          resizeMode="cover"
        >
          <View style={styles.headerOverlay}>
            <Text style={styles.headerTitle}>Edit Feedback</Text>
            <Text style={styles.headerSubtitle}>
              Update your feedback details below.
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.formContainer}>
          {loading ? (
            <Text>Loading...</Text>
          ) : (
            <>
              {/* {reviewerId && (
                <Text style={styles.fieldLabel}>Reviewer ID: {reviewerId}</Text>
              )} */}

              <Text style={styles.fieldLabel}>Select Employee:</Text>
              <Dropdown
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
                data={employees}
                labelField="label"
                valueField="value"
                placeholder="Choose an employee"
                value={selectedEmployeeId}
                onChange={(item) => {
                  setSelectedEmployeeId(item.value);
                }}
              />

              <Text style={styles.fieldLabel}>Your Feedback</Text>
              <TextInput
                style={styles.input}
                placeholder="Type your feedback..."
                placeholderTextColor="#999"
                value={feedbackText}
                onChangeText={setFeedbackText}
                multiline
              />

              <Text style={styles.fieldLabel}>
                Rating <Text style={{ fontSize: 14, color: "#aaa" }}>(Enter a value between 1 to 5)</Text>
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Enter rating..."
                placeholderTextColor="#999"
                keyboardType="numeric"
                value={rating}
                onChangeText={(value) => {
                  // Optional: Clamp value between 1 and 5
                  const parsed = parseInt(value, 10);
                  if (isNaN(parsed)) {
                    setRating('');
                  } else {
                    let clamped = Math.max(1, Math.min(parsed, 5));
                    setRating(clamped.toString());
                  }
                }}
              />

              <TouchableOpacity
                style={[styles.submitButton, !reviewerId && { opacity: 0.6 }]}
                onPress={handleSubmit}
                disabled={!reviewerId}
              >
                <Text style={styles.submitButtonText}>Update Feedback</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeedbackEdit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBackground: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
  },
  headerOverlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 80,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#ddd',
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    marginTop: -40,
    paddingHorizontal: 20,
    paddingVertical: 30,
    flex: 1,
  },
  fieldLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  dropdownContainer: {
    marginBottom: 15,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    marginBottom: 20,
    color: '#333',
  },
  submitButton: {
    backgroundColor: 'teal',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});
