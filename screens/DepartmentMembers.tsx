import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { User } from '../utilities/types';
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



const DepartmentMembers: React.FC<DepartmentDetailsProps> = ({ department, navigation }) => {
  const [departmentObj, setDepartmentObj] = useState<Department>();
  const [employees, setEmployees] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);

  const departmentId = department;

  const fetchDepartmentsAndEmployees = useCallback(async () => {
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
        (emp: User) => emp.Department === matchedDepartment.DeptName
      );

      setEmployees(matchedEmployees);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [departmentId]);

  
  useFocusEffect(
    React.useCallback(() => {
      fetchDepartmentsAndEmployees();
    }, [fetchDepartmentsAndEmployees])
  );


  const toggleSelection = (user: User) => {
    setSelectedUsers((prevSelected) => {
      const isSelected = prevSelected.some(
        (selected) => selected.EmployeeId === user.EmployeeId
      );

      let updatedSelectedUsers;
      if (isSelected) {
        updatedSelectedUsers = prevSelected.filter(
          (selected) => selected.EmployeeId !== user.EmployeeId
        );
      } else {
        updatedSelectedUsers = [...prevSelected, user];
      }

      if (updatedSelectedUsers.length === 0) {
        setIsSelectionMode(false);
      }

      return updatedSelectedUsers;
    });
  };

  const confirmDeletion = async () => {
    try {
      setLoading(true);
  
      if (selectedUsers.length === 0) {
        console.log('No users selected for deletion');
        return;
      }
  
      const deletionPromises = selectedUsers.map(async (user) => {
        const response = await fetch(
          `http://192.168.10.137:5000/api/removedepartment/${user.EmployeeId}`,
          { method: 'DELETE' }
        );
  
        if (!response.ok) {
          console.error(`Failed to delete user with ID ${user.EmployeeId}`);

        } else {
          console.log(`User with ID ${user.EmployeeId} deleted successfully`);

        }
      });
  
      await Promise.all(deletionPromises);
      await fetchDepartmentsAndEmployees();
  
      setSelectedUsers([]);
      setIsSelectionMode(false);
      setModalVisible(false);
  
 
      console.log('All selected users have been processed');
    } catch (error) {
      console.error('Error deleting users:', error);
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleDeletion = () => {
    setModalVisible(true);
};

const cancelDeletion = () => {
    setModalVisible(false);
};

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4a6fe9" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
         onPress={() => {
          if (isSelectionMode) {
            setSelectedUsers([]); 
            setIsSelectionMode(false);
          } else {
            navigation.goBack();
          }
        }}
          style={styles.backButton}
        >
          <Image
            source={
              isSelectionMode
                ? require('../assets/cancel.png')
                : require('../assets/back-arrow.png')
            }
            style={styles.backIcon}
          />
        </TouchableOpacity>

        <Text style={styles.headerText}>
          {isSelectionMode ? `${selectedUsers.length} Selected` : 'Members'}
        </Text>

        {isSelectionMode ? (
          <TouchableOpacity
            onPress={handleDeletion}
            style={styles.plusButton}
          >
            <Image
              source={require('../assets/delete-icon.png')}
              style={[styles.plusIcon, { tintColor: 'red' }]}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('DepartmentAssign', {
                departmentName: departmentObj?.DeptName,
              })
            }
            style={styles.plusButton}
          >
            <Image
              source={require('../assets/add-icon.png')}
              style={styles.plusIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.container}>
        {employees.length > 0 ? (
          <FlatList
            data={employees}
            keyExtractor={(item) => item.EmployeeId.toString()}
            renderItem={({ item }) => (
              <MemberCard
                name={item.Username}
                department={item.Department!}
                role={item.Role}
                onPress={() =>
                  isSelectionMode ? toggleSelection(item) : {}
                }
                onLongPress={() => {
                  setIsSelectionMode(true);
                  toggleSelection(item);
                }}
                isSelected={selectedUsers.some(
                  (selected) => selected.EmployeeId === item.EmployeeId
                )}
              />
            )}

          />
        ) : (
          <View style={styles.noEmployeesContainer}>
            <Text style={styles.noEmployeesText}>No employees found.</Text>
          </View>
        )}

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={cancelDeletion}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Are you sure you want to remove the selected users?</Text>
              <Text style={styles.modalMessage}>
                Once you remove the selected users, they will no longer be part of the department.
              </Text>
              <View style={styles.modalButtons}>
                <Pressable style={styles.cancelButton} onPress={cancelDeletion}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
                <Pressable style={styles.confirmButton} onPress={confirmDeletion}>
                  <Text style={styles.buttonText}>Yes, Remove</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>

    </View>
  );
};


export default DepartmentMembers;

const styles = StyleSheet.create({
  container: {
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
    marginBottom: 10,
    elevation: 1,

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
    marginTop:20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 15,
    elevation: 1,
    marginBottom: 1,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 20,
    zIndex: 10,
  },
  backIcon: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    marginTop: 3,
  },
  plusButton: {
    position: 'absolute',
    right: 15,
    top: 20,
    zIndex: 10,
  },
  plusIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
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
});
