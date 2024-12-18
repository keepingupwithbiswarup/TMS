import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CreateWorkSchedule = ({ navigation }: { navigation: any }) => {
    const [selectedArrangement, setSelectedArrangement] = useState('Fixed');
    const [selectedDays, setSelectedDays] = useState(['M', 'T', 'W', 'T', 'F']);
    type WorkDays = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

    const [workTimes, setWorkTimes] = useState<Record<WorkDays, { start: string; end: string }>>({
        Monday: { start: '9:00 am', end: '5:45 pm' },
        Tuesday: { start: '9:00 am', end: '5:45 pm' },
        Wednesday: { start: '9:00 am', end: '5:45 pm' },
        Thursday: { start: '9:00 am', end: '5:45 pm' },
        Friday: { start: '9:00 am', end: '5:45 pm' },
        Saturday: { start: '9:00 am', end: '5:45 pm' },
        Sunday: { start: '9:00 am', end: '5:45 pm' },
    });


    const toggleDay = (day: string) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };


    const handleTimeChange = (day: WorkDays, type: 'start' | 'end', value: string) => {
        setWorkTimes((prev) => ({
            ...prev,
            [day]: { ...prev[day], [type]: value },
        }));
    };


    return (

        <SafeAreaView style={styles.container}>

            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image source={require('../assets/back-arrow.png')} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Create Work Schedule</Text>
                <TouchableOpacity style={styles.infoButton}>
                    <Image source={require('../assets/info-icon.png')} style={styles.infoIcon} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.bodyContainer}>

                <View>
                    <Text style={styles.label}>Name</Text>
                    <TextInput style={styles.input} placeholder="Enter schedule name" />
                </View>

                <Text style={styles.label}>Work Arrangement</Text>
                <View style={styles.toggleContainer}>
                    {['Fixed', 'Flexible', 'Weekly'].map((item) => (
                        <TouchableOpacity
                            key={item}
                            style={[
                                styles.toggleButton,
                                selectedArrangement === item && styles.toggleButtonSelected,
                            ]}
                            onPress={() => setSelectedArrangement(item)}
                        >
                            <Text
                                style={[
                                    styles.toggleText,
                                    selectedArrangement === item && styles.toggleTextSelected,
                                ]}
                            >
                                {item}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>


                <Text style={styles.label}>Work Days</Text>
                <View style={styles.daysContainer}>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
                        <TouchableOpacity
                            key={index}
                            style={[
                                styles.dayButton,
                                selectedDays.includes(day) && styles.dayButtonSelected,
                            ]}
                            onPress={() => toggleDay(day)}
                        >
                            <Text
                                style={[
                                    styles.dayText,
                                    selectedDays.includes(day) && styles.dayTextSelected,
                                ]}
                            >
                                {day[0]}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>



                {Object.entries(workTimes)
                    .filter(([day]) => {
                        return selectedDays.includes(day);
                    })
                    .map(([day, times]) => (
                        <View key={day} style={styles.timeContainer}>
                            <Text style={styles.dayLabel}>{day}</Text>
                            <TextInput
                                style={styles.timeInput}
                                value={times.start}
                                onChangeText={(text) => handleTimeChange(day as WorkDays, 'start', text)}
                                placeholder="Start Time"
                            />
                            <Text style={styles.toText}>to</Text>
                            <TextInput
                                style={styles.timeInput}
                                value={times.end}
                                onChangeText={(text) => handleTimeChange(day as WorkDays, 'end', text)}
                                placeholder="End Time"
                            />
                        </View>
                    ))}



                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.button, { backgroundColor: true ? '#602bf9' : '#B5B5B5' }]}
                        onPress={() => { }}
                        disabled={true}
                    >
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                </View>
                <View style={{height:50}}/>

            </ScrollView>

        </SafeAreaView>
    );
};

export default CreateWorkSchedule;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 20,
        elevation: 1,
    },
    backButton: {
        position: 'absolute',
        left: 15,
    },
    backIcon: {
        width: 20,
        height: 20,
    },
    infoButton: {
        position: 'absolute',
        right: 15,
    },
    infoIcon: {
        width: 20,
        height: 20,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    bodyContainer: {
        padding: 20,
    },
    label: {
        fontSize: 14,
        marginVertical: 10,
        marginLeft: 2,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 15,
        backgroundColor: 'white',
        height: 50,
        marginBottom: 10,
    },
    toggleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    toggleButton: {
        flex: 1,
        borderWidth: 0.5,
        borderColor: '#ddd',
        padding: 20,
        alignItems: 'center',
    },
    toggleButtonSelected: {
        backgroundColor: '#dbe4ff',
        borderColor: '#4a6fe9',
    },
    toggleText: {
        color: '#555',
    },
    toggleTextSelected: {
        color: '#4a6fe9',
        fontWeight: 'bold',
    },
    daysContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    dayButton: {
        borderWidth: 0.5,
        borderColor: '#ddd',
        paddingVertical: 15,
        paddingHorizontal: 20.7,
    },
    dayButtonSelected: {
        backgroundColor: '#dbe4ff',
        borderColor: '#4a6fe9',
    },
    dayText: {
        color: '#555',
    },
    dayTextSelected: {
        color: '#4a6fe9',
    },
    timeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,

    },
    dayLabel: {
        flex: 1,
        fontWeight: 'bold',
        padding: 10,
    },
    timeInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 3,
        padding: 15,
        backgroundColor: 'white',
        width: 100,
        textAlign: 'center',
        paddingHorizontal: 10,
    },
    toText: {
        marginHorizontal: 10,
        color: '#555',
    },
    saveButton: {
        backgroundColor: '#FF9800',
        borderRadius: 2,
        paddingVertical: 12,
        alignItems: 'center',
        marginVertical: 20,
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    buttonContainer: {
        marginTop: 12,
        width: '100%',
        alignSelf: 'center',
    },
    button: {
        backgroundColor: '#602bf9',
        paddingVertical: 15,
        borderRadius: 3,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },

});
