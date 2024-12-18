import { Image, StyleSheet, Text, TouchableOpacity, View, ScrollView, StatusBar } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-gesture-handler';
import CheckBox from 'react-native-check-box'; 

export default function SignUpPage({navigation}:{navigation:any}) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };


  const isFormValid = () => {
    return fullName !== '' && email !== '' && password !== '' && isChecked;
  };

  useEffect(() => {
    console.log("Form Validity Changed:", isFormValid());
  }, [fullName, email, password, isChecked]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"white"} barStyle={'dark-content'} ></StatusBar>
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} >
          <Image tintColor={"black"} style={styles.image} source={require('../assets/back-arrow.png')} />
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
        
        <Text style={styles.headerText}>Create a new account</Text>
        
        <View style={{ height: 40 }} />

    
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName} 
        />


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
            <Image
              source={passwordVisible ? require('../assets/eye.png') : require('../assets/eye-closed.png')}
              style={styles.eyeImage}
            />
          </TouchableOpacity>
        </View>


        <View style={styles.checkboxContainer}>
          <CheckBox
            isChecked={isChecked}
            onClick={() => setIsChecked(!isChecked)} 
            style={styles.checkbox}
          />
          <Text style={styles.checkboxText}>
            I agree to IECS's <Text style={styles.linkText}>Terms of Service</Text> &{' '}
            <Text style={styles.linkText}>Privacy Policy</Text>.
          </Text>
        </View>

     
        <TouchableOpacity
          style={[styles.nextButton, { backgroundColor: isFormValid() ? '#602bf9' : '#d3d3d3' }]}
          disabled={!isFormValid()} onPress={()=>{navigation.replace('HomePageV1')}}
        >
          <Text style={styles.btnText}>Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
  },
  scrollViewContainer: {
    flexGrow: 1,
  },
  image: {
    height: 30,
    width: 30,
  },
  headerText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 22,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 15,
    fontSize: 14,
    color: "#000",
    borderWidth: 1,
    borderColor: "#dcdcdc",
    fontWeight: "bold",
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 15,
    top: "40%",
    transform: [{ translateY: -12 }],
  },
  eyeImage: {
    width: 24,
    height: 24,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  checkbox: {
    marginLeft: 5,
    marginRight: 9,
  },
  checkboxText: {
    fontSize: 15,
    color: "#686D76",
  },
  linkText: {
    color: "#602bf9",
    fontWeight: "thin",
    textDecorationLine: "underline",
  },
  nextButton: {
    paddingHorizontal: 80,
    paddingVertical: 20,
    borderRadius: 8,
    width: "100%",
    position: "absolute",
    bottom: 10,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  }
});
