import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { User } from '../utilities/types';
import Header from '../components/Header';
import MemberCard from '../components/MemberCard';

interface DepartmentDetailsProps {
  department: any;
  route: any;
  navigation: any;
}

interface Department {
  DeptId: number;
  DeptName: string;
  DeptSize: string;
  DeptType: string;
}



const DepartmentMembers: React.FC<DepartmentDetailsProps> = ({ department }) => {
  const [departmentObj, setDepartmentObj] = useState<Department>();
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const departmentId = department;

  useFocusEffect(
    React.useCallback(() => {
      const fetchDepartmentsAndEmployees = async () => {
        try {
          setLoading(true);
          const departmentResponse = await fetch(
            'http://192.168.10.137:5000/api/departments'
          );
          const departmentData = await departmentResponse.json();
          const matchedDepartment = departmentData.find(
            (dept: Department) => dept.DeptId === departmentId
          );
          setDepartmentObj(matchedDepartment);

          if (!matchedDepartment) {
            console.error('Department not found!');
            setEmployees([]);
            return;
          }


          const employeesResponse = await fetch(
            'http://192.168.10.137:5000/api/employees'
          );
          const employeesData = await employeesResponse.json();


          const matchedEmployees = employeesData.filter(
            (emp: User) =>
              emp.Department === matchedDepartment.DeptName
          );

          setEmployees(matchedEmployees);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchDepartmentsAndEmployees();
    }, [departmentId])
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4a6fe9" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 ,backgroundColor: 'white'}}>    
      <Header headingText="Members" />
      <View style={styles.container}>
        
        {employees.length > 0 ? (
          <FlatList
            data={employees}
            keyExtractor={(item) => item.EmployeeId.toString()}
            renderItem={({ item }) => (
              <MemberCard name={item.Username} department={item.Department!} role={item.Role} onPress={()=>{}}></MemberCard>
            )}
          />
        ) : (
          <View style={styles.noEmployeesContainer}>
            <Text style={styles.noEmployeesText}>No employees found.</Text>
          </View>
        )}
      </View>
    </View>

  );
};

export default DepartmentMembers;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: 'f8f9fa',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  employeeCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    elevation:5,

  },
  employeeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  employeeDetails: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
  noEmployeesContainer: {
    justifyContent: 'center',
    alignItems: 'center',

  },
  noEmployeesText: {
    fontSize: 16,
    color: '#999',
  },
});
