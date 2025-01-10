import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import Header from '../components/Header';
import { User } from '../utilities/types';

interface Department {
    DeptId: number;
    DeptName: string;
    DeptSize: string;
    DeptType: string;
}

const AddTask = ({ route }: { route: any }) => {
    const { projectId } = route.params;

    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState(new Date());
    const [formattedDueDate, setFormattedDueDate] = useState(format(new Date(), "do MMMM, yyyy, EEEE"));
    const [showDatePicker, setShowDatePicker] = useState(false);

   
    const handleDateChange = (event: any, selectedDate: any) => {
        if (Platform.OS === 'android') setShowDatePicker(false);
        if (selectedDate) {
            setDueDate(selectedDate);
            setFormattedDueDate(format(selectedDate, "do MMMM, yyyy, EEEE"));
        }
    };

    const handleSubmit = async () => {
        if (!taskName || !description || !dueDate) {
            Alert.alert('Validation Error', 'All fields are required.');
            return;
        }

        const taskData = {
            taskName,
            description,
            dueDate: dueDate.toISOString(), 
            projectId,
        };

        try {
            const response = await fetch('http://192.168.10.122:5000/api/createtask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskData),
            });

            const result = await response.json();

            if (response.status === 201) {
                Alert.alert('Success', 'Task created successfully!');
                
            } else {
                Alert.alert('Error', result.error || 'Failed to create task');
            }
        } catch (err) {
            console.error('Error submitting task:', err);
            Alert.alert('Error', 'Something went wrong. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            <Header headingText="Add New Task" />
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
                    <Text style={styles.dateText}>
                        {formattedDueDate}
                    </Text>
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
                    <Text style={styles.submitText}>Add Task</Text>
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
});

export default AddTask;
