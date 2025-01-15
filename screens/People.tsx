import React, { useCallback, useState } from 'react';
import { Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import MemberCard from '../components/MemberCard'; 
import axios from 'axios'; 
import { User } from '../utilities/types';
import { useFocusEffect } from '@react-navigation/native';
import IpRoute from '../utilities/iproute';

const People = ({ navigation }: { navigation: any }) => {
    const [employees, setEmployees] = useState<User[]>([]);
    const [loading, setLoading] = useState(true); 
    const [search, setSearch] = useState('');
    const [sortOption, setSortOption] = useState('name');

    const fetchEmployees = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`http://${IpRoute}/api/employees`);


            setEmployees(response.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
        } finally {
            setLoading(false); 
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchEmployees();
        }, [])
    );

    const filteredEmployees = employees.filter((employee) => {
        const lowerCaseSearch = search.toLowerCase();

        const nameMatch = employee.Username ? employee.Username.toLowerCase().includes(lowerCaseSearch) : false;
        const departmentMatch = employee.Department ? employee.Department.toLowerCase().includes(lowerCaseSearch) : false;
        const roleMatch = employee.Role ? employee.Role.toLowerCase().includes(lowerCaseSearch) : false;

        return nameMatch || departmentMatch || roleMatch;
    });
    const sortedEmployees = filteredEmployees.sort((a, b) => {
        if (sortOption === 'name') {
            return a.Username?.localeCompare(b.Username || '') || 0;
        } else if (sortOption === 'department') {
            return (a.Department?.localeCompare(b.Department || '') || 0);
        }
        return 0;
    });

    const renderHeader = () => (
        <View style={styles.headerContainer}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <Image
                    source={require('../assets/back-arrow.png')}
                    style={styles.backIcon}
                />
            </TouchableOpacity>

            <Text style={styles.headerText}>People Settings</Text>

            <TouchableOpacity onPress={() => {}} style={styles.plusButton}>
                <Image
                    source={require('../assets/add-icon.png')}
                    style={styles.plusIcon}
                />
            </TouchableOpacity>
        </View>
    );

    const renderSearchBar = () => (
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
    );

    const renderResultsInfo = () => (
        <View style={styles.resultsInfoContainer}>
            <Text style={styles.resultsText}>Total Results: {filteredEmployees.length}</Text>
            <TouchableOpacity onPress={() => {}} style={styles.filterButton}>
                <Image
                    source={require('../assets/account-control.png')}
                    style={styles.filterIcon}
                />
            </TouchableOpacity>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"white"} barStyle={'dark-content'} />

            <FlatList
                ListHeaderComponent={
                    <>
                        {renderHeader()}
                        {renderSearchBar()}
                        {renderResultsInfo()}
                    </>
                }
                data={filteredEmployees}
                keyExtractor={(item) => item.EmployeeId.toString()} 
                renderItem={({ item }) => (
                    <MemberCard
                        name={item.Username}
                        department={item.Department === null ? 'No Department' : item.Department}
                        role={item.Role}
                        onPress={() => navigation.navigate('UserProfile', { userId: item.UserId })}
                        onLongPress={() => {}}
                        isSelected={false}
                    />
                )}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>
                        No employees found.
                    </Text>
                }
                ListFooterComponent={
                    loading ? (
                        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
                    ) : null
                }
                contentContainerStyle={{ paddingBottom: 20 }} 
            />
        </SafeAreaView>
    );
};

export default People;

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
        marginBottom: 1,
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
    resultsInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    resultsText: {
        fontSize: 14,
        color: '#000000',
    },
    filterButton: {
        padding: 5,
    },
    filterIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
});
