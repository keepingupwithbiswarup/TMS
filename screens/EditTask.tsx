import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import Header from '../components/Header';
import IpRoute from '../utilities/iproute';

const EditTask = ({ route }: { route: any }) => {
    const { taskId } = route.params;

    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [formattedDueDate, setFormattedDueDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTaskDetails = async () => {
            try {
                const response = await fetch(`http://${IpRoute}/api/tasks`); 
                const tasks = await response.json();
    
                if (response.ok) {
                    const task = tasks.find((t: any) => t.TaskId === taskId); 
    
                    if (task) {
                        setTaskName(task.TaskName);
                        setDescription(task.Description);
                        const taskDueDate = new Date(task.DueDate);
                        setDueDate(taskDueDate);
                        setFormattedDueDate(format(taskDueDate, 'do MMMM, yyyy, EEEE'));
                    } else {
                        Alert.alert('Error', `Task with ID ${taskId} not found.`);
                    }
                } else {
                    Alert.alert('Error', tasks.error || 'Failed to fetch tasks.');
                }
            } catch (error) {
                console.error('Error fetching tasks:', error);
                Alert.alert('Error', 'Something went wrong while fetching tasks.');
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchTaskDetails();
    }, [taskId]);
    

    const handleDateChange = (event: any, selectedDate: any) => {
        if (Platform.OS === 'android') setShowDatePicker(false);
        if (selectedDate) {
            setDueDate(selectedDate);
            setFormattedDueDate(format(selectedDate, 'do MMMM, yyyy, EEEE'));
        }
    };

    const handleSubmit = async () => {
        if (!taskName || !description || !dueDate) {
            Alert.alert('Validation Error', 'All fields are required.');
            return;
        }

        const taskData = {
            taskId,
            taskName,
            description,
            dueDate: dueDate.toISOString(),
        };

        try {
            const response = await fetch(`http://${IpRoute}/api/updatetask`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'Task updated successfully!');
            } else {
                Alert.alert('Error', result.error || 'Failed to update task.');
            }
        } catch (err) {
            console.error('Error updating task:', err);
            Alert.alert('Error', 'Something went wrong. Please try again later.');
        }
    };

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4a6fe9" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Header headingText="Edit Task" />
            <View style={styles.form}>
                <Text style={styles.label}>Task Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter task name"
                    value={taskName}
                    onChangeText={setTaskName}
                />

                <Text style={styles.label}>Task Details</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter task description"
                    value={description}
                    onChangeText={setDescription}
                    multiline
                />

                <Text style={styles.label}>Due Date</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
                    <Text style={styles.dateText}>{formattedDueDate}</Text>
                </TouchableOpacity>
                {showDatePicker && (
                    <DateTimePicker
                        value={dueDate}
                        mode="date"
                        display="default"
                        onChange={handleDateChange}
                    />
                )}

                <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                    <Text style={styles.submitText}>Update Task</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    form: {
        padding: 25,
    },
    label: {
        fontSize: 19,
        color: '#333',
        marginBottom: 8,
        marginLeft: 2,
    },
    input: {
        backgroundColor: '#FFF',
        padding: 15,
        borderRadius: 15,
        borderWidth: 0.7,
        borderColor: 'black',
        marginBottom: 15,
        fontSize: 16,
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    datePicker: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 15,
        borderWidth: 0.7,
        borderColor: 'black',
        justifyContent: 'center',
        marginBottom: 15,
    },
    dateText: {
        fontSize: 14,
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#4a6fe9',
        padding: 15,
        borderRadius: 25,
        alignItems: 'center',
    },
    submitText: {
        fontSize: 15,
        color: 'white',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default EditTask;
