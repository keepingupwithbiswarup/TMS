import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { LineChart, PieChart } from 'react-native-chart-kit'

const AdminDashboard = ({ navigation }: { navigation: any }) => {

    const whoIsInOutData = {
        in: 0,
        break: 0,
        out: 1,
    };

    const trackedHoursData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
            {
                data: [30, 35, 28, 40, 38, 35, 30], 
                color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`, 
                strokeWidth: 2,
                label: 'Working Hours (Aggregated)',
            },
            {
                data: [7, 8, 4, 9, 10, 7, 8], 
                color: (opacity = 1) => `rgba(54, 162, 235, ${opacity})`, 
                strokeWidth: 2,
                label: 'Break Hours (Aggregated)',
            },
            {
                data: [3, 4, 3, 5, 4, 3, 3], 
                color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`, 
                strokeWidth: 2,
                label: 'Overtime Hours (Aggregated)',
            },
        ],
        legend: [
            'Working',
            'Break',
            'Overtime',
        ],
    };
    

    const projectsData = [
        {
            name: 'Done',
            population: 55,
            color: '#9EDF9C',
        },
        {
            name: 'Ongoing',
            population: 10,
            color: '#FFF9BF',
        },
        {
            name: 'Remaining',
            population: 20,
            color: '#FF8383',
        },
    ];

    const upcomingHolidays = [
        { date: '25 Dec 2024', name: "Christmas Day" },
        { date: '1 Jan 2025', name: "New Year's Day" },
        { date: '14 Feb 2025', name: "Valentine's Day" },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1 }}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Dashboard</Text>
                    <TouchableOpacity onPress={()=>{navigation.navigate('PersonalSettings')}}>
                    <View style={styles.circle}>
                        <Text style={styles.circleText}>B</Text>
                    </View>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.bodyContainer}>


                    <View style={styles.card}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Who's In/Out</Text>
                            <Image source={require('../assets/arrow-icon.png')} style={styles.arrowIcon} />
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.row}>
                            <View style={styles.infoBox}>
                                <Text style={styles.numberText}>{whoIsInOutData.in}</Text>
                                <Text style={styles.labelText}>IN</Text>
                            </View>
                            <View style={styles.infoBox}>
                                <Text style={styles.numberText}>{whoIsInOutData.break}</Text>
                                <Text style={styles.labelText}>BREAK</Text>
                            </View>
                            <View style={styles.infoBox}>
                                <Text style={styles.numberText}>{whoIsInOutData.out}</Text>
                                <Text style={styles.labelText}>OUT</Text>
                            </View>
                        </View>
                    </View>

            
                    <View style={styles.card}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Tracked Hours</Text>
                            <Image source={require('../assets/arrow-icon.png')} style={styles.arrowIcon} />
                        </View>
                        <View style={styles.divider} />
                        <LineChart
                            data={trackedHoursData}
                            width={Dimensions.get('window').width - 45}
                            height={250}
                            yAxisSuffix="h"
                            yAxisInterval={1}
                            chartConfig={{
                                backgroundColor: 'white',
                                backgroundGradientFrom: 'white',
                                backgroundGradientTo: 'white',
                                decimalPlaces: 0,
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: {
                                    borderRadius: 10,
                                    padding: 0,
                                },
                                propsForDots: {
                                    r: '3',
                                },
                            }}
                            bezier
                            style={{
                                marginVertical: 5,
                                borderRadius: 10,
                            }}
                        />
                    </View>
                    
                    <View style={styles.card}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Projects</Text>
                            <Image source={require('../assets/arrow-icon.png')} style={styles.arrowIcon} />
                        </View>
                        <View style={styles.divider} />
                        <PieChart
                            data={projectsData}
                            width={Dimensions.get('window').width - 45}
                            height={200}
                            chartConfig={{
                                backgroundColor: 'white',
                                backgroundGradientFrom: 'white',
                                backgroundGradientTo: 'white',
                                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                                style: {
                                    borderRadius: 10,
                                },
                            }}
                            accessor="population"
                            backgroundColor="transparent"
                            paddingLeft="15"
                            style={{
                                marginVertical: 5,
                                borderRadius: 10,
                            }}
                            hasLegend={true}
                        />
                    </View>

                
                    <View style={styles.card}>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Upcoming Holidays</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.holidayList}>
                            {upcomingHolidays.map((holiday, index) => (
                                <View style={styles.holidayItem} key={index}>
                                    <Text style={styles.holidayDate}>{holiday.date}</Text>
                                    <Text style={styles.holidayName}>{holiday.name}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    <View style={{ height: 50 }} />

                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default AdminDashboard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F8Fc',
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "white",
        padding: 15,
        elevation: 1,
    },
    headerText: {
        position: "absolute",
        top: 26,
        right: 15,
        textAlign: "center",
        fontSize: 16,
        width: "100%",
        alignSelf: "center",
        fontWeight: "bold",
    },
    circle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#333",
        justifyContent: "center",
        alignItems: "center",
    },
    circleText: {
        color: "white",
        fontSize: 18,
        fontWeight: "bold",
    },
    bodyContainer: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        marginVertical: 10,
        elevation: 6,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    arrowIcon: {
        width: 20,
        height: 20,
        tintColor: '#999',
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        marginHorizontal: 15,
        marginVertical: 10,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 20,
    },
    infoBox: {
        alignItems: 'center',
    },
    numberText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    labelText: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    holidayList: {
        paddingHorizontal: 15,
        paddingBottom: 15,
        paddingTop: 10,
    },
    holidayItem: {
        marginBottom: 10,
        paddingHorizontal: 12,
    },
    holidayDate: {
        fontSize: 14,
        color: '#333',
        fontWeight: 'bold',
    },
    holidayName: {
        fontSize: 14,
        color: '#999',
    },
});
