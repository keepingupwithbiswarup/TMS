import {
    StyleSheet,
    Text,
    View,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
    Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import MemberCard from '../components/MemberCard';
import { User } from '../utilities/types';

const TeamMembers = ({ route, navigation }: { route: any; navigation: any }) => {
    const { projectId } = route.params;
    const [teamMembers, setTeamMembers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
    const [isSelectionMode, setIsSelectionMode] = useState(false);

    const fetchProjectTeamMembers = async () => {
        try {
            setLoading(true);
            setError(null);

            const [teamsResponse, teamMembersResponse, employeesResponse] =
                await Promise.all([
                    fetch('http://192.168.10.122:5000/api/teams'),
                    fetch('http://192.168.10.122:5000/api/teammembers'),
                    fetch('http://192.168.10.122:5000/api/employees'),
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

    const toggleSelection = (user: User) => {
        setSelectedMembers((prev) => {
            const isSelected = prev.some(
                (selected) => selected.EmployeeId === user.EmployeeId
            );

            const updatedSelection = isSelected
                ? prev.filter((selected) => selected.EmployeeId !== user.EmployeeId)
                : [...prev, user];

            if (updatedSelection.length === 0) {
                setIsSelectionMode(false);
            }

            return updatedSelection;
        });
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
                    <Image
                        source={
                            isSelectionMode
                                ? require('../assets/cancel.png')
                                : require('../assets/back-arrow.png')
                        }
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={isSelectionMode ? [styles.label, { fontSize: 17 }] : styles.label}>
                    {isSelectionMode
                        ? `${selectedMembers.length} Selected`
                        : 'Team Members'}
                </Text>

                {isSelectionMode && (
                    <TouchableOpacity
                        onPress={() => {

                            setSelectedMembers([]);
                            setIsSelectionMode(false);
                        }}
                        style={styles.deleteButton}
                    >
                        <Image
                            source={require('../assets/delete-icon.png')}
                            style={styles.deleteIcon}
                        />
                    </TouchableOpacity>
                )}
            </View>


            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.error}>{error}</Text>
            ) : (
                <FlatList
                    data={teamMembers}
                    keyExtractor={(item) => item.EmployeeId.toString()}
                    renderItem={({ item }) => (
                        <MemberCard
                            name={item.Username}
                            department={item.Department || 'No Department'}
                            role={item.Role}
                            onPress={() =>
                                isSelectionMode ? toggleSelection(item) : {}
                            }
                            onLongPress={() => {
                                setIsSelectionMode(true);
                                toggleSelection(item);
                            }}
                            isSelected={selectedMembers.some(
                                (selected) => selected.EmployeeId === item.EmployeeId
                            )}
                        />
                    )}
                />
            )}
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
        paddingVertical: 30,
    },
    backButton: {
        marginRight: 10,
    },
    backIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    label: {
        fontSize: 25,
        fontWeight: 'bold',
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

});
