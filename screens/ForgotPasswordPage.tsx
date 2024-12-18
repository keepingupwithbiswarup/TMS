import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

const ForgotPasswordPage = ({ navigation }: { navigation: any }) => {
    const [email, setEmail] = useState('');
    const isFormValid = () => {
        return email !== '';
    };
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"white"} barStyle={'dark-content'}></StatusBar>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <Image tintColor={"black"} style={styles.image} source={require('../assets/back-arrow.png')} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.nextButton, { backgroundColor: isFormValid() ? '#602bf9' : '#d3d3d3' }]}
                    disabled={!isFormValid()}
                >
                    <Text style={styles.btnText}>Next</Text>
                </TouchableOpacity>

            </View>
            <View style={{ height: 60 }} />
            <View>
                <Text style={styles.headerText}>Reset Your Password</Text>
                <Text style={styles.subText}>Enter the email associated with your account</Text>
            </View>   
            <View style={{ height: 15 }} />
            <View style={{marginHorizontal:8}}><TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            ></TextInput></View>
        </SafeAreaView>
    )
}

export default ForgotPasswordPage

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        padding: 15,
    },
    image: {
        height: 30,
        width: 30,
    },
    nextButton: {
        paddingVertical: 12,
        borderRadius: 8,
        width: "20%",
    },
    btnText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerText: {
        fontSize: 25,
        fontWeight: "bold",
        paddingHorizontal: 12,
    },
    subText: {
        fontSize: 16,
        fontWeight: "thin",
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "white",
        borderRadius: 10,
        paddingLeft: 15,
        fontSize: 14,
        color: "#000",
        borderWidth: 1,
        borderColor: "#dcdcdc",
        fontWeight: "bold",
    },
})