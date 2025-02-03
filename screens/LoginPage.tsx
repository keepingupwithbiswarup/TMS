import { ActivityIndicator, Alert, Image, Modal, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IpRoute from '../utilities/iproute';

const API_BASE_URL = 'http://125.22.105.182:1089';

export async function loginUser(email: string, password: string): Promise<any> {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/account/login`, {
      "Email": email,
      "Password": password,
    });
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(error.response.data.message || 'Invalid credentials');
    } else if (error.request) {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error('An unexpected error occurred. Please try again.');
    }
  }
}

const LoginPage = ({ navigation }: { navigation: any }) => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // New state for remember me
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const isFormValid = () => {
    return email !== '' && password !== '';
  };

  useEffect(() => {
    // Fetch saved credentials
    const fetchSavedCredentials = async () => {
      const rememberMeValue = await AsyncStorage.getItem('rememberMe');
      if (rememberMeValue === 'true') {
        const savedEmail = await AsyncStorage.getItem('rememberedEmail');
        const savedPassword = await AsyncStorage.getItem('rememberedPassword');

        if (savedEmail) {
          setEmail(savedEmail);
          
          setRememberMe(true);
        }
        if(savedPassword){
          setPassword(savedPassword);
          setRememberMe(true);
        }
      }
    };
    fetchSavedCredentials();
  }, []);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessage(null); 

      const result = await loginUser(email, password);
      console.log('Login Successful:', result);

      const employeeResponse = await axios.get(`http://${IpRoute}/api/employees`, {
        params: { Email: email },
      });

      const employee = employeeResponse.data.find((emp: any) => emp.Email === email);

      if (employee) {
        console.log('Employee details found:', employee);
        await AsyncStorage.setItem('currentUser', JSON.stringify(employee));
        
        // Save the "remember me" flag in AsyncStorage
        if (rememberMe) {
          await AsyncStorage.setItem('rememberMe', 'true');
          // Optionally, you could also store the email for auto-fill purposes:
          await AsyncStorage.setItem('rememberedEmail', email);
          await AsyncStorage.setItem('rememberedPassword', password);
        } else {
          await AsyncStorage.removeItem('rememberMe');
          await AsyncStorage.removeItem('rememberedEmail');
          await AsyncStorage.removeItem('rememberedPassword');

        }
        
        navigation.reset({
          index: 0,
          routes: [{ name: 'BottomTabs' }], 
        });
      } else {
        console.warn('No employee details found for the logged-in user.');
      }
      // Reset navigation regardless (if needed)
      navigation.reset({
        index: 0,
        routes: [{ name: 'BottomTabs' }], 
      });
    } catch (error: any) {
      console.error('Login Failed:', error.message);
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <View style={{ padding: 15 }}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image tintColor={'black'} style={styles.image} source={require('../assets/back-arrow.png')} />
          </TouchableOpacity>

          <View style={{ height: 60 }} />

          <Text style={styles.subHeaderText}>Welcome Back</Text>

          <Text style={styles.headerText}>Login to continue</Text>

          <View style={{ height: 80 }} />

          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />

          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!passwordVisible}
            />
            <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
              <Image source={passwordVisible ? require('../assets/eye.png') : require('../assets/eye-closed.png')} style={styles.eyeImage} />
            </TouchableOpacity>
          </View>

          {/* Remember Me Checkbox */}
          <View style={styles.rememberMeContainer}>
            <TouchableOpacity style={styles.checkboxContainer} onPress={() => setRememberMe(!rememberMe)}>
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkboxTick}>✓</Text>}
              </View>
              <Text style={styles.rememberMeText}>Remember Me</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.nextButton, { backgroundColor: isFormValid() ? '#602bf9' : '#d3d3d3' }]}
            disabled={!isFormValid()}
            onPress={handleLogin}
          >
            <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>

          <Text onPress={() => navigation.navigate('ForgotPasswordPage')} style={styles.forgotLabel}>
            Forgot Your Password?
          </Text>
        </View>

        {errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <View style={[{ backgroundColor: '#f6f6f9', width: '100%', paddingBottom: 20, paddingTop: 10 }, { position: 'absolute', bottom: 0 }]}>
          <Text style={{ fontSize: 14, color: '#686D76', textAlign: 'center' }}>Don't have an account?</Text>
          <View style={{ height: 5 }} />
          <Text onPress={() => navigation.navigate('SignUpPage')} style={{ fontSize: 15, color: '#602bf9', fontWeight: 'bold', textAlign: 'center' }}>
            Sign Up
          </Text>
        </View>

        <Modal transparent={true} animationType="fade" visible={loading} onRequestClose={() => setLoading(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ActivityIndicator size="large" color="white" />
              <Text style={styles.loadingText}>Logging in...</Text>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  image: {
    height: 30,
    width: 30,
  },
  headerText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 26,
  },
  subHeaderText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 21,
    color: 'grey',
    marginBottom: 5,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 15,
    fontSize: 14,
    color: '#000',
    borderWidth: 1,
    borderColor: '#dcdcdc',
    fontWeight: 'bold',
  },
  passwordContainer: {
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    top: '40%',
    transform: [{ translateY: -12 }],
  },
  eyeImage: {
    width: 24,
    height: 24,
  },
  nextButton: {
    paddingHorizontal: 80,
    paddingVertical: 20,
    borderRadius: 8,
    width: '100%',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  forgotLabel: {
    marginTop: 15,
    textAlign: 'right',
    color: '#602bf9',
    margin: 2,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 200,
    height: 200,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 15,
    fontSize: 14,
    color: 'white',
    fontWeight: '300',
  },
  errorContainer: {
    marginTop: 20,
    backgroundColor: '#f8d7da',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 15,
  },
  errorText: {
    color: '#721c24',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    marginHorizontal: 6,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    height: 17,
    width: 17,
    borderWidth: 1,
    borderColor: '#602bf9',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#602bf9',
  },
  checkboxTick: {
    color: 'white',
    fontSize: 14,
  },
  rememberMeText: {
    fontSize: 14,
    color: '#602bf9',
  },
});
