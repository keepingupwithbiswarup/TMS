import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import Header from '../components/Header';

type Task = {
  time: string;
  title: string;
};

type Tasks = {
  [date: string]: Task[];
};

interface DepartmentDetailsProps {
  department: any;
  route: any;
  navigation: any;
}

interface Department {
  DeptId: number;
  DeptName: string;
  DeptSize: string;
  DeptType: string;

}

const DepartmentDetails: React.FC<DepartmentDetailsProps> = ({ department }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  
  const [departmentObj, setDepartmentObj] = useState<Department>();
  const [loading, setLoading] = useState<boolean>(true);

  const departmentId = department;

  useFocusEffect(
    React.useCallback(() => {
      const fetchDepartments = async () => {
        try {
          setLoading(true);
          const response = await fetch('http://192.168.10.122:5000/api/departments');
          const data = await response.json();


          const matchedDepartment = data.find(
            (dept: any) => dept.DeptId === departmentId
          );
          setDepartmentObj(matchedDepartment);
        } catch (error) {
          console.error('Error fetching departments:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchDepartments();
    }, [departmentId])
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4a6fe9" />
      </View>
    );
  }


  const tasks: Tasks = {
    '2024-12-27': [
      { time: '9:00 AM', title: 'Daily Standup Meeting' },
      { time: '11:00 AM', title: 'Code Review Session' },
    ],
    '2024-12-25': [
      { time: '10:00 AM', title: 'Christmas Meeting' },
    ],
    '2025-01-01': [
      { time: '12:00 PM', title: 'New Year Planning' },
    ],
  };



  const employees = [
    { name: 'John', color: 'rgba(74, 111, 233, 1)', data: [9, 10, 9, 8, 7, 7.5] },
    { name: 'Jane', color: 'rgba(233, 74, 74, 1)', data: [9.9, 10.5, 9.8, 10, 7, 8.5] },
    { name: 'Alice', color: 'rgba(74, 233, 151, 1)', data: [9.9, 8.5, 9.8, 9, 7, 8.5] },
    { name: 'Bob', color: 'rgba(255, 165, 0, 1)', data: [9.9, 7.5, 9.8, 6, 7, 8.5] },
    { name: 'David', color: 'rgba(255, 99, 132, 1)', data: [9.9, 12.5, 5.3, 8, 6, 8.5] },
  ];

  const handleLegendPress = (name: string) => {

    if (selectedEmployee === name) {
      setSelectedEmployee(null);
    } else {
      setSelectedEmployee(name);
    }
  };
  const filteredData = selectedEmployee
    ? employees.filter((emp) => emp.name === selectedEmployee)
    : employees;

  const renderTask = ({ item }: { item: Task }) => (
    <View style={styles.taskContainer}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{item.time}</Text>
      </View>
      <View style={styles.taskDetails}>
        <Text style={styles.taskTitle}>{item.title}</Text>
      </View>
    </View>
  );

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const renderItem = ({ item }: { item: string }) => {
    switch (item) {
      case 'calendar':
        return (
          <View>
            <Text style={{fontSize:20,paddingVertical:15,letterSpacing:5,textAlign:"center",paddingTop:25}}>{departmentObj?.DeptType} Dashboard</Text>
          <View style={styles.section}>
            <Text style={styles.title}>Calendar</Text>
            <Calendar
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: '#4a6fe9' },
                '2024-12-25': { marked: true, dotColor: '#4a6fe9' },
                '2025-01-01': { marked: true, dotColor: '#4a6fe9' },
              }}
              onDayPress={handleDayPress}
              theme={{
                selectedDayBackgroundColor: '#4a6fe9',
                todayTextColor: '#4a6fe9',
                arrowColor: '#4a6fe9',
              }}
            />
            <Text style={styles.taskHeader}>Today's Tasks</Text>
            {tasks[selectedDate] ? (
              <FlatList
                data={tasks[selectedDate]}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderTask}
              />
            ) : (
              <Text style={styles.noTasksText}>No tasks for this day.</Text>
            )}
          </View>
          </View>
        );
      case 'timeline':
        return (
          <View style={styles.section}>
            <Text style={styles.title}>Timeline</Text>
            <View style={styles.timeline}>
              <View style={styles.timelineItem}>
                <View style={styles.iconContainer}>
                  <Image source={require('../assets/project-icon.png')} style={styles.icon} />
                  <View style={styles.verticalLine} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Frontend Vue.js</Text>
                  <Text style={styles.timelineSubtitle}>Due 30 Jan 2024</Text>
                </View>
              </View>

              <View style={styles.timelineItem}>
                <View style={styles.iconContainer}>
                  <Image source={require('../assets/timesheet-icon.png')} style={styles.icon} />
                  <View style={styles.verticalLine} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Team Sync Meeting</Text>
                  <Text style={styles.timelineSubtitle}>Today at 2:00 PM</Text>
                </View>
              </View>

              <View style={styles.timelineItem}>
                <View style={styles.iconContainer}>
                  <Image source={require('../assets/add-icon.png')} style={styles.icon} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.addNew}>Add New</Text>
                </View>
              </View>
            </View>
          </View>
        );
      case 'barChart':
        return (
          <View style={styles.section}>
            <Text style={styles.title}>Total Tasks Completed</Text>
            <BarChart
              data={{
                labels: ['John', 'Jane', 'Alice', 'Bob', 'David', 'Eve', 'Mark'],
                datasets: [
                  {
                    data: [12, 15, 10, 8, 20, 18, 25],
                  },
                ],
              }}
              width={Dimensions.get('window').width - 100}
              height={280}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                color: (opacity = 1) => `rgba(74, 111, 233, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                barPercentage: 0.5,
                propsForLabels: {
                  fontSize: 10,
                  fontWeight: 'bold',
                },
                decimalPlaces: 0,

              }}
              style={styles.chart}
              fromZero={true}
            />
          </View>
        );




      case 'lineChart':
        return (
          <View style={{ justifyContent: "center" }} >
            <View style={styles.section}>
              <Text style={styles.title}>Daily Working Hours</Text>
              <LineChart
                data={{
                  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                  datasets: filteredData.map((emp) => ({
                    data: emp.data,
                    strokeWidth: 0.5,
                    color: (opacity = 1) => emp.color,
                  })),

                }}
                yAxisLabel=""
                yAxisSuffix=""
                width={300}
                height={300}
                chartConfig={{
                  backgroundColor: 'white',
                  backgroundGradientFrom: 'white',
                  backgroundGradientTo: 'white',
                  color: (opacity = 1) => `rgba(74, 111, 233, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  propsForDots: {
                    r: '3',
                  },
                  decimalPlaces: 0,

                }}
                style={styles.chart}
              />
              <View style={styles.legendContainer}>
                {employees.map((emp) => (
                  <TouchableOpacity onPress={() => handleLegendPress(emp.name)} style={[styles.legendItem, selectedEmployee === emp.name && styles.selectedLegend]} key={emp.name}>
                    <View
                      style={[styles.legendDot, { backgroundColor: emp.color }]}
                    />
                    <Text
                      style={[styles.legendText, selectedEmployee === emp.name && styles.selectedText]}

                    >
                      {emp.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={{height:80}}/>
          </View>
        );





      default:
        return null;
    }
  };

  return (
    <View>
    <Header headingText={departmentObj!.DeptName}/>
    <FlatList
      data={['calendar', 'timeline', 'barChart', 'lineChart']}
      keyExtractor={(item) => item}
      renderItem={renderItem}
    />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },

  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 16,
    marginVertical: 10,
    marginBottom: 20,
    textAlign:"center",
    letterSpacing:2
  },
  timeline: {
    flexDirection: 'column',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  iconContainer: {
    alignItems: 'center',
    width: 40,
  },
  icon: {
    width: 36,
    height: 36,
    resizeMode: 'contain',
    tintColor: '#4a6fe9',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  verticalLine: {
    width: 2,
    height: 30,
    backgroundColor: '#4a6fe9',
    marginTop: 4,
  },
  timelineContent: {
    marginLeft: 8,
    flex: 1,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 4,
  },
  timelineSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  addNew: {
    fontSize: 14,
    color: '#4a6fe9',
    fontWeight: 'bold',
    marginTop: 10,
  },
  taskHeader: {
    marginTop: 16,
    fontSize: 19,
    textAlign: 'center',
    color: 'black',
  },
  noTasksText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"center",
    marginTop: 8,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    marginBottom: 8,
    marginHorizontal: 5,
  },
  timeContainer: {
    width: 120,
    justifyContent:"center",


  },
  timeText: {
    fontSize: 14,
    color: '#4a6fe9',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginVertical: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  selectedLegend: {
    backgroundColor: '#e3f2fd',
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: 'black',
  },
  selectedText: {
    fontWeight: 'bold',
    color: '#4a6fe9',
  },
});

export default DepartmentDetails;
