import { Dimensions, Image, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ScrollView } from 'react-native-gesture-handler'
import { LineChart, PieChart } from 'react-native-chart-kit'
import { User } from '../utilities/types'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'
import IpRoute from '../utilities/iproute'
import DepartmentBarChart from '../components/DepartmentBarChart'


import LineChartDept from '../components/LineChartDept'
interface DepartmentPopulation {
    Department: string;
    Population: number;
}

interface TrackedHours {
    Department: string;
    TotalWorkingHours: number;
}

interface ProjectCount{
    DeptName: string;
    ProjectCount: number;
}

const AdminDashboard = ({ navigation }: { navigation: any }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [projects, setProjects] = useState<any[]>([]);
    const [refreshing, setRefreshing] = useState(false);

    const [projectStatusCounts, setProjectStatusCounts] = useState({
        Finished: 0,
        Ongoing: 0,
        Due: 0,
    });

    const [deptPopulation, setDepartmentPopulation] = useState<DepartmentPopulation[]>([]);
    const [trackedHours, setTrackedHours] = useState<TrackedHours[]>([]);
    const [projectsCount, setProjectsCount] = useState<ProjectCount[]>([]);

    const checkUser = async () => {
        const currentUser = await AsyncStorage.getItem('currentUser');
        if (currentUser) {

            setCurrentUser(JSON.parse(currentUser));
            setLoading(false);
        } else {
            setLoading(false);
        }
    };

    const fetchData = async () => {
        // Check user
        setRefreshing(true)
        await checkUser();

        // Fetch projects and related data
        setLoading(true);
        try {
            const response = await fetch(`http://${IpRoute}/api/projects`);
            const data = await response.json();
            console.log("hello we found the data", data);

            const departmentPopulation = await fetch(`http://${IpRoute}/api/departmentpopulation`);
            const departmentPopulationData = await departmentPopulation.json();
            setDepartmentPopulation(departmentPopulationData);

            const trackedHours = await fetch(`http://${IpRoute}/api/trackedhours`);
            const trackedHoursData = await trackedHours.json();
            setTrackedHours(trackedHoursData);
            // console.log(trackedHoursData);

            const projectCount = await fetch(`http://${IpRoute}/api/deptprojectcount`);
        const projectCountData = await projectCount.json();
        if (projectCountData) {
            setProjectsCount(projectCountData);
        }

            

            const projectsWithStatus = await Promise.all(
                data.map(async (project: any) => {
                    return {
                        id: project.ProjectId.toString(),
                        name: project.ProjectName,
                        progress: 0,
                        status: await getProjectStatus(project.ProjectId),
                        comments: 0,
                        documents: 0,
                    };
                })
            );

            setProjects(projectsWithStatus);

            setProjectStatusCounts({
                Finished: projectsWithStatus.filter(p => p.status === 'Finished').length,
                Ongoing: projectsWithStatus.filter(p => p.status === 'Ongoing').length,
                Due: projectsWithStatus.filter(p => p.status === 'Due').length,
            });

            // console.log("hi this is",projectsCount);
        } catch (error) {
            console.error('Error fetching projects:', error);
            setError('Failed to fetch projects');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            
    
            fetchData();
        }, [])); 

        useEffect(() => {
            if (projectsCount) {
                console.log("project count", projectsCount);
            }
        }, [projectsCount]);
    

    const getProjectStatus = async (projectId: number): Promise<string> => {
        try {
            if (!projectId) {
                throw new Error('ProjectId is required to fetch the status.');
            }

            const response = await fetch(`http://${IpRoute}/api/subtaskstatuses/${projectId}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch subtasks.');
            }

            const data = await response.json();
            const subtasks = data.subtasks;

            let allFinished = true;
            let allDue = true;

            subtasks.forEach((subtask: { Status: string }) => {
                if (subtask.Status !== 'Finished') {
                    allFinished = false;
                }
                if (subtask.Status !== 'Due') {
                    allDue = false;
                }
            });

            if (allFinished) {
                return 'Finished';
            } else if (allDue) {
                return 'Due';
            } else {
                return 'Ongoing';
            }
        } catch (error) {
            console.error('Error fetching project status:', error);
            return 'Due';
        }
    };


    // useFocusEffect(
    //     useCallback(() => {
    //         checkUser();
    //     }, [])
    // );

    if (loading) {

        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            </SafeAreaView>
        );
    }

    // const whoIsInOutData = {
    //     in: 0,
    //     break: 0,
    //     out: 1,
    // };

    console.log("hi",trackedHours);

    const labels = trackedHours.map(dept => dept.Department?.trim() || 'Unknown'); 

    const workingHours = trackedHours.map(dept => dept.TotalWorkingHours || 0);


    const formatLabel = (label: string) => label.length > 10 ? label.substring(0, 8) + "..." : label;

    const trackedHoursData = {
        labels,
        datasets: [
            {
                data: workingHours,
                color: (opacity = 1) => `rgba(255, 99, 132, ${opacity})`,
                strokeWidth: 2,
                label: 'Working Hours per Department',
            }
        ],
        legend: ['Working Hours'],
    };

    



    const barChartData = projectsCount.map(item => ({
        label: item.DeptName,   
        value: item.ProjectCount 
      }));




    const upcomingHolidays = [
        { date: '25 Dec 2024', name: "Christmas Day" },
        { date: '1 Jan 2025', name: "New Year's Day" },

        { date: '4 Jul 2025', name: "Independence Day (USA)" },
        { date: '31 Dec 2025', name: "New Year's Eve" },
        { date: '7 Apr 2025', name: "Easter Sunday" },
    ];



    return (
        <SafeAreaView style={styles.container}>
            <View style={{ flex: 1 }}>
                <View style={styles.headerContainer}>
                    <Text style={styles.headerText}>Dashboard</Text>
                    <TouchableOpacity onPress={() => { navigation.navigate('PersonalSettings') }}>
                        <View style={styles.circle}>
                            <Text style={styles.circleText}>{currentUser?.Username[0]}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchData} />}
                    style={styles.bodyContainer}
                >


                    {/* <View style={styles.card}>
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
                    </View> */}
                    <View style={{}}>
                        <Text style={{ fontSize: 20, paddingTop: 15 }}><Text style={{ fontSize: 30, fontWeight: "bold" }}>Welcome,</Text> {currentUser?.Username}</Text>
                        <Text style={{ fontSize: 14, paddingBottom: 15, paddingTop: 5, paddingHorizontal: 3, color: "#9AA6B2" }}>You can use this application as an {currentUser?.Role}</Text>
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
                            formatXLabel={formatLabel}
                        />

                    </View>

                    <View style={styles.card}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionTitle, { paddingTop: 10, fontWeight: "bold" }]}>Projects Status Distribution Chart</Text>
                            {/* <Image source={require('../assets/arrow-icon.png')} style={styles.arrowIcon} /> */}
                        </View>
                        <View style={styles.divider} />
                        <PieChart
                            data={[
                                { name: 'Finished', population: projectStatusCounts.Finished, color: '#47B39C', legendFontColor: '#000', legendFontSize: 10 },
                                { name: 'Ongoing', population: projectStatusCounts.Ongoing, color: '#FFC154', legendFontColor: '#000', legendFontSize: 10 },
                                { name: 'Due', population: projectStatusCounts.Due, color: '#EC6B56', legendFontColor: '#000', legendFontSize: 10 },
                            ]}
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
                        <View style={{
                            backgroundColor: 'white',
                            borderRadius: 10,
                            paddingHorizontal: 30,
                            paddingTop: 0,
                            paddingBottom: 20,
                        }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 }}>
                                <Text style={{ fontSize: 14, fontWeight: "600", color: "#333" }}>Total Projects</Text>
                                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#333" }}>{projects.length}</Text>
                            </View>
                            <View style={{ height: 0.5, backgroundColor: "#ddd" }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 }}>
                                <Text style={{ fontSize: 14, fontWeight: "600", color: "#EC6B56" }}>Due Projects</Text>
                                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#EC6B56" }}>{projectStatusCounts.Due}</Text>
                            </View>
                            <View style={{ height: 0.3, backgroundColor: "#ddd" }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 }}>
                                <Text style={{ fontSize: 14, fontWeight: "600", color: "#FFC154" }}>Ongoing Projects</Text>
                                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#FFC154" }}>{projectStatusCounts.Ongoing}</Text>
                            </View>
                            <View style={{ height: 0.4, backgroundColor: "#ddd" }} />
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 }}>
                                <Text style={{ fontSize: 14, fontWeight: "600", color: "#47B39C" }}>Completed Projects</Text>
                                <Text style={{ fontSize: 16, fontWeight: "bold", color: "#47B39C" }}>{projectStatusCounts.Finished}</Text>
                            </View>
                        </View>


                    </View>
                    <View style={[styles.card, { paddingTop: 30, paddingLeft: 30 }]}>
                        <Text style={{ fontSize: 20, fontWeight: "bold", paddingBottom: 30 }}>Department Population</Text>
                        <DepartmentBarChart deptPopulation={deptPopulation} />
                    </View>


                    <LineChartDept
        data={projectsCount}
      />




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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "white"
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 4,
        marginVertical: 10,
        elevation: 3,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 15,
    },
    sectionTitle: {
        fontSize: 16,
    },
    arrowIcon: {
        width: 20,
        height: 20,
        tintColor: '#999',
    },
    divider: {
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
