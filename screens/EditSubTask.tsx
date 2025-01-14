import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, Platform, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import Header from '../components/Header';

const EditSubTask = ({ route }: { route: any }) => {
    const { subTaskId } = route.params;

    const [subTaskName, setSubTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [formattedDueDate, setFormattedDueDate] = useState('');
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSubTaskDetails = async () => {
            try {
                const response = await fetch('http://192.168.10.122:5000/api/subtasks');
                const subtasks = await response.json();

                if (response.ok) {
                    const subtask = subtasks.find((st: any) => st.SubTaskId === subTaskId);

                    if (subtask) {
                        setSubTaskName(subtask.SubTaskName);
                        setDescription(subtask.Description);
                        const subTaskDueDate = new Date(subtask.DueDate);
                        setDueDate(subTaskDueDate);
                        setFormattedDueDate(format(subTaskDueDate, 'do MMMM, yyyy, EEEE'));
                    } else {
                        Alert.alert('Error', `SubTask with ID ${subTaskId} not found.`);
                    }
                } else {
                    Alert.alert('Error', subtasks.error || 'Failed to fetch subtasks.');
                }
            } catch (error) {
                console.error('Error fetching subtasks:', error);
                Alert.alert('Error', 'Something went wrong while fetching subtasks.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSubTaskDetails();
    }, [subTaskId]);

    const handleDateChange = (event: any, selectedDate: any) => {
        if (Platform.OS === 'android') setShowDatePicker(false);
        if (selectedDate) {
            setDueDate(selectedDate);
            setFormattedDueDate(format(selectedDate, 'do MMMM, yyyy, EEEE'));
        }
    };

    const handleSubmit = async () => {
        if (!subTaskName || !description || !dueDate) {
            Alert.alert('Validation Error', 'All fields are required.');
            return;
        }

        const subTaskData = {
            subTaskId,
            subTaskName,
            description,
            dueDate: dueDate.toISOString(),
        };

        try {
            const response = await fetch('http://192.168.10.122:5000/api/updatesubtask', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subTaskData),
            });

            const result = await response.json();

            if (response.ok) {
                Alert.alert('Success', 'SubTask updated successfully!');
            } else {
                Alert.alert('Error', result.error || 'Failed to update subtask.');
            }
        } catch (err) {
            console.error('Error updating subtask:', err);
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
            <Header headingText="Edit SubTask" />
            <View style={styles.form}>
                <Text style={styles.label}>SubTask Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter subtask name"
                    value={subTaskName}
                    onChangeText={setSubTaskName}
                />

                <Text style={styles.label}>SubTask Details</Text>
                <TextInput
                    style={[styles.input, styles.textArea]}
                    placeholder="Enter subtask description"
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
                    <Text style={styles.submitText}>Update SubTask</Text>
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

export default EditSubTask;
