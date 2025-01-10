import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, Platform, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../components/Header';
import { format } from 'date-fns';
import { User } from '../utilities/types';
import { useFocusEffect } from '@react-navigation/native';

interface Department {
    DeptId: number;
    DeptName: string;
    DeptSize: string;
    DeptType: string;
  }


const AddProjectScreen = ({route}:{route:any}) => {

    const { department } = route.params;

    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date()); 
    const [formattedDueDate, setFormattedDueDate] = useState(format(new Date(), "do MMMM, yyyy, EEEE"));
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [departmentObj, setDepartmentObj] = useState<Department>();
    
    const [filteredEmployees, setFilteredEmployees] = useState<User[]>([]);
    const [selectedEmployees, setSelectedEmployees] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    
    const fetchDepartmentsAndEmployees = useCallback(async () => {
        try {
          setLoading(true);
          const departmentResponse = await fetch(
            'http://192.168.10.122:5000/api/departments'
          );
          const departmentData = await departmentResponse.json();
          const matchedDepartment = departmentData.find(
            (dept: Department) => dept.DeptId === department
          );
          setDepartmentObj(matchedDepartment);
    
          if (!matchedDepartment) {
            console.error('Department not found!');
            setFilteredEmployees([]);
            return;
          }
    
          const employeesResponse = await fetch(
            'http://192.168.10.122:5000/api/employees'
          );
          const employeesData = await employeesResponse.json();
    
          const matchedEmployees = employeesData.filter(
            (emp: User) => emp.Department === matchedDepartment.DeptName
          );
    
          setFilteredEmployees(matchedEmployees);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setLoading(false);
        }
      }, [department]);
    
      
      useFocusEffect(
        React.useCallback(() => {
          fetchDepartmentsAndEmployees();
        }, [fetchDepartmentsAndEmployees])
      );

    

    const handleDateChange = (event: any, selectedDate: any) => {
        if (Platform.OS === 'android') setShowDatePicker(false);
        if (selectedDate) {
            setDueDate(selectedDate);
            setFormattedDueDate(format(selectedDate, "do MMMM, yyyy, EEEE"));
        }
    };
    console.log(filteredEmployees);

    const toggleEmployeeSelection = (employee: User) => {
        if (selectedEmployees.some((selected) => selected.EmployeeId === employee.EmployeeId)) {
          setSelectedEmployees(selectedEmployees.filter((selected) => selected.EmployeeId !== employee.EmployeeId));
        } else {
          setSelectedEmployees([...selectedEmployees, employee]);
        }
      };

      const handleSubmit = async () => {
        if (!projectName || !description || selectedEmployees.length === 0) {
            Alert.alert('Error', 'Please fill in all fields and select at least one employee.');
            return;
        }
    
        try {
            for (const employee of selectedEmployees) {
                const response = await fetch('http://192.168.10.122:5000/api/createproject', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        projectName,
                        description,
                        dueDate: dueDate,
                        deptId: department,
                        employeeId: employee.EmployeeId,
                    }),
                });
    
                const result = await response.json();
    
                if (!response.ok) {
                    console.error(`Failed for EmployeeId: ${employee.EmployeeId}`, result);
                    Alert.alert('Error', `Failed to add project for employee: ${employee.Username}`);
                    return;
                }
    
                console.log(`Project created for EmployeeId: ${employee.EmployeeId}`, result);
            }
    
            Alert.alert('Success', 'Project and team members added successfully!');
            setProjectName('');
            setDescription('');
            setDueDate(new Date());
            setFormattedDueDate(format(new Date(), 'do MMMM, yyyy, EEEE'));
            setSelectedEmployees([]);
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Something went wrong while adding the project.');
        }
    };
    
      
    
      return (
        <View style={styles.container}>
          <Header headingText="Add New Project" />
          <View style={styles.form}>
            <Text style={styles.label}>Project Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter project name"
              value={projectName}
              onChangeText={setProjectName}
            />
    
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter project description"
              value={description}
              onChangeText={setDescription}
              multiline
            />
    
            <Text style={styles.label}>Due Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
              <Text style={styles.dateText}>
                {formattedDueDate}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dueDate}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            )}
    
    
            <Text style={styles.label}>Find Employees</Text>
            <ScrollView style={styles.employeeList}>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <TouchableOpacity
                    key={employee.EmployeeId}
                    style={[styles.employeeItem, selectedEmployees.some((selected:any) => selected.EmployeeId === employee.EmployeeId) && styles.selectedEmployee]}
                    onPress={() => toggleEmployeeSelection(employee)}
                  >
                    <Text style={styles.employeeName}>{employee.Username}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text>No employees found in this department.</Text>
              )}
            </ScrollView>
    
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Text style={styles.submitText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    };
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: 'white',
      },
      form: {
        padding: 25,
      },
      label: {
        fontSize: 19,
        color: '#333',
        marginBottom: 8,
        marginLeft:2,
      },
      input: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 15,
        borderWidth: 0.7,
        borderColor: 'black',
        marginBottom: 15,
        fontSize: 16,
      },
      textArea: {
        height: 120,
        textAlignVertical: 'top',
      },
      datePicker: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 15,
        borderWidth: 0.7,
        borderColor: 'black',
        justifyContent: 'center',
        marginBottom: 15,
      },
      dateText: {
        fontSize: 14,
        color: '#333',
      },
      submitButton: {
        backgroundColor: '#4a6fe9',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
      },
      submitText: {
        fontSize: 15,
        color: 'white',

      },
      employeeList: {
        maxHeight: 600,
        marginVertical: 10,
        marginTop:5,
      },
      employeeItem: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 15,
        borderWidth: 0.7,
        borderColor: 'black',
        marginBottom: 10,
      },
      employeeName: {
        fontSize: 14,
        color: '#333',
      },
      selectedEmployee: {
        backgroundColor: '#dbe4ff',
        borderColor: '#4a6fe9',
      },
    });
    
    export default AddProjectScreen;