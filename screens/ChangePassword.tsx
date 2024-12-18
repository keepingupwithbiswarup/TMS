import React, { useState, useEffect } from 'react';
import { Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChangePassword = ({ navigation }: { navigation: any }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isFocused, setIsFocused] = useState({ current: false, new: false, confirm: false });
    const [error, setError] = useState('');
    const [isSaveEnabled, setIsSaveEnabled] = useState(false);

    useEffect(() => {
        const isValid =
            currentPassword.length > 0 &&
            newPassword.length >= 8 &&
            newPassword === confirmPassword;
        setIsSaveEnabled(isValid);
    }, [currentPassword, newPassword, confirmPassword]);

    const handleNewPasswordChange = (text: string) => {
        setNewPassword(text);
        if (text.length < 8) {
            setError('Password must be at least 8 characters');
        } else {
            setError('');
        }
    };

    const updateFocus = (field: 'current' | 'new' | 'confirm', focused: boolean) => {
        setIsFocused((prev) => ({ ...prev, [field]: focused }));
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor="white" barStyle="dark-content" />
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        tintColor="black"
                        style={styles.image}
                        source={require('../assets/back-arrow.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        { backgroundColor: isSaveEnabled ? '#602bf9' : '#EEEEEE' },
                    ]}
                    disabled={!isSaveEnabled}
                >
                    <Text style={[styles.btnText, { color: isSaveEnabled ? 'white' : '#A9A9A9' }]}>
                        Save
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={{ marginTop: 20 }}>
                <Text style={styles.headerText}>Change password</Text>
            </View>

            <View style={{ marginTop: 30 }}>
                <Text style={styles.labelText}>Current Password</Text>
                <TextInput
                    style={[
                        styles.inputField,
                        { borderColor: isFocused.current ? '#602bf9' : '#aaa' },
                    ]}
                    placeholder="Current password"
                    secureTextEntry
                    value={currentPassword}
                    onFocus={() => updateFocus('current', true)}
                    onBlur={() => updateFocus('current', false)}
                    onChangeText={setCurrentPassword}
                />
                <Text onPress={()=>{navigation.navigate('ForgotPasswordPage')}} style={[styles.labelText,{color:"#602bf9", paddingTop:10,paddingLeft:2,fontSize:15,fontWeight:"bold"}]}>Forgot your password?</Text>
            </View>

            <View style={{ marginTop: 25 }}>
                <Text style={styles.labelText}>Enter your new password twice to confirm</Text>
                <TextInput
                    style={[
                        styles.inputField,
                        { borderColor: isFocused.new ? '#602bf9' : '#aaa' },
                    ]}
                    placeholder="New password"
                    secureTextEntry
                    value={newPassword}
                    onFocus={() => updateFocus('new', true)}
                    onBlur={() => updateFocus('new', false)}
                    onChangeText={handleNewPasswordChange}
                />
                {error ? <Text style={styles.errorText}>{error}</Text> : null}
                <View style={{ height: 20 }} />
                <TextInput
                    style={[
                        styles.inputField,
                        { borderColor: isFocused.confirm ? '#602bf9' : '#aaa' },
                    ]}
                    placeholder="Confirm password"
                    secureTextEntry
                    value={confirmPassword}
                    onFocus={() => updateFocus('confirm', true)}
                    onBlur={() => updateFocus('confirm', false)}
                    onChangeText={setConfirmPassword}
                />
            </View>
        </SafeAreaView>
    );
};

export default ChangePassword;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        padding: 15,
    },
    image: {
        height: 25,
        width: 25,
    },
    nextButton: {
        paddingVertical: 12,
        borderRadius: 8,
        width: '20%',
    },
    btnText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 16,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    labelText: {
        fontSize: 16,
        marginBottom: 8,
    },
    inputField: {
        height: 50,
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        backgroundColor: 'white',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
});
