import {
    ActivityIndicator,
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
  } from 'react-native';
  import React, { useCallback, useState } from 'react';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import Header from '../components/Header';
  import ProfileOptionCard from '../components/ProfileOptionCard';
  import { useFocusEffect } from '@react-navigation/native';
  import { User } from '../utilities/types';
  
  const UserProfile = ({ route, navigation }: { route: any; navigation: any }) => {
    const { userId } = route.params; 
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
  
    const checkUser = async () => {
        setLoading(true);
        try {
    
          const response = await fetch(`http://192.168.10.137:5000/api/employees`);
          if (response.ok) {
            const users = await response.json(); 
        
            const user = users.find((u: User) => u.UserId === userId);
            if (user) {
              setCurrentUser(user);
            } else {
              console.error(`User with id ${userId} not found.`);
            }
          } else {
            console.error(`Failed to fetch users: ${response.status}`);
          }
        } catch (error) {
          console.error('Error fetching users: ', error);
        } finally {
          setLoading(false);
        }
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
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <Header headingText={currentUser?.Username as string} />
        <ScrollView>
          <View style={styles.card}>
            <TouchableOpacity>
              <View style={styles.circle}>
                <Text style={styles.circleText}>{currentUser?.Username[0]}</Text>
              </View>
            </TouchableOpacity>
          </View>
  
          <View style={styles.card2}>
            <View style={styles.leftContainer}>
              <Text style={styles.headerText}>Full Name</Text>
              <Text style={styles.subheaderText}>{currentUser?.Username as string}</Text>
            </View>
          </View>
  
          <ProfileOptionCard
            header="Role"
            subheader={currentUser?.Role || '-'}
            onPress={() => navigation.navigate('UserRole', { employeeId: currentUser?.EmployeeId })}
          />
  
          <View style={styles.card2}>
            <View style={styles.leftContainer}>
              <Text style={styles.headerText}>Email</Text>
              <Text style={styles.subheaderText}>{currentUser?.Email as string}</Text>
            </View>
          </View>
  
          <ProfileOptionCard
            header="Phone number"
            subheader={currentUser?.PhoneNumber || '-'}
            onPress={() => navigation.navigate('UserPhone', { employeeId: currentUser?.EmployeeId })}
          />
          <ProfileOptionCard
            header="Address"
            subheader={currentUser?.Address || '-'}
            onPress={() => navigation.navigate('UserAddress', { employeeId: currentUser?.EmployeeId })}
          />
          <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')} style={styles.card2}>
            <View style={styles.leftContainer}>
              <Text style={styles.headerText}>Change Password</Text>
            </View>
            <Image source={require('../assets/arrow-icon.png')} style={styles.arrowIcon} />
          </TouchableOpacity>
          <View style={{ height: 50 }} />
        </ScrollView>
      </SafeAreaView>
    );
  };
  
  export default UserProfile;
  
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
  });
  