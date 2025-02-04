import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    SectionList,
    Image,
    TouchableOpacity,
    Alert
} from 'react-native';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import { SwipeListView } from 'react-native-swipe-list-view';
import IpRoute from '../utilities/iproute';
import { useFocusEffect } from '@react-navigation/native';
import TimeEntryModal from '../components/TimesheetEntryModal';
import TimesheetUpdateModal from '../components/TimesheetUpdateModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomModal from '../components/CustomModal';
import OngoingCustomModal from '../components/OngoingCustomModal';
import TimesheetCustomModal from '../components/TimesheetCustomModal';

type TimesheetEntry = {
    TimesheetEmpId: number;
    EmployeeId: number;
    Username: string;
    ProjectId: number;
    ProjectName: string;
    TimesheetId: number;
    DateInfo: string;
    StartTime: string;
    EndTime: string;
    Description: string;
    Status: string;
    SubTaskId: number;
    SubTaskName: string;
    TaskId: number;
    TaskName: string;
};

const Timesheets = ({ navigation }: { navigation: any }) => {
    const [selectedDate, setSelectedDate] = useState(moment());
    const [timesheetData, setTimesheetData] = useState<TimesheetEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);

    const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
    const [timesheetId, setTimesheetId] = useState<number>(0);

    // States for the approval modal and selected timesheet
    const [isTimesheetCustomModalVisible, setTimesheetCustomModalVisible] = useState(false);
    const [selectedTimesheetForApproval, setSelectedTimesheetForApproval] = useState<number | null>(null);

    const getEmployeeId = async (): Promise<number> => {
        const user = await AsyncStorage.getItem('currentUser');
        if (!user) {
            throw new Error('No user found in AsyncStorage');
        }
        const { EmployeeId } = JSON.parse(user);
        return EmployeeId;
    };

    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    useEffect(() => {
        const fetchCurrentUserId = async () => {
            const id = await getEmployeeId();
            setCurrentUserId(id);
        };

        fetchCurrentUserId();
    }, []);

    const fetchTimesheetData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://${IpRoute}/api/timesheetdata`);
            if (!response.ok) {
                throw new Error('Failed to fetch timesheet data');
            }
            const data: TimesheetEntry[] = await response.json();
            setTimesheetData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchTimesheetData();
        }, [])
    );

    const filteredTimesheetData = timesheetData.filter(
        (item) => moment(item.DateInfo).format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
    );

    const sortedData = filteredTimesheetData.sort((a, b) =>
        a.ProjectName.localeCompare(b.ProjectName)
    );

    const groupedData = sortedData.reduce(
        (acc: { [key: string]: TimesheetEntry[] }, item) => {
            const projectName = item.ProjectName;
            if (!acc[projectName]) {
                acc[projectName] = [];
            }
            acc[projectName].push(item);
            return acc;
        },
        {}
    );

    const openTimesheetUpdateModal = (id: number) => {
        setTimesheetId(id);
        setIsUpdateModalVisible(true);
    };

    // Function to update timesheet status via PUT endpoint
    const updateTimesheetStatus = async (timesheetId: number, status: string) => {
        try {
            const response = await fetch(`http://${IpRoute}/api/approvetimesheetsubtask`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ timesheetId, status }),
            });
            if (!response.ok) {
                throw new Error('Failed to update timesheet status');
            }
            // Refresh data after successful update
            fetchTimesheetData();
        } catch (error: any) {
            console.error(error);
            setError(error.message);
        }
    };

    const sections = Object.keys(groupedData).map((projectName) => ({
        title: projectName,
        data: groupedData[projectName],
    }));

    const TimesheetCard: React.FC<{ item: TimesheetEntry; onDelete: () => void }> = ({
        item,
        onDelete,
    }) => {
        const formattedStartTime = moment(item.StartTime).format('h:mm A');
        const formattedEndTime = moment(item.EndTime).format('h:mm A');
        const start = moment(item.StartTime);
        const end = moment(item.EndTime);
        const duration = moment.duration(end.diff(start));
        const hours = duration.hours();
        const minutes = duration.minutes();
        const durationString = `${hours} hr ${minutes} mins`;

        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
                <View
                    style={{
                        flexDirection: 'column',
                        marginLeft: 35,
                        marginRight: 25,
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                    }}
                >
                    <Text style={{ paddingVertical: 12, color: '#686D76', fontSize: 13 }}>
                        {formattedStartTime}
                    </Text>
                    <View
                        style={{
                            borderLeftColor: '#BBBFCA',
                            borderLeftWidth: 0.9,
                            height: 80,
                            marginLeft: 5,
                            borderStyle: 'dashed',
                        }}
                    />
                    <Text style={{ paddingVertical: 12, color: '#686D76', fontSize: 13 }}>
                        {formattedEndTime}
                    </Text>
                </View>

                <View style={styles.cardContainer}>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate('TimesheetProject', {
                                projectId: item.ProjectId,
                                taskId: item.TaskId,
                                subtaskId: item.SubTaskId,
                                timesheetId: item.TimesheetId,
                            })
                        }
                    >
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={[styles.textBold, { flex: 1 }]}>{String(item.ProjectName)}</Text>
                            <View style={{ flexDirection: 'row', gap: 12 }}>
                                {item.Status === 'Unapproved' ? (
                                    <TouchableOpacity
                                        onPress={() => {
                                            setSelectedTimesheetForApproval(item.TimesheetId);
                                            setTimesheetCustomModalVisible(true);
                                        }}
                                    >
                                        <Image
                                            source={require('../assets/unapproved.png')}
                                            style={{ width: 20, height: 20, tintColor: 'red' }}
                                        />
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity  onPress={() => {
                                        setSelectedTimesheetForApproval(item.TimesheetId);
                                        setTimesheetCustomModalVisible(true);
                                    }}>
                                        <Image
                                            source={require('../assets/approved.png')}
                                            style={{ width: 20, height: 20, tintColor: 'green' }}
                                        />
                                    </TouchableOpacity>
                                )}
                                <TouchableOpacity onPress={() => openTimesheetUpdateModal(item.TimesheetId)}>
                                    <Image
                                        source={require('../assets/pencil-icon.png')}
                                        style={{ width: 20, height: 20 }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <Text style={{ fontSize: 14, paddingTop: 8 }}>Task | {item.TaskName}</Text>
                        <Text style={{ fontSize: 14, paddingTop: 8 }}>Subtask | {item.SubTaskName}</Text>
                        <View
                            style={{
                                borderLeftColor: '#6D9886',
                                borderLeftWidth: 3,
                                borderRadius: 3,
                                padding: 5,
                                marginVertical: 10,
                                alignItems: 'center',
                                flexDirection: 'row',
                            }}
                        >
                            <Image
                                style={{ height: 25, width: 25, marginRight: 5 }}
                                source={require('../assets/report.png')}
                            />
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.textRegular, { color: '#898B8A' }]}>
                                    {item.Username} commented,
                                </Text>
                                <Text style={{ color: 'black', marginTop: 3, fontSize: 15, marginLeft: 3 }}>
                                    {item.Description}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.hoursText}>
                            {item.Username} worked for {durationString}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const handleDelete = (timesheetId: number) => {
        Alert.alert('Delete', 'Are you sure you want to delete this timesheet entry?', [
            { text: 'Cancel' },
            {
                text: 'Delete',
                onPress: async () => {
                    setLoading(true);
                    try {
                        const response = await fetch(`http://${IpRoute}/api/deletetimesheet`, {
                            method: 'DELETE',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ timesheetId }),
                        });

                        if (response.ok) {
                            fetchTimesheetData();
                        } else {
                            throw new Error('Failed to delete the entry');
                        }
                    } catch (err: any) {
                        setError(err.message);
                    } finally {
                        setLoading(false);
                    }
                },
            },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer2}>
                <Text style={styles.headerText}>Timesheets</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.plusButton}>
                    <Image source={require('../assets/add-icon.png')} style={styles.plusIcon} />
                </TouchableOpacity>
            </View>

            <View style={styles.headerContainer}>
                <CalendarStrip
                    scrollable
                    style={{ height: 110, paddingTop: 10, paddingBottom: 10 }}
                    calendarColor={'#fff'}
                    calendarHeaderStyle={{
                        color: '#000',
                        fontSize: 18,
                        marginBottom: 20,
                    }}
                    dateNumberStyle={{
                        color: '#000',
                        fontSize: 20,
                        fontWeight: 'regular',
                    }}
                    dateNameStyle={{
                        color: '#000',
                        fontSize: 12,
                        marginBottom: 5,
                    }}
                    highlightDateNumberStyle={{
                        color: '#000',
                        fontSize: 20,
                        fontWeight: 'regular',
                    }}
                    highlightDateNameStyle={{ color: '#000', fontSize: 12 }}
                    highlightDateContainerStyle={{
                        borderColor: '#007AFF',
                        borderBottomWidth: 4,
                        paddingBottom: 5,
                        borderRadius: 5,
                    }}
                    selectedDate={selectedDate}
                    onDateSelected={(date) => setSelectedDate(moment(date))}
                    startingDate={moment().startOf('isoWeek')}
                    datesBlacklist={(date) => date.isAfter(moment(), 'day')}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <SectionList
                    sections={sections}
                    renderSectionHeader={({ section: { title } }) => (
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionHeaderText}>{title}</Text>
                        </View>
                    )}
                    renderItem={({ item }: { item: TimesheetEntry }) => (
                        <SwipeListView
                            data={[item]}
                            renderItem={({ item }) => (
                                <TimesheetCard item={item} onDelete={() => handleDelete(item.TimesheetId)} />
                            )}
                            renderHiddenItem={({ item }) => (
                                <View style={styles.hiddenItem}>
                                    <TouchableOpacity style={{ padding: 12 }} onPress={() => handleDelete(item.TimesheetId)}>
                                        <Image
                                            style={{ height: 30, width: 30, tintColor: 'red' }}
                                            source={require('../assets/delete-icon.png')}
                                        />
                                    </TouchableOpacity>
                                </View>
                            )}
                            rightOpenValue={-75}
                            disableRightSwipe
                            keyExtractor={(item: TimesheetEntry) => item.TimesheetId.toString()}
                        />
                    )}
                    keyExtractor={(item: TimesheetEntry) => item.TimesheetId.toString()}
                    ListEmptyComponent={<Text style={styles.noDataText}>No timesheet for selected date</Text>}
                />
            )}

            <TimeEntryModal visible={isModalVisible} onClose={() => setModalVisible(false)} />

            {isUpdateModalVisible && (
                <TimesheetUpdateModal
                    visible={isUpdateModalVisible}
                    onClose={() => setIsUpdateModalVisible(false)}
                    timesheetId={timesheetId}
                />
            )}

            {/* Timesheet Approval Modal */}
            <TimesheetCustomModal
                visible={isTimesheetCustomModalVisible}
                cancelModal={() => setTimesheetCustomModalVisible(false)}
                title="Do you want to approve or disapprove this timesheet?"
                subtitle="Approving would mean validating the work"
                approve={() => {
                    if (selectedTimesheetForApproval) {
                        updateTimesheetStatus(selectedTimesheetForApproval, 'Approved');
                        setTimesheetCustomModalVisible(false);
                    }
                }}
                unapprove={() => {
                    if (selectedTimesheetForApproval) {
                        updateTimesheetStatus(selectedTimesheetForApproval, 'Unapproved');
                        setTimesheetCustomModalVisible(false);
                    }
                }}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    headerContainer: {
        padding: 16,
        backgroundColor: '#fff',
    },
    hiddenItem: {
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'flex-end',
        flex: 1,
        padding: 10,
    },
    cardContainer: {
        backgroundColor: '#fff',
        marginTop: 5,
        padding: 16,
        borderRadius: 12,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        borderLeftColor: '#117554',
        borderLeftWidth: 5,
        elevation: 2,
        flex: 1,
    },
    textBold: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 2,
    },
    textRegular: {
        fontSize: 13,
        marginBottom: 2,
    },
    hoursText: {
        fontSize: 14,
        marginTop: 2,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontSize: 16,
        marginTop: 20,
    },
    noDataText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: '#333',
        fontStyle: 'italic',
    },
    sectionHeader: {
        backgroundColor: '#F5F7F8',
        paddingVertical: 15,
        paddingHorizontal: 16,
        marginVertical: 10,
    },
    sectionHeaderText: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#45474B',
    },
    backButton: {
        position: 'absolute',
        left: 25,
        top: 21,
        zIndex: 10,
    },
    backIcon: {
        width: 16,
        height: 16,
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
        right: 25,
        top: 20,
        zIndex: 10,
    },
    plusIcon: {
        width: 23,
        height: 23,
        resizeMode: 'contain',
    },
    headerContainer2: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 15,
        elevation: 1,
        marginBottom: 1,
    },
});

export default Timesheets;
