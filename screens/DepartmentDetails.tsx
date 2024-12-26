import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, FlatList, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';

interface DepartmentDetailsProps {
    route: any;
    navigation: any;
}

const DepartmentDetails = ({ route, navigation }: DepartmentDetailsProps) => {
    const { department } = route.params; 
    const [members, setMembers] = useState<any[]>([]);

    // useEffect(() => {
       
    //     fetchMembers(department.DeptName);
    // }, [department]);

    // const fetchMembers = async (deptName: string) => {
    //     try {
    //         const response = await axios.get(`http://192.168.10.137:5000/api/members/${deptName}`);
    //         setMembers(response.data);
    //     } catch (error) {
    //         console.error('Error fetching members:', error);
    //     }
    // };

    // const handleEdit = (memberId: string) => {
       
    //     navigation.navigate('EditMember', { memberId });
    // };

    // const handleDelete = (memberId: string) => {
        
    //     Alert.alert(
    //         'Delete Member',
    //         'Are you sure you want to delete this member?',
    //         [
    //             { text: 'Cancel', style: 'cancel' },
    //             { text: 'Delete', onPress: () => deleteMember(memberId) },
    //         ],
    //         { cancelable: false }
    //     );
    // };

    // const deleteMember = async (memberId: string) => {
    //     try {
    //         await axios.delete(`http://192.168.10.137:5000/api/members/${memberId}`);
    //         setMembers(members.filter(member => member.id !== memberId));
    //     } catch (error) {
    //         console.error('Error deleting member:', error);
    //     }
    // };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Department: {department.DeptName}</Text>
            <Text style={styles.subHeader}>Dept Type: {department.DeptType}</Text>

            <FlatList
                data={members}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.memberCard}>
                        <Text>{item.name}</Text>
                        <TouchableOpacity onPress={() =>{}}>
                            <Text style={styles.editText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {}}>
                            <Text style={styles.deleteText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                )}
                ListEmptyComponent={<Text>No members found.</Text>}
            />

            <Button title="Add Member" onPress={() => navigation.navigate('AddMember', { deptName: department.DeptName })} />
        </View>
    );
};

export default DepartmentDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subHeader: {
        fontSize: 16,
        color: '#A0A0A0',
        marginBottom: 10,
    },
    memberCard: {
        backgroundColor: '#f0f0f0',
        padding: 15,
        marginVertical: 10,
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    editText: {
        color: 'blue',
    },
    deleteText: {
        color: 'red',
    },
});
