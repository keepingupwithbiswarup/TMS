import { Alert, Image, Modal, Pressable, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import OptionCard from '../components/OptionCard'



const PersonalSettings = ({ navigation }: { navigation: any }) => {

    const [modalVisible, setModalVisible] = useState(false);

    const handleSignOut = () => {
        setModalVisible(true);
    };

    const cancelSignOut = () => {
        setModalVisible(false);
    };

    const confirmSignOut = () => {
        navigation.navigate('LandingPage');
        setModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"white"} barStyle={'dark-content'} />
            <Header headingText="Personal Settings" />
            <View style={{ height: 30 }} />
            <TouchableOpacity onPress={()=>{navigation.navigate('ProfilePage')}}>
                <View style={styles.card}>
                    <View style={styles.circle}>
                        <Text style={styles.circleText}>B</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={styles.nameText}>Biswarup Dutta</Text>
                        <Text style={styles.roleText}>Owner</Text>
                    </View>
                    <Image
                        source={require('../assets/arrow-icon.png')}
                        style={styles.arrowIcon}
                    />
                </View>
            </TouchableOpacity>

            <OptionCard
                iconSource={require('../assets/notification-icon.png')}
                text="Notifications"
                onPress={() => { }}
            />
            <OptionCard
                iconSource={require('../assets/support.png')}
                text="Support"
                onPress={() => { }}
            />
            <OptionCard
                iconSource={require('../assets/account-control.png')}
                text="Account Control"
                onPress={() => { navigation.navigate("AccountControl") }}
            />
            <OptionCard
                iconSource={require('../assets/logout.png')}
                text="Sign Out"
                onPress={handleSignOut}
            />


            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={cancelSignOut}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Are you sure you want to sign out?</Text>
                        <Text style={styles.modalMessage}>
                            Once you sign out, you will need to log in again to access your account.
                        </Text>
                        <View style={styles.modalButtons}>
                            <Pressable style={styles.cancelButton} onPress={cancelSignOut}>
                                <Text style={styles.buttonText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.confirmButton} onPress={confirmSignOut}>
                                <Text style={styles.buttonText}>Confirm</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    )
}

export default PersonalSettings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8Fc',
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 35,
        elevation: 1,
    },
    headerText: {
        position: 'absolute',
        top: 26,
        right: 35,
        textAlign: 'center',
        fontSize: 16,
        width: '100%',
        alignSelf: 'center',
        fontWeight: 'bold',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 10,
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#EEEEEE',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    circleText: {
        color: 'grey',
        fontSize: 22,
        fontWeight: 'bold',
    },
    textContainer: {
        flex: 1,
    },
    nameText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
    },
    roleText: {
        fontSize: 13,
        color: '#777',
    },
    arrowIcon: {
        width: 20,
        height: 20,
        tintColor: "#aaa"
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 30,
        alignItems: 'center',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    modalMessage: {
        fontSize: 14,
        color: '#777',
        marginBottom: 20,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    cancelButton: {
        backgroundColor: '#aaa',
        padding: 10,
        borderRadius: 5,
        width: '40%',
        alignItems: 'center',
    },
    confirmButton: {
        backgroundColor: '#602bf9',
        padding: 10,
        borderRadius: 5,
        width: '40%',
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
})