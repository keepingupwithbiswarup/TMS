import React, { useEffect, useState } from 'react';
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
import IpRoute from '../utilities/iproute';
import moment from 'moment';

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

interface WorkingHoursData {
  EmployeeName: string;
  StartTime: string;
  EndTime: string;
  DateInfo: string;
}
interface TransformedData {
  name: string;
  color: string;
  data: Array<{ weekday: string; hours: number; dateInfo?: string }>;
}



const DepartmentDetails: React.FC<DepartmentDetailsProps> = ({ department }) => {
  const [departmentTasks, setDepartmentTasks] = useState<Tasks>({});
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [markedDates, setMarkedDates] = useState({});
  const [departmentObj, setDepartmentObj] = useState<Department>();
  const [loading, setLoading] = useState<boolean>(true);
  const [workingHoursData, setWorkingHoursData] = useState<TransformedData[]>([]);
  const [linechartWorkHours, setLineChartWorkHours] = useState<WorkingHoursData[]>([]);
  const [selectedEmployeeDetails, setSelectedEmployeeDetails] = useState<any>(null);

  const [currentWeek, setCurrentWeek] = useState(moment().startOf('isoWeek'));




  const departmentId = department;

  useFocusEffect(
    React.useCallback(() => {
      const fetchDepartments = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://${IpRoute}/api/departments`);
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

  useFocusEffect(
    React.useCallback(() => {
      const fetchCalendarData = async () => {
        try {
          setLoading(true);
          const response = await fetch(`http://${IpRoute}/api/calendar`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              deptId: departmentId,
              status: 'Due',
            }),
          });

          const data = await response.json();
          const formattedTasks: Tasks = {};
          const formattedDates: any = {};

          data.forEach((task: any) => {
            const { DueDate, SubTaskName } = task;
            const date = DueDate.split('T')[0];

            if (!formattedTasks[date]) {
              formattedTasks[date] = [];
            }

            formattedTasks[date].push({
              time: 'Due Today',
              title: SubTaskName,
            });

            formattedDates[date] = { marked: true, dotColor: '#4a6fe9' };
          });

          setDepartmentTasks(formattedTasks);
          setMarkedDates(formattedDates);
        } catch (error) {
          console.error('Error fetching calendar data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchCalendarData();
    }, [departmentId])
  );

  useFocusEffect(
    React.useCallback(() => {
      const fetchWorkingHours = async () => {
        if (!departmentObj?.DeptName) return;
        try {
          const response = await fetch(`http://${IpRoute}/api/workinghours`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ department: departmentObj.DeptName }),
          });

          const data = await response.json();
          const rawData = data.map((item: any) => ({
            EmployeeName: item.EmployeeName,
            StartTime: item.StartTime,
            EndTime: item.EndTime,
            DateInfo: item.DateInfo,
          }));
          setLineChartWorkHours(rawData);
        } catch (error) {
          console.error('Error fetching working hours', error);
        }
      };


      fetchWorkingHours();
    }, [departmentObj?.DeptName])
  );

  const transformData = (apiData: WorkingHoursData[]): TransformedData[] => {
    const weekdays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
    const groupedData = apiData.reduce((acc: { [key: string]: TransformedData }, entry) => {
      const employeeName = entry.EmployeeName;
      if (!employeeName) return acc;
  
      const dateInfo = entry.DateInfo;
      const weekday = moment(dateInfo).format('ddd');
      const startTime = moment.utc(entry.StartTime);
      const endTime = moment.utc(entry.EndTime);
      const hours = endTime.isValid() && startTime.isValid()
        ? endTime.diff(startTime, 'minutes') / 60
        : 0;
  
      if (!acc[employeeName]) {
        acc[employeeName] = {
          name: employeeName,
          data: weekdays.map((day) => ({ weekday: day, hours: 0, dateInfo: '' })),
          color: getRandomColor(),
        };
      }
  
      const employeeData = acc[employeeName].data;
      const dayIndex = employeeData.findIndex((day) => day.weekday === weekday);
  
      if (dayIndex !== -1) {
        employeeData[dayIndex].hours += hours;
        if (!employeeData[dayIndex].dateInfo || employeeData[dayIndex].dateInfo !== dateInfo) {
          employeeData[dayIndex].dateInfo = dateInfo;
        }
      }
  
      // console.log('Current groupedData:', JSON.stringify(acc, null, 2));
  
      return acc;
  
    }, {});
  
    console.log('Final groupedData:', JSON.stringify(groupedData, null, 2));
  
    return Object.values(groupedData);
  };
  








  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  useEffect(() => {
    const transformedData = transformData(linechartWorkHours);
    setWorkingHoursData(transformedData);
  }, [linechartWorkHours]);

  
  // useEffect(() => {
  //   if (selectedEmployee) {
  //     const employeeData = workingHoursData.find((emp) => emp.name === selectedEmployee);
  //     if (employeeData) {
  //       const filteredDetails = employeeData.data.filter((day) => {
  //         const formattedDate = moment(day.dateInfo).format('YYYY-MM-DD');
  //         return currentWeekDates.some((date) => formattedDate === date || moment(formattedDate).isBetween(date, moment(date).add(1, 'week'), 'day', '[]'));
  //       });
  //       setSelectedEmployeeDetails({ ...employeeData, data: filteredDetails });
  //     }
  //   }
  // }, [selectedEmployee, currentWeek, workingHoursData]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4a6fe9" />
      </View>
    );
  }

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
  const handleLegendPress = (name: string) => {
    if (selectedEmployee === name) {
      setSelectedEmployee(null);
      setSelectedEmployeeDetails(null);
    } else {
      setSelectedEmployee(name);
      const employeeData = workingHoursData.find((emp) => emp.name === name);
      setSelectedEmployeeDetails(employeeData);
    }
  };
  const formatTime = (decimalHours: number): string => {
    const hours = Math.floor(decimalHours);
    const minutes = Math.round((decimalHours - hours) * 60);
    return `${hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''} ` : ''}${minutes > 0 ? `${minutes} minute${minutes > 1 ? 's' : ''}` : ''}`.trim();
  };
  moment.updateLocale('en', {
    week: {
      dow: 1,
    },
  });
  const handlePreviousWeek = () => {
    setCurrentWeek((prevWeek) => prevWeek.clone().subtract(1, 'weeks'));
  };
  const handleNextWeek = () => {
    setCurrentWeek((prevWeek) => prevWeek.clone().add(1, 'weeks'));
  };
  const getWeekDates = (startDate: moment.Moment) => {
    const startOfWeek = startDate.clone().startOf('week');
    return Array.from({ length: 6 }, (_, i) =>
      startOfWeek.clone().add(i, 'days').format('YYYY-MM-DD')
    );
  };
  const currentWeekDates = getWeekDates(currentWeek);
  const filteredData = workingHoursData.map((emp) => ({
    ...emp,
    data: emp.data.filter((day) =>
      currentWeekDates.includes(moment(day.dateInfo).format('YYYY-MM-DD'))
    ),
  }));

  const filteredEmployeeDetails = selectedEmployee
    ? selectedEmployeeDetails.data.filter((entry: WorkingHoursData) =>
      currentWeekDates.includes(moment(entry.DateInfo).format('YYYY-MM-DD'))
    )
    : [];

  const renderItem = ({ item }: { item: string }) => {
    switch (item) {
      
      case 'lineChart':
        return (
          <View style={{ justifyContent: 'center' }}>
            <View style={styles.section}>
              <Text style={styles.title}>Daily Working Hours</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, marginVertical: 15, paddingBottom: 20 }}>
                <TouchableOpacity onPress={handlePreviousWeek}>
                  <Text style={{ color: '#4a6fe9', fontWeight: 'bold' }}>Previous Week</Text>
                </TouchableOpacity>
                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                  {currentWeek.clone().startOf('week').format('MMM D')} - {currentWeek.clone().startOf('week').add(5, 'days').format('MMM D')}
                </Text>

                <TouchableOpacity onPress={handleNextWeek}>
                  <Text style={{ color: '#4a6fe9', fontWeight: 'bold' }}>Next Week</Text>
                </TouchableOpacity>
              </View>
              {workingHoursData.length > 0 ? (
                <LineChart
                  data={{
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                    datasets: (selectedEmployee
                      ? filteredData.filter((emp) => emp.name === selectedEmployee)
                      : filteredData
                    ).map((emp) => ({
                      data: currentWeekDates.map((date) => {
                        const workDay = emp.data.find(
                          (day) => moment(day.dateInfo).format('YYYY-MM-DD') === date
                        );

                        if (workDay) {
                          return workDay.hours;
                        }
                        return 0;
                      }),
                      strokeWidth: 0.5,
                      color: (opacity = 1) => {
                        return emp.color || `rgba(74, 111, 233, ${opacity})`;
                      },
                    })),
                  }}
                  chartConfig={{
                    backgroundColor: 'white',
                    backgroundGradientFrom: 'white',
                    backgroundGradientTo: 'white',
                    color: (opacity = 1) => `rgba(74, 111, 233, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    propsForDots: {
                      r: '2',
                    },
                    decimalPlaces: 0,
                  }}
                  width={300}
                  height={300}
                />
              ) : (
                <Text>No Employees in this Department</Text>
              )}
              <View style={styles.legendContainer}>
                {workingHoursData.map((emp: any) => (
                  <TouchableOpacity
                    onPress={() => handleLegendPress(emp.name)}
                    style={[styles.legendItem, selectedEmployee === emp.name && styles.selectedLegend]}
                    key={emp.name}
                  >
                    <View style={[styles.legendDot, { backgroundColor: emp.color }]} />
                    <Text
                      style={[styles.legendText, selectedEmployee === emp.name && styles.selectedText]}
                    >
                      {emp.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {selectedEmployeeDetails && (
                <View style={styles.employeeDetailsContainer}>
                  <Text style={styles.employeeDetailsTitle}>
                    Working Hours for {selectedEmployeeDetails.name}
                  </Text>
                  <View style={styles.employeeDetailsContent}>
                    {filteredEmployeeDetails.map((entry: { weekday: string; hours: number; dateInfo?: string }, index: number) => (
                      <View style={styles.employeeDetailsRow} key={index}>
                        <Text style={styles.weekdayText}>{entry.weekday}:</Text>
                        <Text style={styles.hoursText}>{formatTime(entry.hours)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}


            </View>
            <View style={{ height: 80 }} />
          </View>
        );




        case 'calendar':
          return (
            <View>
              <Text style={{ fontSize: 20, paddingVertical: 15, letterSpacing: 5, textAlign: "center", paddingTop: 25 }}>{departmentObj?.DeptType} Dashboard</Text>
              <View style={styles.section}>
                <Text style={styles.title}>Calendar</Text>
                <Calendar
                  markedDates={{
                    [selectedDate]: { selected: true, selectedColor: '#4a6fe9' },
                    ...markedDates
                  }}
                  onDayPress={handleDayPress}
                  theme={{
                    selectedDayBackgroundColor: '#4a6fe9',
                    todayTextColor: '#4a6fe9',
                    arrowColor: '#4a6fe9',
                  }}
                />
                <Text style={styles.taskHeader}>Today's Tasks</Text>
                {departmentTasks[selectedDate] ? (
                  <FlatList
                    data={departmentTasks[selectedDate]}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderTask}
                  />
                ) : (
                  <Text style={styles.noTasksText}>No tasks due on this day</Text>
                )}
              </View>
            </View>
          );


      default:
        return null;
    }
  };

  return (
    <View>
      <Header headingText={departmentObj?.DeptName!} />
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
    textAlign: "center",
    letterSpacing: 2
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
    marginTop: 15,
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    paddingHorizontal: 15,
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "center",
    marginTop: 8,
    paddingVertical: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    marginBottom: 8,
    marginHorizontal: 5,
  },
  timeContainer: {
    width: 120,
    justifyContent: "flex-start",
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

  employeeDetailsContainer: {
    marginTop: 10,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 20,
    marginBottom: 10,
  },
  employeeDetailsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  employeeDetailsContent: {
    marginTop: 8,
  },
  employeeDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 16,
    color: '#666',
    textTransform: 'capitalize',
  },
  hoursText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },


});

export default DepartmentDetails;
