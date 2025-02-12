import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  SafeAreaView,
  ScrollView,
  Image,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import IpRoute from '../utilities/iproute';

const FeedbackForm = () => {
  const [reviewerId, setReviewerId] = useState<number | null>(null);
  const [employees, setEmployees] = useState<{ label: string; value: number }[]>([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState('');

  // Toggle to show Thank You screen after submission
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    checkUser();
    fetchEmployees();
  }, []);

  // Retrieve the current user and set ReviewerId
  const checkUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        if (user && user.EmployeeId) {
          setReviewerId(user.EmployeeId);
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

  // Fetch employees from API
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
      const response = await fetch(`http://${IpRoute}/api/addfeedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          EmployeeId: selectedEmployeeId,
          ReviewerId: reviewerId,
          FeedbackText: feedbackText,
          Rating: parsedRating,
          ModifiedOn: modifiedOn,
        }),
      });

      if (response.ok) {
        // If successful, show Thank You screen
        setIsSubmitted(true);
        // Clear form states
        setSelectedEmployeeId(null);
        setFeedbackText('');
        setRating('');
      } else {
        Alert.alert('Error', 'Failed to submit feedback.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      Alert.alert('Error', 'An error occurred while submitting feedback.');
    }
  };

  // If the feedback was submitted, show the "Thank you" screen
  if (isSubmitted) {
    return (
      <SafeAreaView style={styles.thankYouContainer}>
        <View style={styles.thankYouHeader}>
          <Text style={styles.thankYouTitle}>Thank you!!</Text>
          <Text style={styles.thankYouSubTitle}>
            Your message has been received! Your employee has successfully received your feedback
          </Text>
        </View>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => {
            setIsSubmitted(false);
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image style={{ height: 22, width: 22, tintColor: "white", marginRight: 5 }} source={require('../assets/goback.png')}></Image>
            <Text style={styles.homeButtonText}>Go Back</Text>
          </View>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

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
            <Text style={styles.headerTitle}>Get in touch right away.</Text>
            <Text style={styles.headerSubtitle}>
              Give us your feedback and we will send it to your employee.
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.formContainer}>
          <Text style={styles.formHeading}>Feedback</Text>

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

          <Text style={styles.fieldLabel}>Rating <Text style={{ fontSize: 14, color: "#aaa" }}>(Please enter a value between 1 to 5)</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Enter rating..."
            placeholderTextColor="#999"
            keyboardType="numeric"
            value={rating}
            onChangeText={(value) => {
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
            <Text style={styles.submitButtonText}>Submit Feedback</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FeedbackForm;

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
  formHeading: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
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
  thankYouContainer: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  thankYouHeader: {
    marginBottom: 30,
  },
  thankYouTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  thankYouSubTitle: {
    fontSize: 16,
    color: '#444',
    textAlign: 'center',
    lineHeight: 22,
  },
  homeButton: {
    backgroundColor: 'teal',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 30,
  },
  homeButtonText: {
    color: '#fff',
    fontSize: 15,
    paddingTop: 2,

  },
});
