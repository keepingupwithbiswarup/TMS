import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';  
import LandingPage from './screens/LandingPage';
import SignUpPage from './screens/SignUpPage';
import LoginPage from './screens/LoginPage';
import ForgotPasswordPage from './screens/ForgotPasswordPage';
import HomePageV1 from './screens/HomePageV1';
import CreateOrganizationPage from './screens/CreateOrganizationPage';
import ChooseGoalPage from './screens/ChooseGoalPage';
import AdminDashboard from './screens/AdminDashboard';
import TimeClock from './screens/TimeClock';
import Timesheets from './screens/Timesheets';
import Approvals from './screens/Approvals';
import Menu from './screens/Menu';
import { Image } from 'react-native';
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


const Tab = createBottomTabNavigator();
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }:{route:any}) => ({
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
        tabBarStyle: { backgroundColor: '#fff',height:65,paddingTop:5,elevation:0}, 
        tabBarLabelStyle: {
          fontSize: 12, 
          fontWeight: '500',
          marginTop:3,
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


const Stack = createStackNavigator();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="LandingPage">
          <Stack.Screen name="LandingPage" component={LandingPage} options={{ headerShown: false }} />
          <Stack.Screen name="SignUpPage" component={SignUpPage} options={{ headerShown: false }} />
          <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
          <Stack.Screen name="ForgotPasswordPage" component={ForgotPasswordPage} options={{ headerShown: false }} />
          <Stack.Screen name="HomePageV1" component={HomePageV1} options={{ headerShown: false }} />
          <Stack.Screen name="CreateOrganizationPage" component={CreateOrganizationPage} options={{ headerShown: false }} />
          <Stack.Screen name="ChooseGoalPage" component={ChooseGoalPage} options={{ headerShown: false }} />


          <Stack.Screen name="BottomTabs" component={BottomTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="PersonalSettings" component={PersonalSettings} options={{ headerShown: false }} />
          <Stack.Screen name="AccountControl" component={AccountControl} options={{ headerShown: false }} />
          <Stack.Screen name="ProfilePage" component={ProfilePage} options={{ headerShown: false }} />
          <Stack.Screen name="Fullname" component={Fullname} options={{ headerShown: false }} />
          <Stack.Screen name="PreferredName" component={PreferredName} options={{ headerShown: false }} />
          <Stack.Screen name="Email" component={Email} options={{ headerShown: false }} />
          <Stack.Screen name="PhoneNumber" component={PhoneNumber} options={{ headerShown: false }} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
          <Stack.Screen name="WorkScheduleSettings" component={WorkScheduleSettings} options={{ headerShown: false }} />
          <Stack.Screen name="CreateWorkSchedule" component={CreateWorkSchedule} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
