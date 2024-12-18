import { Image, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import CheckBox from 'react-native-check-box';

const ChooseGoalPage = ({ navigation }: { navigation: any }) => {
    const [selectedGoals, setSelectedGoals] = useState<string[]>([]);

    const handleGoalSelect = (goal: string) => {
        if (selectedGoals.includes(goal)) {
            setSelectedGoals(selectedGoals.filter(item => item !== goal));
        } else {
            setSelectedGoals([...selectedGoals, goal]);
        }
    };

    const isFormValid = () => selectedGoals.length > 0;

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ margin: 15 }}>
                <StatusBar backgroundColor={"white"} barStyle={'dark-content'} />
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} >
                        <Image tintColor={"black"} style={styles.image} source={require('../assets/back-arrow.png')} />
                    </TouchableOpacity>
                </View>

                <View style={{ height: 20 }} />
                <View>
                    <Text style={styles.headerText}>I want to....</Text>
                    <Text style={styles.subText}>Choose one or more goals.</Text>
                </View>


                <View style={styles.goalsContainer}>
                    {[
                        { goal: 'Monitor time & attendance', description: "See who's working at which location", image: require('../assets/employees1.png') },
                        { goal: 'Review hours for payroll', description: 'Review attendance & overtime for job costing', image: require('../assets/employees2.png') },
                        { goal: 'Track time on projects', description: 'For accurate project tracking and invoicing', image: require('../assets/employees3.png') }
                    ].map(({ goal, description, image }) => (
                        <TouchableOpacity
                            key={goal}
                            style={[
                                styles.goalCard,
                                selectedGoals.includes(goal) && styles.goalCardSelected
                            ]}
                            onPress={() => handleGoalSelect(goal)}
                        >
                            <Image source={image} style={styles.goalImage} />

                            <View style={styles.goalTextContainer}>
                                <Text style={styles.goalTitle}>{goal}</Text>
                                <Text style={styles.goalDescription}>{description}</Text>
                            </View>

                            <View style={styles.checkboxContainer}>
                                <CheckBox isChecked={selectedGoals.includes(goal)} onClick={() => handleGoalSelect(goal)} />
                            </View>
                        </TouchableOpacity>

                    ))}
                </View>
            </View>

            <TouchableOpacity
                style={[styles.nextButton, { backgroundColor: isFormValid() ? '#602bf9' : '#d3d3d3' }]}
                disabled={!isFormValid()}
                onPress={() => { navigation.replace('BottomTabs') }}
            >
                <Text style={styles.btnText}>Continue</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ChooseGoalPage;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    image: {
        height: 25,
        width: 25,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerText: {
        fontSize: 25,
        fontWeight: "bold",
        paddingHorizontal: 8,
    },
    subText: {
        fontSize: 19,
        fontWeight: "normal",
        paddingHorizontal: 8,
        paddingVertical: 7,
    },
    goalsContainer: {
        marginTop: 20,
    },
    goalCard: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 25,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: "black",
        paddingHorizontal: 15,
    },
    goalImage: {
        width: 50,
        height: 50,
        marginRight: 15,
    },
    checkboxContainer: {
        marginLeft: 15,
    },
    goalTextContainer: {
        flex: 1,
    },
    goalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    goalDescription: {
        fontSize: 14,
        fontWeight: 'normal',
        color: '#555',
    },
    nextButton: {
        paddingHorizontal: 80,
        paddingVertical: 20,
        borderRadius: 8,
        width: "90%",
        position: "absolute",
        bottom: 10,
        alignSelf: "center",
    },
    btnText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
    },
    goalCardSelected: {
        backgroundColor: '#dbe4ff',
        borderColor: '#4a6fe9',
        borderWidth: 1,
    },

});
