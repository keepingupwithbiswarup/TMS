import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    SectionList,
    TouchableOpacity,
    FlatList,
    Animated,
    ActivityIndicator,
    Image,
    StatusBar,
    Alert,
} from 'react-native';
import { User } from '../utilities/types';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';





const DepartmentAssign = ({ navigation,route }: { navigation: any,route:any }) => {
    const { departmentName } = route.params;
    const [usersData, setUsersData] = useState<User[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [bouncyScale] = useState(new Animated.Value(1));



    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://192.168.10.137:5000/api/employees');
            const filteredUsers = response.data.filter(
                (user: User) => user.Department === null || user.Department === ''
            );
            setUsersData(filteredUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchUsers();
        }, [])
    );



    const isFormValid = () => {
        return selectedUsers.length > 0;
    };
    

    const filteredUsersData = usersData.filter(user =>
        user.Username.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const groupedUsers = filteredUsersData.reduce<Record<string, User[]>>((acc, user) => {
        const letter = user.Username[0].toUpperCase();
        if (!acc[letter]) acc[letter] = [];
        acc[letter].push(user);
        return acc;
    }, {});

    const sections = Object.keys(groupedUsers)
        .sort()
        .map(letter => ({
            title: letter,
            data: groupedUsers[letter],
        }));

    const handleSelectUser = (user: User) => {
        if (selectedUsers.some(u => u.EmployeeId === user.EmployeeId)) {
            setSelectedUsers(selectedUsers.filter(u => u.EmployeeId !== user.EmployeeId));
        } else {
            setSelectedUsers([...selectedUsers, user]);
            Animated.sequence([
                Animated.timing(bouncyScale, {
                    toValue: 1.2,
                    duration: 50,
                    useNativeDriver: true,
                }),
                Animated.timing(bouncyScale, {
                    toValue: 1,
                    duration: 50,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    const removeSelectedUser = (userId: number) => {
        setSelectedUsers(selectedUsers.filter(user => user.EmployeeId !== userId));
    };



    const renderUserItem = ({ item }: { item: User }) => (
        <TouchableOpacity onPress={() => handleSelectUser(item)} style={styles.userCard}>
            <View style={styles.avatar}>
                <Text style={styles.avatarText}>{item.Username[0]}</Text>
            </View>
            <View style={styles.userDetails}>
                <Text style={styles.userName}>{item.Username}</Text>
                <Text style={styles.userEmail}>{item.Email}</Text>
            </View>
            <TouchableOpacity
                onPress={() => handleSelectUser(item)}
                style={styles.checkbox}>
                {selectedUsers.some(u => u.UserId === item.UserId) && (
                    <Animated.View style={[styles.checkboxSelected, { transform: [{ scale: bouncyScale }] }]} />
                )}
            </TouchableOpacity>
        </TouchableOpacity>
    );

    const assignDepartmentToSelectedUsers = async () => {
        if (!isFormValid()) return;
    
        try {
            setLoading(true);
    
            for (const user of selectedUsers) {
                const employeeId = user.EmployeeId;
    
                try {
                    const response = await fetch(
                        `http://192.168.10.137:5000/api/assigndepartment/${employeeId}`,
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ departmentName }),
                        }
                    );
    
                    if (response.ok) {
                        console.log(`Department successfully assigned to Employee ID: ${employeeId}`);
                        await fetchUsers();
                    } else {
                        const errorData = await response.json();
                        console.error(`Failed to assign department to Employee ID: ${employeeId}`, errorData);
                        Alert.alert(`Failed to assign department to Employee ID: ${employeeId}`);
                    }
                } catch (error) {
                    console.error(`Error assigning department to Employee ID: ${employeeId}`, error);
                    Alert.alert(`Error assigning department to Employee ID: ${employeeId}`);
                }
            }
    
            setSelectedUsers([]);
        } catch (error) {
            console.error('Error assigning department:', error);
            Alert.alert('An error occurred while assigning departments.');
        } finally {
            setLoading(false);
        }
    };
    
    
    
    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#4a6fe9" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor={"white"} barStyle={'dark-content'}></StatusBar>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <Image tintColor={"black"} style={styles.image} source={require('../assets/back-arrow.png')} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Find Employees</Text>
                <TouchableOpacity
                    onPress={assignDepartmentToSelectedUsers}
                    style={[
                        styles.nextButton,
                        { backgroundColor: isFormValid() ? '#602bf9' : '#d3d3d3' }
                    ]}
                    disabled={!isFormValid()}
                >
                    <Text style={styles.btnText}>Add</Text>
                </TouchableOpacity>

            </View>

            <TextInput
                style={styles.searchBar}
                placeholder="Search"
                value={searchQuery}
                onChangeText={text => setSearchQuery(text)}
            />


            {selectedUsers.length > 0 && (
                <FlatList
                    data={selectedUsers}
                    horizontal
                    keyExtractor={item => item.EmployeeId.toString()}
                    style={styles.selectedUsersList}
                    renderItem={({ item }) => (
                        <View style={styles.selectedUser}>
                            <View style={styles.selectedAvatar}>
                                <Text style={styles.avatarText}>{item.Username[0]}</Text>
                            </View>
                            <TouchableOpacity
                                onPress={() => removeSelectedUser(item.EmployeeId)}
                                style={styles.cancelIcon}>
                                <Image source={require('../assets/cancel.png')} style={styles.cancelText} />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}



            <SectionList
                sections={sections}
                keyExtractor={(item, index) => item.EmployeeId.toString() + index}
                renderItem={renderUserItem}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionHeader}>{title}</Text>
                )}
                style={styles.userList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    searchBar: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 8,
        margin: 16,
    },
    userList: {
        flexGrow: 1,
        flexShrink: 1,
    },
    selectedUsersList: {
        padding:0,
        margin:0,
        height: 80,
        maxHeight:80,
        marginLeft:15,
    },

    selectedUser: {
        flexDirection: 'row',
        marginRight: 5,
    },
    selectedAvatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cancelIcon: {
        marginLeft: -16,
        width: 17,
        height: 17,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
        marginTop: 2,

    },
    cancelText: {
        tintColor: "white",
        height: 17,
        width: 17,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#ddd',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 14,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    userDetails: {
        flex: 1,
        marginLeft: 12,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 1.5,
        borderColor: '#888',
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxSelected: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: '#4a6fe9',
        borderColor: "white",
        borderWidth: 2,
    },
    sectionHeader: {
        fontSize: 14,
        paddingLeft: 18,
        paddingVertical: 15,
        backgroundColor: '#f8f8f8',
        color: '#404258',

    },
    nextButton: {
        paddingVertical: 7,
        paddingHorizontal: 18,
        borderRadius: 5,
        width: "auto", 
        alignSelf: "center", 
    },
    headerText: {
        fontSize: 15,
        fontWeight: 'bold',
        textAlign: 'center',
        marginLeft: 35,
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
        paddingVertical: 10,
        paddingHorizontal: 15,
    },
    image: {
        height: 25,
        width: 25,
    },


});

export default DepartmentAssign;
