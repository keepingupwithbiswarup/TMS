import { ActivityIndicator, Alert, Image, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IpRoute from '../utilities/iproute';

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

const DepartmentSetings: React.FC<DepartmentDetailsProps> = ({ department, navigation }) => {
  console.log(department);
  const [deptName, setDeptName] = useState('');
  const [deptType, setDeptType] = useState(null);
  const [open, setOpen] = useState(false);
  const [deptSize, setDeptSize] = useState('');
  const [departmentObj, setDepartmentObj] = useState<Department>();
  const [loading, setLoading] = useState<boolean>(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const departmentId = department;

  // Load the current user from AsyncStorage
  const checkUser = async () => {
    try {
      const userString = await AsyncStorage.getItem('currentUser');
      if (userString) {
        const user = JSON.parse(userString);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error("Error retrieving user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      await checkUser();
    };
    fetchUser();
  }, []);

  // Always register this hook, but its callback will only fetch if the user is a Manager.
  useFocusEffect(
    React.useCallback(() => {
      if (currentUser && (currentUser.Role === 'Manager' || currentUser.Role === 'Admin')) {
        const fetchDepartments = async () => {
          try {
            setLoading(true);
            const response = await fetch(`http://${IpRoute}/api/departments`);
            const data = await response.json();
            const matchedDepartment = data.find(
              (dept: any) => dept.DeptId === departmentId
            );
            if (matchedDepartment) {
              setDepartmentObj(matchedDepartment);
              setDeptName(matchedDepartment.DeptName);
              setDeptType(matchedDepartment.DeptType);
              setDeptSize(matchedDepartment.DeptSize);
            } else {
              Alert.alert("Error", "Department not found.");
            }
          } catch (error) {
            console.error('Error fetching departments:', error);
          } finally {
            setLoading(false);
          }
        };
        fetchDepartments();
      }
    }, [departmentId, currentUser])
  );

  const isFormValid = () => {
    return (
      deptName !== '' &&
      deptType !== '' &&
      deptSize !== '' &&
      (deptName !== departmentObj?.DeptName ||
        deptType !== departmentObj?.DeptType ||
        deptSize !== departmentObj?.DeptSize)
    );
  };

  const handleOrganizationSizeSelect = (size: string) => {
    setDeptSize(size);
  };

  const updateDepartment = async () => {
    if (!deptName || !deptSize || !deptType) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    try {
      const response = await fetch(`http://${IpRoute}/api/updatedepartment/${department}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          deptName,
          deptSize,
          deptType,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Department updated successfully.');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.error || 'Failed to update the department.');
      }
    } catch (error) {
      console.error('Error updating department:', error);
      Alert.alert('Error', 'An unexpected error occurred.');
    }
  };

  // Instead of an early return, always render the same component tree and conditionally show UI.
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={"white"} barStyle={'dark-content'} />
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4a6fe9" />
        </View>
      ) : currentUser && (currentUser.Role !== 'Manager' && currentUser.Role !== 'Admin') ? (
        <Text style={styles.unauthorizedText}>
          Access Denied. You do not have permission to view this page.
        </Text>
      ) : (
        <>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image tintColor={"black"} style={styles.image} source={require('../assets/back-arrow.png')} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={updateDepartment}
              style={[styles.nextButton, { backgroundColor: isFormValid() ? '#602bf9' : '#d3d3d3' }]}
              disabled={!isFormValid()}
            >
              <Text style={styles.btnText}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 20 }} />
          <View>
            <Text style={styles.headerText}>Edit Department</Text>
            <Text style={styles.subText}>Help us create the best experience for you.</Text>
          </View>
          <View style={{ height: 15 }} />
          <View style={{ marginHorizontal: 7 }}>
            <TextInput
              style={styles.input}
              placeholder="Your Department name"
              value={deptName}
              onChangeText={setDeptName}
            />
          </View>

          <View style={{ marginHorizontal: 7, marginTop: 15 }}>
            <DropDownPicker
              open={open}
              value={deptType}
              items={[
                { label: 'IT', value: 'IT' },
                { label: 'Finance', value: 'Finance' },
                { label: 'Marketing', value: 'Marketing' },
                { label: 'HR', value: 'HR' },
                { label: 'Accounting', value: 'Accounting' },
              ]}
              setOpen={setOpen}
              setValue={setDeptType}
              placeholder="Select Industry"
              style={styles.input}
              arrowIconStyle={styles.arrowIconStyle}
              placeholderStyle={styles.placeholderStyle}
              dropDownContainerStyle={styles.dropDownContainer}
              listItemLabelStyle={{ color: "grey" }}
            />

            <View style={styles.organizationSizeContainer}>
              <Text style={styles.label}>Department Size</Text>
              <View style={styles.sizeButtonsContainer}>
                {['1-10', '11-20', '21-50', '51-100', '100+'].map((size) => (
                  <TouchableOpacity
                    key={size}
                    style={[
                      styles.sizeButton,
                      deptSize === size && styles.selectedSizeButton,
                    ]}
                    onPress={() => handleOrganizationSizeSelect(size)}
                  >
                    <Text
                      style={[
                        styles.sizeButtonText,
                        deptSize === size && styles.selectedSizeButtonText,
                      ]}
                    >
                      {size}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

export default DepartmentSetings;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
    padding: 15,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unauthorizedText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: 'red',
  },
  image: {
    height: 25,
    width: 25,
  },
  nextButton: {
    paddingVertical: 12,
    borderRadius: 8,
    width: "20%",
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    fontSize: 25,
    fontWeight: "bold",
    paddingHorizontal: 8,
  },
  subText: {
    fontSize: 14,
    fontWeight: "300",
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 10,
    paddingLeft: 15,
    fontSize: 15,
    color: "#000",
    borderWidth: 1,
    borderColor: "#dcdcdc",
    fontWeight: "bold",
  },
  arrowIconStyle: {
    width: 20,
    height: 20,
  },
  placeholderStyle: {
    color: 'grey',
    fontSize: 15,
  },
  dropDownContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "#dcdcdc",
  },
  organizationSizeContainer: {
    marginTop: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingLeft: 3,
    color: "grey",
  },
  sizeButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 5,
  },
  sizeButton: {
    paddingVertical: 20,
    paddingHorizontal: 19,
    backgroundColor: '#F7F8Fc',
    borderWidth: 1,
    borderColor: '#dcdcdc',
  },
  selectedSizeButton: {
    backgroundColor: '#E5D9F2',
    borderColor: "#602bf9"
  },
  sizeButtonText: {
    fontSize: 14,
    color: '#000',
  },
  selectedSizeButtonText: {
    color: '#000',
  },
});
