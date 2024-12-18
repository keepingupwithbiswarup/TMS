import { Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import ProfileOptionCard from '../components/ProfileOptionCard'


const ProfilePage = ({navigation}:{navigation:any}) => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"white"} barStyle={'dark-content'} />
            <Header headingText="Biswarup Dutta" />
            <ScrollView>

                <View style={styles.card}>
                    <TouchableOpacity>
                        <View style={styles.circle}>
                            <Text style={styles.circleText}>B</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.editCircle}>
                        <Image
                            source={require('../assets/pencil-icon.png')}
                            style={styles.editIcon}
                        />
                    </View>
                </View>

                <ProfileOptionCard
                    header="Full Name"
                    subheader="Biswarup Dutta"
                    onPress={() => {navigation.navigate('Fullname') }}
                />
                <ProfileOptionCard
                    header="Preferred Name"
                    subheader="Biswarup"
                    onPress={() =>  {navigation.navigate('PreferredName') }}
                />
                <View style={styles.card2}>
                    <View style={styles.leftContainer}>
                        <Text style={styles.headerText}>Role</Text>
                        <Text style={styles.subheaderText}>Owner</Text>
                    </View>
                </View>
                <View style={styles.card2}>
                    <View style={styles.leftContainer}>
                        <Text style={styles.headerText}>Work Schedule</Text>
                        <Text style={styles.subheaderText}>-</Text>
                    </View>
                </View>
                <View style={{ padding: 15, paddingBottom: 20, paddingTop: 22 }}>
                    <Text style={styles.labelText}>Login & Security</Text>
                </View>
                <ProfileOptionCard
                    header="Email"
                    subheader="duttabiswarup2003@gmail.com"
                    onPress={() => {navigation.navigate('Email') }}
                />
                <ProfileOptionCard
                    header="Phone number"
                    subheader="-"
                    onPress={() => {navigation.navigate('PhoneNumber') }}
                />
                <TouchableOpacity onPress={()=>{navigation.navigate('ChangePassword')}} style={styles.card2}>
                    <View style={styles.leftContainer}>
                        <Text style={styles.headerText}>Change Password</Text>
                    </View>
                    <Image
                        source={require('../assets/arrow-icon.png')}
                        style={styles.arrowIcon}
                    />
                </TouchableOpacity>
                <View style={{height:50}}/>
            </ScrollView>


        </SafeAreaView>
    )
}

export default ProfilePage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8Fc',
    },
    card: {
        width: '100%',
        height: 130,
        backgroundColor: 'white',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
    },
    labelText: {
        fontWeight: 'bold',
    },
    arrowIcon: {
        width: 17,
        height: 17,
        tintColor: '#aaa',
    },
    circle: {
        width: 100,
        height: 100,
        borderRadius: 60,
        backgroundColor: '#EEEEEE',
        justifyContent: 'center',
        alignItems: 'center',
    },
    circleText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#AAAAAA',
    },

    editCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#602bf9',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20,
        right: 150,
        elevation: 5,
    },
    editIcon: {
        width: 15,
        height: 15,
        tintColor: 'white',
    },
    card2: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 20,
        marginVertical: 1,
        paddingRight: 15,
    },
    leftContainer: {
        flex: 1,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    subheaderText: {
        fontSize: 14,
        color: '#777',
    },
})