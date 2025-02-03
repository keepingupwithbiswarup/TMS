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
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import ProfileOptionCard from '../components/ProfileOptionCard';
import { useFocusEffect } from '@react-navigation/native';
import { User } from '../utilities/types';
import IpRoute from '../utilities/iproute';
import PieChartGifted from '../components/PieChartGifted';
import { RadarChart } from '@salmonco/react-native-radar-chart';
import AreaChartGifted from '../components/AreaChart';
import {Dropdown} from 'react-native-element-dropdown';

interface TotalProjects{
  ProjectName: string;
  Status: string;
}


interface EmployeeTimesheetArea{
    Date: string;
    TimesheetCount: number;
}

const UserProfile = ({ route, navigation }: { route: any; navigation: any }) => {
  const { userId } = route.params;
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [workingHours, setWorkingHours] = useState<any>(null); 
  const [totalprojects, setTotalprojects] = useState<TotalProjects[]>(); 

  const [employeeTimesheetCount, setEmployeeTimesheetCount] = useState<EmployeeTimesheetArea[]>([]);
  const [secondemployeeTimesheetCount, setsecondEmployeeTimesheetCount] = useState<EmployeeTimesheetArea[]>([]);

  const [selectedEmployeeId, setSelectedEmployeeId] = useState(userId);
  const [employeeList, setEmployeeList] = useState<User[]>([]);
  


  

  const checkUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://${IpRoute}/api/employees`);
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

  const fetchWorkingHours = async (employeeId: number) => {
    try {
      const workinghrsresponse = await fetch(`http://${IpRoute}/api/employeeworkinghrs/${employeeId}`);
      if (workinghrsresponse.ok) {
        const workinghrs = await workinghrsresponse.json();
        setWorkingHours(workinghrs); 
        console.log(workinghrs); 
      }else if(workinghrsresponse.status === 404){
        console.log('No working hours found for this user');

      } else {
        console.error(`Failed to fetch user working hours: ${workinghrsresponse.status} - ${workinghrsresponse.statusText}`);
      }
    } catch (err) {
      console.error('Error fetching working hours:', err);
    }
  };
  const fetchEmployeeProjects = async (employeeId: number) => {
    try {
      const totalprojects = await fetch(`http://${IpRoute}/api/employeetotalprojects/${employeeId}`);
      if (totalprojects.ok) {
        const TotalProjectsData = await totalprojects.json();
        setTotalprojects(TotalProjectsData); 
        console.log(TotalProjectsData); 
      }else if(totalprojects.status === 404){
        console.log('No working hours found for this user');

      } else {
        console.error(`Failed to fetch user working hours: ${totalprojects.status} - ${totalprojects.statusText}`);
      }
    } catch (err) {
      console.error('Error fetching working hours:', err);
    }
  };

  const fetchEmployeeTimesheetCount = async (employeeId: number) => {
    try {
      const timesheetresponse = await fetch(`http://${IpRoute}/api/employeetimesheetcountbydate/${employeeId}`);
      if (timesheetresponse.ok) {
        const timesheet = await timesheetresponse.json();
        setEmployeeTimesheetCount(timesheet); 
        console.log(timesheet); 
      }else if(timesheetresponse.status === 404){
        console.log('No timesheet found');

      } else {
        console.error(`Failed to fetch user working hours: ${timesheetresponse.status} - ${timesheetresponse.statusText}`);
      }
    } catch (err) {
      console.error('Error fetching working hours:', err);
    }

  };
  const fetchSecondEmployeeTimesheetCount = async (employeeId: number) => {
    try {
      const timesheetresponse = await fetch(`http://${IpRoute}/api/employeetimesheetcountbydate/${employeeId}`);
      if (timesheetresponse.ok) {
        const timesheet = await timesheetresponse.json();
        setsecondEmployeeTimesheetCount(timesheet); 
        console.log(timesheet); 
      }else if(timesheetresponse.status === 404){
        console.log('No timesheet found');

      } else {
        console.error(`Failed to fetch user working hours: ${timesheetresponse.status} - ${timesheetresponse.statusText}`);
      }
    } catch (err) {
      console.error('Error fetching working hours:', err);
    }

  };

  const fetchEmployeeList = async () => {
    try {
      const response = await fetch(`http://${IpRoute}/api/employees`);
      if (response.ok) {
        const employees = await response.json();
        setEmployeeList(employees); 
      } else {
        console.error(`Failed to fetch employees: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleEmployeeChange = (employeeId: number) => {
    setSelectedEmployeeId(employeeId);
    
    setsecondEmployeeTimesheetCount([]);
    
    fetchSecondEmployeeTimesheetCount(employeeId); 
  };
  
  
  

  useFocusEffect(
    useCallback(() => {
      checkUser();
      fetchEmployeeList();
    }, [userId]) 
  );

  useEffect(() => {
    if (currentUser?.EmployeeId) {
      fetchWorkingHours(currentUser.EmployeeId);
      
    }
  }, [currentUser]); 
  useEffect(() => {
    if (currentUser?.EmployeeId) {
      fetchEmployeeProjects(currentUser.EmployeeId);
      
    }
  }, [currentUser]); 
  useEffect(() => {
    if (currentUser?.EmployeeId) {
      fetchEmployeeTimesheetCount(currentUser.EmployeeId);
      
    }
  }, [currentUser]);
  // useEffect(() => {
  //   if (currentUser?.EmployeeId) {
  //     fetchSecondEmployeeTimesheetCount(6);
      
  //   }
  // }, [currentUser]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  function formatTime(totalMinutes: number) {
    const hours = Math.trunc(totalMinutes / 60); // Get total hours (no decimals)
    const minutes = Math.trunc(totalMinutes % 60); // Get remaining minutes (no decimals)
  
    let formattedTime = '';
  
    if (hours > 0) {
      formattedTime += `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
  
    if (minutes > 0) {
      if (formattedTime !== '') {
        formattedTime += ' and ';
      }
      formattedTime += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  
    return formattedTime || '0 minutes';
  }
  
  const chartData = {
    data1: employeeTimesheetCount,
    data2: secondemployeeTimesheetCount,
  };
  
  

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
        <View style={styles.card2}>
          <View style={styles.leftContainer}>
            <Text style={styles.headerText}>Department</Text>
            <Text style={styles.subheaderText}>{currentUser?.Department as string}</Text>
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

        <View>
          <Text style={{ paddingTop: 20, paddingLeft: 20, fontSize: 25, fontWeight: 'thin', color: '#333' }}>
            Track User Details
          </Text>
          <Text style={{ paddingHorizontal: 22, fontSize: 13, fontWeight: 'thin', color: '#526D82', paddingTop: 3,paddingBottom:10 }}>
            You can see all the details of the user below
          </Text>
        </View>
        {workingHours ?
        <View style={[styles.card3,{paddingVertical:25}]}>
          <Text style={{fontSize:19,fontWeight:"thin",paddingBottom:4}}>Total Working Hours</Text>
          <Text style={{fontSize:12,fontWeight:"thin",paddingBottom:20,color: '#526D82',fontStyle:"italic"}}>Below you can see {currentUser?.Username}'s total working hours</Text>
           <Text style={{fontSize:25}}>{formatTime(workingHours[0].TotalWorkingHours*60)}</Text>
        </View>:<Text style={{padding:15,paddingLeft:23,fontStyle:"italic"}}>No working hours found for this user</Text>}
        {totalprojects && totalprojects.length > 0 ? (
  <View style={[styles.card3, { paddingVertical: 25 }]}>
    <Text style={{ fontSize: 19, fontWeight: "thin", paddingBottom: 4 }}>
      {currentUser?.Username}'s Projects Status
    </Text>
    <Text
      style={{
        fontSize: 12,
        fontWeight: "thin",
        paddingBottom: 20,
        color: "#526D82",
        fontStyle: "italic",
      }}
    >
      Below you can see {currentUser?.Username}'s projects status overview
    </Text>
    <PieChartGifted projects={totalprojects}/>

    {totalprojects.map((project, index) => (
    <View
      key={index}
      style={{
        backgroundColor: "#fff",
        padding: 6,
        borderRadius: 10,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 22, color: "#333", marginRight: 10 }}>•</Text>
      <View style={{ flex: 1 ,flexDirection:"row",justifyContent:"space-between"}}>
        <Text style={{ fontSize: 15, color: "#333" }}>
          {project.ProjectName}
        </Text>
        <Text
          style={{
            fontSize: 13,
            color: project.Status === "Due" ? "red" : "#888",
            fontStyle: "italic",
            marginTop: 2,
            paddingRight:1,
          }}
        >
          {project.Status}
        </Text>
      </View>
    </View>
  ))}
  </View>
) : (
  <Text style={{ padding: 15, paddingLeft: 23, fontStyle: "italic" }}>
    No projects found for this user
  </Text>
)}


<View style={styles.container}>
  {employeeTimesheetCount && employeeTimesheetCount.length > 0 ? (
    <View style={[styles.card3, { paddingLeft: 10 }]}>
      <Text style={{ fontSize: 19, padding: 10, paddingVertical: 5 ,color:"#333"}}>
        Progress in the Last 7 Days
      </Text>
      <Text style={{ fontSize: 11, paddingHorizontal: 10, fontStyle: 'italic' }}>
        See how hard your employee has been working in the last 7 days
      </Text>

      <View style={{ marginVertical: 20 }}>
        <Text style={{ fontSize: 15, marginBottom: 5, paddingHorizontal: 11 }}>
          Compare progress with another employee
        </Text>
        <Text style={{ fontSize: 12, marginBottom: 15, paddingHorizontal: 11,fontStyle:"italic" }}>
         Select another employee below
        </Text>
        <Dropdown
          data={employeeList.map((employee) => ({
            label: employee.Username,
            value: employee.EmployeeId,
          }))}
          labelField="label"
          valueField="value"
          placeholder="Select an Employee"
          value={selectedEmployeeId}
          onChange={(item) => handleEmployeeChange(item.value)}
          style={styles.dropdown}
          containerStyle={styles.dropdownContainer}
        />
      </View>

      <AreaChartGifted data1={chartData.data1} data2={chartData.data2} />

      <View style={{ marginTop: 0, paddingHorizontal: 20 }}>
  <View style={{ flexDirection: 'row', marginTop: 0,marginBottom:10 }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
      <View style={{
        width: 10, 
        height: 10, 
        borderRadius: 5, 
        backgroundColor: '#8a56ce', 
        marginRight: 5
      }} />
      <Text style={{ fontSize: 12 }}>
        {employeeList.find((employee) => employee.UserId === userId)?.Username}
      </Text>
    </View>

    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{
        width: 10, 
        height: 10, 
        borderRadius: 5, 
        backgroundColor: '#56acce', 
        marginRight: 5
      }} />
      <Text style={{ fontSize: 12 }}>
        {employeeList.find((employee) => employee.EmployeeId === selectedEmployeeId)?.Username}
      </Text>
    </View>
  </View>
</View>

    </View>
  ) : (
    <Text style={{padding:20,fontStyle:"italic"}}>Sorry, we found no timesheet data for this employee</Text>
  )}
</View>




        <View style={{ height: 50 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  card3: {
    backgroundColor: 'white',
    borderRadius: 4,
    marginVertical: 10,
    elevation: 3,
    padding:20,
    marginHorizontal: 20,
  },
  projectName: {
    fontSize: 18,
    color: "#333",
  },
  status: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
    marginTop: 4,
  },
  dropdownContainer: {
    marginBottom: 20,
    width: '80%',
  },
  dropdown: {
    height: 35,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
    width:"98%",
  },
});

