import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
    ActivityIndicator,
    SectionList,
    Image,
    TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import CalendarStrip from 'react-native-calendar-strip';
import TimeEntryModal from '../components/TimesheetEntryModal';
import IpRoute from '../utilities/iproute';


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

const TimesheetViewPage=({navigation}:{navigation:any}) => {
    const [selectedDate, setSelectedDate] = useState(moment());
    const [timesheetData, setTimesheetData] = useState<TimesheetEntry[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isModalVisible, setModalVisible] = useState(false);

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

    useEffect(() => {
        fetchTimesheetData();
    }, []);

    const filteredTimesheetData = timesheetData.filter(
        (item) => moment(item.DateInfo).format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
    );

    const sortedData = filteredTimesheetData.sort((a, b) =>
        a.ProjectName.localeCompare(b.ProjectName)
    );

    
    const groupedData = sortedData.reduce((acc: { [key: string]: TimesheetEntry[] }, item) => {
        const projectName = item.ProjectName;
        if (!acc[projectName]) {
            acc[projectName] = [];
        }
        acc[projectName].push(item);
        return acc;
    }, {});

    
    const sections = Object.keys(groupedData).map((projectName) => ({
        title: projectName,
        data: groupedData[projectName],
    }));


    const TimesheetCard: React.FC<{ item: TimesheetEntry }> = ({ item }) => {
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
                    }}>
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
                    <Text style={styles.textBold}>{item.ProjectName}</Text>
                    <Text style={{fontSize:14,paddingTop:8}}>Task | {item.TaskName}</Text>
                    <Text style={{fontSize:14,paddingTop:8}}>Subtask | {item.SubTaskName}</Text>
                    <View style={{borderLeftColor:"#6D9886",borderLeftWidth:3,borderRadius:3,padding:5,marginVertical:10,alignItems:"center",flexDirection:'row'}}>
                        <Image style={{height:25,width:25,marginRight:5,
                        }} source={require('../assets/report.png')} />
                    <Text style={[styles.textRegular,{color:"#898B8A"}]}>{item.Username} commented, <Text style={{fontStyle:"italic",color:"black"}}>{item.Description}</Text></Text>
                    </View>
                    <Text style={styles.hoursText}>
                        {item.Username} worked for {durationString}
                    </Text>
                </View>
            </View>
        )
    };

    return (
        <SafeAreaView style={styles.container}>
             <View style={styles.headerContainer2}>
            
                            <Text style={styles.headerText}>Timesheets</Text>
            
                            <TouchableOpacity onPress={() => {setModalVisible(true) }} style={styles.plusButton}>
                                <Image
                                    source={require('../assets/add-icon.png')}
                                    style={styles.plusIcon}
                                />
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
                renderItem={({ item }) =><TimesheetCard item={item} />}
                renderSectionHeader={({ section: { title } }) => (
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionHeaderText}>{title}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.TimesheetId.toString()}
                ListEmptyComponent={<Text style={styles.noDataText}>No timesheet for selected date</Text>}
            />
            )}
            <View style={{ height: 20 }} />
            <TimeEntryModal
                visible={isModalVisible}
                onClose={() => setModalVisible(false)}
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
    cardContainer: {
        backgroundColor: '#fff',
        marginTop: 5,
        padding: 16,
        borderRadius: 12,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
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
        fontSize: 14,
        marginBottom: 2,
    },
    hoursText: {
        fontSize: 14,
        marginTop: 2,
        fontWeight:"bold",
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
        fontStyle:"italic",
    },

    sectionHeader: {
        backgroundColor: '#F5F7F8',
        paddingVertical: 15,
        paddingHorizontal: 16,
        marginVertical:10,
    },
    sectionHeaderText: {
        fontWeight: 'bold',
        fontSize: 16,
        color:"#45474B"
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

export default TimesheetViewPage;
