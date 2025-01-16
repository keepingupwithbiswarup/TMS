import React, { createRef, useContext, useEffect, useState } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import LandingPage from './screens/LandingPage';
import SignUpPage from './screens/SignUpPage';
import LoginPage from './screens/LoginPage';
import ForgotPasswordPage from './screens/ForgotPasswordPage';
import HomePageV1 from './screens/HomePageV1';
import CreateOrganizationPage from './screens/CreateDepartmentPage';
import ChooseGoalPage from './screens/ChooseGoalPage';
import AdminDashboard from './screens/AdminDashboard';
import TimeClock from './screens/TimeClock';
import Timesheets from './screens/Timesheets';
import Approvals from './screens/Approvals';
import Menu from './screens/Menu';
import { ActivityIndicator, Animated, Image, StyleSheet, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PersonalSettings from './screens/PersonalSettings';
import AccountControl from './screens/AccountControl';
import ProfilePage from './screens/ProfilePage';
import Fullname from './screens/Fullname';
import PreferredName from './screens/PreferredName';
import Email from './screens/Email';
import PhoneNumber from './screens/PhoneNumber';
import ChangePassword from './screens/ChangePassword';
import WorkScheduleSettings from './screens/WorkScheduleSettings';
import CreateWorkSchedule from './screens/CreateWorkSchedule';
import AuthProvider, { AuthContext } from './utilities/AuthProvider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Address from './screens/Address';
import People from './screens/People';
import UserProfile from './screens/UserProfile';
import UserPhone from './screens/UserPhone';
import UserAddress from './screens/UserAddress';
import UserRole from './screens/UserRole';
import CreateDepartmentPage from './screens/CreateDepartmentPage';
import Departments from './screens/Departments';
import DepartmentDetails from './screens/DepartmentDetails';
import DepartmentSetings from './screens/DepartmentSettings';
import DepartmentMembers from './screens/DepartmentMembers';
import DepartmentAssign from './screens/DepartmentAssign';
import ProjectScreen from './screens/ProjectScreen';
import TaskDetailsScreen from './screens/TaskDetails';
import TaskDetails from './screens/TaskDetails';
import AddProjectScreen from './screens/AddProjectScreen';

import { enableSecureView, disableSecureView, forbidAndroidShare, allowAndroidShare } from 'react-native-prevent-screenshot-ios-android';
import { Platform } from 'react-native'
import DocumentViewPage from './screens/DocumentViewPage';
import AddTask from './screens/AddTask';
import TeamMembers from './screens/TeamMembers';
import AddSubTask from './screens/AddSubTask';
import EditTask from './screens/EditTask';
import EditSubTask from './screens/EditSubTask';
import EditProject from './screens/EditProject';
import TimesheetViewPage from './screens/TimesheetViewPage';
import AddTimesheet from './screens/AddTimesheet';






const navigationRef = createRef<NavigationContainerRef<any>>();

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: any }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let icon;

          if (route.name === 'Dashboard') {
            icon = require('./assets/house-icon.png');
          } else if (route.name === 'Time Clock') {
            icon = require('./assets/timeclock-icon.png');
          } else if (route.name === 'Timesheets') {
            icon = require('./assets/timesheet-icon.png');
          } else if (route.name === 'Approvals') {
            icon = require('./assets/approvals.png');
          } else if (route.name === 'Menu') {
            icon = require('./assets/menu-icon.png');
          }

          return (
            <Image
              source={icon}
              style={{ width: 30, height: 30, tintColor: color }}
            />
          );
        },
        tabBarActiveTintColor: '#602bf9',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: { backgroundColor: '#fff', height: 65, paddingTop: 5, elevation: 0 },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 3,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboard} />
      <Tab.Screen name="Time Clock" component={TimeClock} />
      <Tab.Screen name="Timesheets" component={Timesheets} />
      <Tab.Screen name="Approvals" component={Approvals} />
      <Tab.Screen name="Menu" component={Menu} />
    </Tab.Navigator>
  );
};


const DepartmentBottomTabNavigator = ({ route }: { route: any }) => {
  const { department } = route.params;

  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: any }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let icon;

          if (route.name === 'Dashboard') {
            icon = require('./assets/house-icon.png');
          } else if (route.name === 'Members') {
            icon = require('./assets/members.png');
          } else if (route.name === 'Projects') {
            icon = require('./assets/project-icon.png');
          } else if (route.name === 'Settings') {
            icon = require('./assets/settings.png');
          }  else if (route.name === 'Timesheets') {
            icon = require('./assets/timesheet-icon.png');
          } 

          return (
            <Image
              source={icon}
              style={{ width: 30, height: 30, tintColor: color }}
            />
          );
        },
        tabBarActiveTintColor: '#602bf9',
        tabBarInactiveTintColor: '#aaa',
        tabBarStyle: { backgroundColor: '#fff', height: 65, paddingTop: 5, elevation: 0 },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 3,
        },
      })}
    >
      <Tab.Screen name="Dashboard">
        {(props) => <DepartmentDetails {...props} department={department} />}
      </Tab.Screen>
      <Tab.Screen name="Members">
        {(props) => <DepartmentMembers {...props} department={department} />}
      </Tab.Screen>
      <Tab.Screen name="Projects">
        {(props) => <ProjectScreen {...props} department={department} />}
      </Tab.Screen>
      <Tab.Screen name="Timesheets">
        {(props) => <TimesheetViewPage{...props} />}
      </Tab.Screen>
      <Tab.Screen name="Settings">
        {(props) => <DepartmentSetings {...props} department={department} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};


const Stack = createStackNavigator();

const AppNavigator = () => {
  const { currentUser } = useContext(AuthContext) || {};
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('LandingPage'); 
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    const checkUserAndAnimate = async () => {

      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();


      setTimeout(async () => {
        const storedUser = await AsyncStorage.getItem('currentUser');
        if (storedUser) {
          setInitialRoute('BottomTabs');
        }
        setLoading(false);
      }, 2000);
    };

    checkUserAndAnimate();
  }, []);

  if (loading) {
    return (
      <View style={styles.splashContainer}>
        <Animated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Image style={{
            height: 60,
            width: 60,
            tintColor: "white",
            marginBottom: 10,
          }} source={require('./assets/work-schedule.png')}></Image>
          <View style={{height:10}}/>
          <Text style={{
            fontSize: 22,
            color: 'white',
            fontWeight: "bold",
          }}>Timesheet Management</Text>
        </Animated.View>
      </View>
    );
  }


  return (
    <Stack.Navigator initialRouteName={initialRoute}>
      <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />
      <Stack.Screen name="SignUpPage" component={SignUpPage} options={{ headerShown: false }} />
      <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
      <Stack.Screen name="ForgotPasswordPage" component={ForgotPasswordPage} options={{ headerShown: false }} />
      <Stack.Screen name="HomePageV1" component={HomePageV1} options={{ headerShown: false }} />
      <Stack.Screen name="CreateDepartmentPage" component={CreateDepartmentPage} options={{ headerShown: false }} />
      <Stack.Screen name="ChooseGoalPage" component={ChooseGoalPage} options={{ headerShown: false }} />
      <Stack.Screen name="BottomTabs" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="PersonalSettings" component={PersonalSettings} options={{ headerShown: false }} />
      <Stack.Screen name="AccountControl" component={AccountControl} options={{ headerShown: false }} />
      <Stack.Screen name="ProfilePage" component={ProfilePage} options={{ headerShown: false }} />
      <Stack.Screen name="Fullname" component={Fullname} options={{ headerShown: false }} />
      <Stack.Screen name="PreferredName" component={PreferredName} options={{ headerShown: false }} />
      <Stack.Screen name="Email" component={Email} options={{ headerShown: false }} />
      <Stack.Screen name="Address" component={Address} options={{ headerShown: false }} />
      <Stack.Screen name="PhoneNumber" component={PhoneNumber} options={{ headerShown: false }} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
      <Stack.Screen name="WorkScheduleSettings" component={WorkScheduleSettings} options={{ headerShown: false }} />
      <Stack.Screen name="CreateWorkSchedule" component={CreateWorkSchedule} options={{ headerShown: false }} />
      <Stack.Screen name="People" component={People} options={{ headerShown: false }} />
      <Stack.Screen name="UserProfile" component={UserProfile} options={{ headerShown: false }} />
      <Stack.Screen name="UserPhone" component={UserPhone} options={{ headerShown: false }} />
      <Stack.Screen name="UserAddress" component={UserAddress} options={{ headerShown: false }} />
      <Stack.Screen name="UserRole" component={UserRole} options={{ headerShown: false }} />
      <Stack.Screen name="Departments" component={Departments} options={{ headerShown: false }} />
      <Stack.Screen name="DepartmentBottomTabNavigator" component={DepartmentBottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="DepartmentAssign" component={DepartmentAssign} options={{ headerShown: false }} />
      <Stack.Screen name="TaskDetails" component={TaskDetails} options={{ headerShown: false }} />
      <Stack.Screen name="AddProjectScreen" component={AddProjectScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DocumentViewPage" component={DocumentViewPage} options={{ headerShown: false }} />
      <Stack.Screen name="AddTask" component={AddTask} options={{ headerShown: false }} />
      <Stack.Screen name="TeamMembers" component={TeamMembers} options={{ headerShown: false }} />
      <Stack.Screen name="AddSubTask" component={AddSubTask} options={{ headerShown: false }} />
      <Stack.Screen name="EditTask" component={EditTask} options={{ headerShown: false }} />
      <Stack.Screen name="EditSubTask" component={EditSubTask} options={{ headerShown: false }} />
      <Stack.Screen name="EditProject" component={EditProject} options={{ headerShown: false }} />
      <Stack.Screen name="AddTimesheet" component={AddTimesheet} options={{ headerShown: false }} />
      {/* <Stack.Screen name="TimesheetViewPage" component={TimesheetViewPage} options={{ headerShown: false }} /> */}
    </Stack.Navigator>
  );
};



const App = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      forbidAndroidShare(); 
    }
    if (Platform.OS === 'ios') {
      enableSecureView();    
    }
  }, []);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <NavigationContainer ref={navigationRef}>
          <AppNavigator />
        </NavigationContainer>
      </AuthProvider>
    </GestureHandlerRootView>
  );
};
const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#602bf9',
  },
  image: {
    height: 60,
    width: 60,
    tintColor: "white",
    marginBottom: 10,
  },
  splashText: {
    fontSize: 22,
    color: 'white',
    fontWeight: "bold",
  },
});


export default App;
