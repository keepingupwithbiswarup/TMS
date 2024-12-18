import { Image, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'


const LoginPage = ({ navigation }: { navigation: any }) => {
    const [passwordVisible, setPasswordVisible] = useState(false);




    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const isFormValid = () => {
        return email !== '' && password !== '';
    };
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"white"} barStyle={'dark-content'} ></StatusBar>
            <ScrollView contentContainerStyle={styles.scrollViewContainer}>
                <View style={{padding:15}}>
                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <Image tintColor={"black"} style={styles.image} source={require('../assets/back-arrow.png')} />
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
                        <Image
                            source={passwordVisible ? require('../assets/eye.png') : require('../assets/eye-closed.png')}
                            style={styles.eyeImage}
                        />
                    </TouchableOpacity>
                </View>




                <TouchableOpacity
                    style={[styles.nextButton, { backgroundColor: isFormValid() ? '#602bf9' : '#d3d3d3' }]}
                    disabled={!isFormValid()}
                >
                    <Text style={styles.btnText}>Login</Text>

                </TouchableOpacity>
                <Text onPress={()=>{navigation.navigate('ForgotPasswordPage')}} style={styles.forgotLabel}>Forgot Your Password?</Text>
                </View>

                <View style={[ {backgroundColor: "#f6f6f9", width: "100%", paddingBottom: 20, paddingTop: 10},{position:'absolute',bottom:0} ]}>
                    <Text style={{ fontSize: 14, color: "#686D76", textAlign: "center" }}>Don't have an account?</Text>
                    <View style={{ height: 5, }} />
                    <Text onPress={() => { navigation.navigate('SignUpPage') }} style={{ fontSize: 15, color: "#602bf9", fontWeight: "bold", textAlign: "center" }}>Sign Up</Text>
                </View>
            </ScrollView>
        </SafeAreaView>);
}

export default LoginPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
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
        fontSize: 26,
    },
    subHeaderText: {
        textAlign: "center",
        fontWeight: "bold",
        fontSize: 21,
        color: "grey",
        marginBottom: 5
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

    },
    btnText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
    },
    forgotLabel: {
        marginTop: 15,
        textAlign: "right",
        color: "#602bf9",
        margin: 2
    }
})