import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    StyleSheet,
    Button,
} from 'react-native';
import { User } from '../utilities/types';
import CustomModal from '../components/CustomModal';
import TeamMemberCard from '../components/TeamMemberCard';
import IpRoute from '../utilities/iproute';

const TeamMembers = ({ route, navigation }: { route: any; navigation: any }) => {
    const { projectId } = route.params;
    const [teamMembers, setTeamMembers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const fetchProjectTeamMembers = async () => {
        try {
            setLoading(true);
            setError(null);

            const [teamsResponse, teamMembersResponse, employeesResponse] =
                await Promise.all([
                    fetch(`http://${IpRoute}/api/teams`),
                    fetch(`http://${IpRoute}/api/teammembers`),
                    fetch(`http://${IpRoute}/api/employees`),
                ]);

            const [allTeams, allTeamMembers, allEmployees] = await Promise.all([
                teamsResponse.json(),
                teamMembersResponse.json(),
                employeesResponse.json(),
            ]);

            const projectTeams = allTeams.filter(
                (team: any) => team.ProjectId == projectId
            );

            if (projectTeams.length === 0) {
                setError('No teams found for the project');
                setLoading(false);
                return;
            }

            const teamIds = projectTeams.map((team: any) => team.TeamId);
            const projectTeamMembers = allTeamMembers.filter((member: any) =>
                teamIds.includes(member.TeamId)
            );

            if (projectTeamMembers.length === 0) {
                setError('No team members found for the project');
                setLoading(false);
                return;
            }

            const projectEmployees = projectTeamMembers
                .map((member: any) => {
                    const employee = allEmployees.find(
                        (emp: any) => emp.EmployeeId == member.EmployeeId
                    );
                    return employee || null;
                })
                .filter((employee: any) => employee !== null);

            if (projectEmployees.length === 0) {
                setError('No employees found for the project team members');
                setLoading(false);
                return;
            }

            setTeamMembers(projectEmployees);
        } catch (error) {
            console.error('Error fetching team members:', error);
            setError('Failed to load team members');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjectTeamMembers();
    }, [projectId]);

    useEffect(() => {
        fetchProjectTeamMembers();
    }, [projectId]);

    const toggleSelection = (user: User) => {
        setSelectedMembers((prev) => {
            const isSelected = prev.some((selected) => selected.EmployeeId === user.EmployeeId);
            const updatedSelection = isSelected
                ? prev.filter((selected) => selected.EmployeeId !== user.EmployeeId)
                : [...prev, user];

            if (updatedSelection.length === 0) {
                setIsSelectionMode(false);
            }

            return updatedSelection;
        });
    };

    const handleDeleteMembers = async () => {
        try {
            const employeeIds = selectedMembers.map((member) => member.EmployeeId);
            const response = await fetch(`http://${IpRoute}/api/deleteteammembers`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    projectId,
                    employeeIds,
                }),
            });

            if (response.ok) {

                setTeamMembers((prev) =>
                    prev.filter((member) => !employeeIds.includes(member.EmployeeId))
                );
                setSelectedMembers([]);
                setIsSelectionMode(false);
                setIsModalVisible(false);
            } else {
                setError('Failed to delete team members');
            }
        } catch (error) {
            console.error('Error deleting members:', error);
            setError('Error deleting team members');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => {
                        if (isSelectionMode) {
                            setSelectedMembers([]);
                            setIsSelectionMode(false);
                        } else {
                            navigation.goBack();
                        }
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                        <Image
                            source={
                                isSelectionMode
                                    ? require('../assets/cancel.png')
                                    : require('../assets/back2.png')
                            }
                            style={styles.backIcon}
                        />
                        <Text style={{ color: "grey", paddingLeft: 10, }}>Project Details</Text>
                    </View>
                </TouchableOpacity>
                <Text style={isSelectionMode ? [styles.label, { fontSize: 17 }] : styles.label}>
                    {isSelectionMode ? `${selectedMembers.length} Selected` : ''}
                </Text>

                {isSelectionMode && (
                    <TouchableOpacity
                        onPress={() => setIsModalVisible(true)}
                        style={styles.deleteButton}
                    >
                        <Image
                            source={require('../assets/delete-icon.png')}
                            style={styles.deleteIcon}
                        />
                    </TouchableOpacity>
                )}
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center',marginHorizontal:21 }}>
                <Text style={styles.label}>
                    Team
                </Text>
                <TouchableOpacity onPress={() => { }}>
                    <View style={{backgroundColor:"blue",padding:10,borderRadius:30,paddingHorizontal:25}}>
                    <Text style={styles.inviteText} >Invite Members</Text>
                    </View>
                </TouchableOpacity>
            </View>


            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                <FlatList
                    data={teamMembers}
                    keyExtractor={(item) => item.EmployeeId?.toString() || Math.random().toString()}
                    renderItem={({ item }) => (
                        <TeamMemberCard
                            name={item.Username}
                            email={item.Email}
                            status='Enabled'
                            lastLogin='Yesterday'
                            role={item.Role}
                            onPress={() => {
                                if (isSelectionMode) {
                                    toggleSelection(item);
                                }
                            }}
                            onLongPress={() => {
                                setIsSelectionMode(true);
                                toggleSelection(item);
                            }}
                            isSelection={selectedMembers.some(
                                (selected) => selected.EmployeeId === item.EmployeeId
                            )}
                        />
                    )}
                />

            )}

            <CustomModal
                visible={isModalVisible}
                cancelModal={() => setIsModalVisible(false)}
                confirmDeletion={handleDeleteMembers}
                title="Confirm Deletion"
                subtitle={`Are you sure you want to delete ${selectedMembers.length} team member(s)?`}
            />
        </View>
    );
};

export default TeamMembers;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        paddingTop: 30,
    },
    backButton: {
        marginRight: 10,
    },
    backIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    label: {
        fontSize: 35,
        fontWeight: 'bold',
        paddingVertical: 10,
    },
    error: {
        color: 'red',
        fontSize: 16,
        marginTop: 10,
    },
    deleteButton: {
        marginLeft: 10,
    },
    deleteIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
        tintColor: "red",
    },

    inviteText: {
        color: 'white',  
        fontSize: 14,
        fontWeight: 'bold',
    }

});
