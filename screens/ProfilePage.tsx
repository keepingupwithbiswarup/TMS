import { ActivityIndicator, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '../components/Header'
import ProfileOptionCard from '../components/ProfileOptionCard'
import { useFocusEffect } from '@react-navigation/native'

import { User } from '../utilities/types'
import AsyncStorage from '@react-native-async-storage/async-storage'


const ProfilePage = ({navigation}:{navigation:any}) => {
    
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const checkUser = async () => {
      setLoading(true);
      try {
        const currentUser = await AsyncStorage.getItem('currentUser');
        if (currentUser) {
          setCurrentUser(JSON.parse(currentUser));
        }
      } catch (error) {
        console.error("Error fetching user: ", error);
      }
      setLoading(false);
    };

   
    useFocusEffect(
      useCallback(() => {
        checkUser();
      }, []) 
    );
      
  
    if (loading) {
         
      return (
          <SafeAreaView style={styles.container}>
              <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#0000ff" />
              </View>
          </SafeAreaView>
      );
  }
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"white"} barStyle={'dark-content'} />
            <Header headingText={currentUser?.Username as string} />
            <ScrollView>

                <View style={styles.card}>
                    <TouchableOpacity>
                        <View style={styles.circle}>
                            <Text style={styles.circleText}>{currentUser?.Username[0]}</Text>
                        </View>
                    </TouchableOpacity>

                    {/* <View style={styles.editCircle}>
                        <Image
                            source={require('../assets/pencil-icon.png')}
                            style={styles.editIcon}
                        />
                    </View> */}
                </View>

                <View style={styles.card2}>
                    <View style={styles.leftContainer}>
                        <Text style={styles.headerText}>Full Name</Text>
                        <Text style={styles.subheaderText}>{currentUser?.Username as string}</Text>
                    </View>
                </View>
                <View style={styles.card2}>
                    <View style={styles.leftContainer}>
                        <Text style={styles.headerText}>Preferred Name</Text>
                        <Text style={styles.subheaderText}>{currentUser?.Username as string}</Text>
                    </View>
                </View>
                
                <ProfileOptionCard
                    header="Phone number"
                    subheader={currentUser?.PhoneNumber==null?"-":currentUser?.PhoneNumber}
                    onPress={() => {navigation.navigate('PhoneNumber') }}
                />
                <View style={styles.card2}>
                    <View style={styles.leftContainer}>
                        <Text style={styles.headerText}>Work Schedule</Text>
                        <Text style={styles.subheaderText}>-</Text>
                    </View>
                </View>
                <View style={{ padding: 15, paddingBottom: 20, paddingTop: 22 }}>
                    <Text style={styles.labelText}>Login & Security</Text>
                </View>
                <View style={styles.card2}>
                    <View style={styles.leftContainer}>
                        <Text style={styles.headerText}>Email</Text>
                        <Text style={styles.subheaderText}>{currentUser?.Email as string}</Text>
                    </View>
                </View>
                <ProfileOptionCard
                    header="Phone number"
                    subheader={currentUser?.PhoneNumber==null?"-":currentUser?.PhoneNumber}
                    onPress={() => {navigation.navigate('PhoneNumber') }}
                />
                <ProfileOptionCard
                    header="Address"
                    subheader={currentUser?.Address==null?"-":currentUser?.Address}
                    onPress={() => {navigation.navigate('Address') }}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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