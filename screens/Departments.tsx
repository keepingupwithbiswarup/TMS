import React, { useCallback, useState } from 'react';
import { Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import CreateDepartmentPage from './CreateDepartmentPage';

interface DepartmentCardProps {
    dept: Department;  
    onPress: () => void;
}

const DepartmentCard = ({ dept, onPress }: DepartmentCardProps) => (
    <TouchableOpacity onPress={onPress} style={styles.cardContainer}>
        <View style={styles.textContainer}>
            <Text style={styles.cardText}>{dept.DeptName} |</Text>
            <Text style={styles.deptTypeText}>{dept.DeptType} Department</Text> 
        </View>
        <Image
            source={require('../assets/arrow-icon.png')} 
            style={styles.arrowIcon}
        />
    </TouchableOpacity>
);

interface Department {
    DeptId: number;
    DeptName: string;
    DeptSize:string;
    DeptType: string;
    
}

const Departments = ({ navigation }: { navigation: any }) => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://192.168.10.137:5000/api/departments');
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchDepartments();
        }, [])
    );
    const filteredDepartments = departments.filter((department) =>
        department.DeptName.toLowerCase().includes(search.toLowerCase())
    );
    

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"white"} barStyle={'dark-content'} />
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image
                        source={require('../assets/back-arrow.png')}
                        style={styles.backIcon}
                    />
                </TouchableOpacity>

                <Text style={styles.headerText}>Departments</Text>

                <TouchableOpacity onPress={() => {navigation.navigate(CreateDepartmentPage)}} style={styles.plusButton}>
                    <Image
                        source={require('../assets/add-icon.png')}
                        style={styles.plusIcon}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.searchBarContainer}>
                <Image
                    source={require('../assets/search.png')}
                    style={styles.searchIcon}
                />
                <TextInput
                    placeholder="Search"
                    placeholderTextColor="#A0A0A0"
                    style={styles.searchInput}
                    value={search}
                    onChangeText={(text) => setSearch(text)}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
            ) : (
                <View>
                    <View style={{ padding: 15, paddingBottom: 17 }}>
                        <Text style={styles.labelText}>Departments: {filteredDepartments.length}</Text>
                    </View>
                    <FlatList
                        data={filteredDepartments}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <DepartmentCard
                                dept={item}
                                onPress={() => navigation.navigate('DepartmentBottomTabNavigator', { department: item.DeptId })}
                            />
                        )}
                        ListEmptyComponent={
                            <Text style={{ textAlign: 'center', marginTop: 20 }}>
                                No departments found.
                            </Text>
                        }
                    />
                </View>
            )}
        </SafeAreaView>
    );
};

export default Departments;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F7F8Fc',
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 15,
        marginBottom: 1,
    },
    labelText: {
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        left: 15,
        top: 20,
        zIndex: 10,
    },
    backIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        alignSelf: 'center',
    },
    plusButton: {
        position: 'absolute',
        right: 20,
        top: 20,
        zIndex: 10,
    },
    plusIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 10,
        elevation: 1,
    },
    searchIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 14,
        color: '#000000',
    },
    cardContainer: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 20,
        paddingHorizontal: 20,

        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
    },
    textContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    cardText: {
        fontSize: 15,
        color: '#000000',
        marginRight: 5, 
    },
    deptTypeText: {
        fontSize: 12,
        color: '#A0A0A0', 
    },
    arrowIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
});
