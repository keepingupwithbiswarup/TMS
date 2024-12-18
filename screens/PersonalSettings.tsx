import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import OptionCard from '../components/OptionCard'

const PersonalSettings = () => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"white"} barStyle={'dark-content'} />
            <Header headingText="Personal Settings" />
            <View style={{ height: 30 }} />
            <TouchableOpacity>
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
                onPress={() => { }}
            />
            <OptionCard
                iconSource={require('../assets/logout.png')}
                text="Sign Out"
                onPress={() => { }}
            />
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
})