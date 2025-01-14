import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import Header from '../components/Header';

const AddSubTask = ({ route }: { route: any }) => {
    const { taskId } = route.params;

    const [subTaskName, setSubTaskName] = useState('');
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
        if (!subTaskName || !description || !dueDate) {
            Alert.alert('Validation Error', 'All fields are required.');
            return;
        }

        const subTaskData = {
            subTaskName,
            description,
            dueDate: dueDate.toISOString(),
            taskId,
        };

        try {
            const response = await fetch('http://192.168.10.122:5000/api/createsubtask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(subTaskData),
            });

            const result = await response.json();

            if (response.status === 201) {
                Alert.alert('Success', 'SubTask created successfully!');
            } else {
                Alert.alert('Error', result.error || 'Failed to create subtask');
            }
        } catch (err) {
            console.error('Error submitting subtask:', err);
            Alert.alert('Error', 'Something went wrong. Please try again later.');
        }
    };

    return (
        <View style={styles.container}>
            <Header headingText="Add New SubTask" />
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
                    <Text style={styles.submitText}>Add SubTask</Text>
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

export default AddSubTask;
