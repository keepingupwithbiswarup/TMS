import React, { useEffect, useState } from 'react';
import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import IpRoute from '../utilities/iproute';

interface TimesheetUpdateModalProps {
    visible: boolean;
    onClose: () => void;
    timesheetId: number;
}

interface DropdownItem {
    label: string;
    value: string | number;
}

const TimesheetUpdateModal: React.FC<TimesheetUpdateModalProps> = ({ visible, onClose, timesheetId }) => {
    const [date, setDate] = useState(new Date());
    const [startTime, setStartTime] = useState<Date | null>(null);
    const [endTime, setEndTime] = useState<Date | null>(null);
    const [comments, setComments] = useState('');

    const [projectOpen, setProjectOpen] = useState(false);
    const [taskOpen, setTaskOpen] = useState(false);
    const [subtaskOpen, setSubtaskOpen] = useState(false);

    const [projectValue, setProjectValue] = useState<string>('');
    const [taskValue, setTaskValue] = useState<string>('');
    const [subtaskValue, setSubtaskValue] = useState<string>('');

    const [projectItems, setProjectItems] = useState<DropdownItem[]>([]);
    const [taskItems, setTaskItems] = useState<DropdownItem[]>([]);
    const [subtaskItems, setSubtaskItems] = useState<DropdownItem[]>([]);

    const [pickerVisible, setPickerVisible] = useState({
        date: false,
        startTime: false,
        endTime: false,
    });

    const fetchUserData = async () => {
        try {
            const user = await AsyncStorage.getItem('currentUser');
            if (!user) {
                console.error('No user found in AsyncStorage');
                return;
            }

            const { EmployeeId } = JSON.parse(user);

            const teamResponse = await fetch(`http://${IpRoute}/api/teammembers`);
            const allTeamMembers = await teamResponse.json();
            const userTeams = allTeamMembers.filter((team: any) => team.EmployeeId === EmployeeId);
            const teamIds = userTeams.map((team: any) => team.TeamId);

            const teamProjectsResponse = await fetch(`http://${IpRoute}/api/teams`);
            const allTeams = await teamProjectsResponse.json();
            const userTeamProjects = allTeams.filter((team: any) => teamIds.includes(team.TeamId));
            const projectIds = userTeamProjects.map((team: any) => team.ProjectId);

            const projectResponse = await fetch(`http://${IpRoute}/api/projects`);
            const allProjects = await projectResponse.json();
            const userProjects = allProjects.filter((project: any) => projectIds.includes(project.ProjectId));

            const formattedProjects = userProjects.map((project: any) => ({
                label: project.ProjectName,
                value: project.ProjectId,
            }));
            setProjectItems(formattedProjects);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchTimesheetData = async (id: number) => {
        try {
            const response = await fetch(`http://${IpRoute}/api/timesheetdata`);
            const timesheetsData = await response.json();
            const timesheetData = timesheetsData.find((timesheet: any) => timesheet.TimesheetId === id);

            if (!timesheetData) {
                console.error('Timesheet not found');
                return;
            }
            if (response.ok) {
                
                setDate(new Date(timesheetData.DateInfo));
                setStartTime(new Date(timesheetData.StartTime));
                setEndTime(new Date(timesheetData.EndTime));
                setComments(timesheetData.Description);
                setProjectValue(timesheetData.ProjectId);
                setTaskValue(timesheetData.TaskId);
                setSubtaskValue(timesheetData.SubTaskId);

                await handleProjectChange(timesheetData.ProjectId);
                await handleTaskChange(timesheetData.TaskId);
                await handleSubtaskChange(timesheetData.SubTaskId);
            } else {
                console.error('Error fetching timesheet data:', timesheetData.error);
            }
        } catch (error) {
            console.error('Network Error:', error);
        }
    };

    const handleProjectChange = async (projectId: string) => {
        try {
            setProjectValue(projectId);
            setTaskValue('');
            setSubtaskValue('');
            setTaskItems([]);
            setSubtaskItems([]);

            const taskResponse = await fetch(`http://${IpRoute}/api/tasks`);
            const allTasks = await taskResponse.json();

            const projectTasks = allTasks.filter((task: any) => task.ProjectId === projectId);
            const formattedTasks = projectTasks.map((task: any) => ({
                label: task.TaskName,
                value: task.TaskId,
            }));

            setTaskItems(formattedTasks);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleTaskChange = async (taskId: string) => {
        try {
            setTaskValue(taskId);
            setSubtaskValue('');
            setSubtaskItems([]);

            const subtaskResponse = await fetch(`http://${IpRoute}/api/subtasks`);
            const allSubtasks = await subtaskResponse.json();

            const taskSubtasks = allSubtasks.filter((subtask: any) => subtask.TaskId === taskId);
            const formattedSubtasks = taskSubtasks.map((subtask: any) => ({
                label: subtask.SubTaskName,
                value: subtask.SubTaskId,
            }));

            setSubtaskItems(formattedSubtasks);
        } catch (error) {
            console.error('Error fetching subtasks:', error);
        }
    };

    const handleSubtaskChange = async (subtaskId: string) => {
        setSubtaskValue(subtaskId);
    };

    const calculateTotalHours = (): string => {
        if (startTime && endTime) {
            const diff = endTime.getTime() - startTime.getTime();
            if (diff > 0) {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                return `${hours}hr ${minutes}mins`;
            }
        }
        return '0hr 0mins';
    };

    useEffect(() => {
        if (projectValue) {
            handleProjectChange(projectValue);
        }
    }, [projectValue]);

    useEffect(() => {
        if (taskValue) {
            handleTaskChange(taskValue);
        }
    }, [taskValue]);

    const saveTimesheet = async () => {
        if (!projectValue || !taskValue || !subtaskValue || !startTime || !endTime || !comments) {
            Alert.alert('Validation Error', 'Please fill out all required fields.');
            return;
        }

        const payload = {
            timesheetId:timesheetId,
            subTaskId: subtaskValue,
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            description: comments,
            status: 'Unapproved',
            dateInfo: date.toISOString().split('T')[0],
            employeeId: await getEmployeeId(),
            projectId: projectValue,
        };

        try {
            const response = await fetch(`http://${IpRoute}/api/updatetimesheet`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Timesheet updated successfully.');
                onClose();
            } else {
                console.error('API Error:', result.error);
                Alert.alert('Error', result.error || 'Failed to update timesheet.');
            }
        } catch (error) {
            console.error('Network Error:', error);
            Alert.alert('Error', 'An error occurred while saving the timesheet.');
        }
    };

    const getEmployeeId = async (): Promise<number> => {
        const user = await AsyncStorage.getItem('currentUser');
        if (!user) {
            throw new Error('No user found in AsyncStorage');
        }
        const { EmployeeId } = JSON.parse(user);
        return EmployeeId;
    };

    useEffect(() => {
        if (timesheetId) {
            fetchTimesheetData(timesheetId);
        }
    }, [timesheetId]);

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <Modal visible={visible} transparent animationType="slide">
            <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.headerTitle}>Update Timesheet Entry</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Image source={require('../assets/cancel.png')} style={styles.closeButton} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.infoContainer}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Date</Text>
                            <TouchableOpacity onPress={() => setPickerVisible({ ...pickerVisible, date: true })}>
                                <Text style={styles.infoValue}>
                                    {date.toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.infoItem, { alignItems: "flex-end" }]}>
                            <Text style={styles.infoLabel}>Total Time</Text>
                            <Text style={styles.infoValue}>{calculateTotalHours()}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <View style={[styles.section, projectOpen && { zIndex: 10 }]}>
                            <Text style={styles.label}>Project</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholder="Select Project"
                                data={projectItems}
                                value={projectValue}
                                onChange={(item: any) => setProjectValue(item.value)}
                                labelField="label"
                                valueField="value"
                            />
                        </View>

                        <View style={[styles.section, taskOpen && { zIndex: 9 }]}>
                            <Text style={styles.label}>Task</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholder="Select Task"
                                data={taskItems}
                                value={taskValue}
                                onChange={(item: any) => setTaskValue(item.value)}
                                labelField="label"
                                valueField="value"
                            />
                        </View>

                        <View style={[styles.section, subtaskOpen && { zIndex: 8 }]}>
                            <Text style={styles.label}>Subtask</Text>
                            <Dropdown
                                style={styles.dropdown}
                                placeholder="Select Subtask"
                                data={subtaskItems}
                                value={subtaskValue}
                                onChange={(item: any) => setSubtaskValue(item.value)}
                                labelField="label"
                                valueField="value"
                            />
                        </View>

                        <View style={styles.sectionRow}>
                            <View style={styles.timeInputContainer}>
                                <Text style={styles.label}>Start Time</Text>
                                <TouchableOpacity
                                    onPress={() => setPickerVisible({ ...pickerVisible, startTime: true })}
                                    style={styles.input}>
                                    <Text>{startTime ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select Start Time'}</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.timeInputContainer}>
                                <Text style={styles.label}>End Time</Text>
                                <TouchableOpacity
                                    onPress={() => setPickerVisible({ ...pickerVisible, endTime: true })}
                                    style={styles.input}>
                                    <Text>{endTime ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Select End Time'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.label}>Add Comments</Text>
                            <TextInput
                                style={[styles.input, styles.commentsInput]}
                                value={comments}
                                onChangeText={setComments}
                                multiline
                            />
                        </View>

                        <TouchableOpacity style={styles.saveButton} onPress={saveTimesheet}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                    </View>

                    <DateTimePickerModal
                        isVisible={pickerVisible.date}
                        mode="date"
                        onConfirm={(selectedDate) => {
                            setDate(selectedDate);
                            setPickerVisible({ ...pickerVisible, date: false });
                        }}
                        onCancel={() => setPickerVisible({ ...pickerVisible, date: false })}
                    />
                    <DateTimePickerModal
                        isVisible={pickerVisible.startTime}
                        mode="time"
                        onConfirm={(time) => {
                            setStartTime(time);
                            setPickerVisible({ ...pickerVisible, startTime: false });
                        }}
                        onCancel={() => setPickerVisible({ ...pickerVisible, startTime: false })}
                    />
                    <DateTimePickerModal
                        isVisible={pickerVisible.endTime}
                        mode="time"
                        onConfirm={(time) => {
                            if (!startTime || time > startTime) {
                                setEndTime(time);
                            } else {
                                Alert.alert('End time must be after start time.');
                            }
                            setPickerVisible({ ...pickerVisible, endTime: false });
                        }}
                        onCancel={() => setPickerVisible({ ...pickerVisible, endTime: false })}
                    />
                </View>
            </SafeAreaView>
        </Modal>


    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        margin: 20,
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        height: 20,
        width: 20,
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        paddingHorizontal: 5,
    },
    infoItem: {
        alignItems: 'flex-start',
    },
    infoLabel: {
        fontSize: 13,
        color: 'gray',
        paddingBottom: 5,
    },
    infoValue: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 20,
    },
    label: {
        fontSize: 12,
        marginBottom: 8,
        color: 'gray',
    },
    dropdown: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        backgroundColor: '#fff',
        padding: 10,
    },
    dropdownContainer: {
        borderWidth: 1,
        borderColor: 'gray',
        backgroundColor: '#fff',
        zIndex: 9999,
    },
    sectionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    timeInputContainer: {
        flex: 1,
        marginRight: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 10,
        fontSize: 16,
    },
    commentsInput: {
        height: 80,
        textAlignVertical: 'top',
    },
    saveButton: {
        backgroundColor: '#117554',
        borderRadius: 20,
        alignItems: 'center',
        paddingVertical: 12,
    },
    saveButtonText: {
        color: 'white',
        fontSize: 14,
    },
});

export default TimesheetUpdateModal;
