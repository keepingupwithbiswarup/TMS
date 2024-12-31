import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import Header from '../components/Header';

type Task = {
  title: string;
  progress: number;
  comments: number;
  documents: number;
  completed: boolean;
};

const taskData = {
  name: 'Tasktion - Project Management Dashboard',
  description: 'This project has a task management theme for a dashboard or web app platform. Here there is a complete brief along with the task to be completed. It involves creating user interfaces, wireframing, and more technical steps such as integration with APIs and backend services.',
  dueDate: 'Dec 24, 2024',
  progress: 75,
  teamMembers: ['John Doe', 'Jane Smith', 'Sam Wilson', 'Emily Davis', 'Michael Brown'],
  tasks: [
    { title: 'Style Guide & Component', progress: 100, comments: 26, documents: 1, completed: true },
    { title: 'Wireframing & Sketch', progress: 40, comments: 15, documents: 3, completed: false },
    { title: 'UI Design & Prototype', progress: 60, comments: 12, documents: 2, completed: false },
  ] as Task[],
};

const TaskDetails = ({ navigation }: { navigation: any }) => {
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [statistics, setStatistics] = useState([
    { day: 'M', onTarget: 30, tasksTarget: 20, offTarget: 10 },
    { day: 'T', onTarget: 40, tasksTarget: 25, offTarget: 15 },
    { day: 'W', onTarget: 20, tasksTarget: 15, offTarget: 10 },
    { day: 'T', onTarget: 50, tasksTarget: 30, offTarget: 20 },
    { day: 'F', onTarget: 35, tasksTarget: 25, offTarget: 15 },
    { day: 'S', onTarget: 25, tasksTarget: 20, offTarget: 5 },
  ]);

  const formatTime = (seconds:number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime((prevTime) => prevTime + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleBarPress = (day:string, type:any, count:number) => {
    Alert.alert(`${day} Statistics`, `${count} tasks (${type})`);
  };


  const renderTask = (task: Task) => {
    return (
      <View style={styles.taskCard}>
        <View style={styles.taskTitleContainer}>
          <Text style={styles.taskTitle}>{task.title}</Text>
          <Image
            source={task.completed
              ? require('../assets/tick.png')
              : require('../assets/checkbox.png')}
            style={[styles.checkboxIcon, { tintColor: task.completed ? '#4CAF50' : '#666666' }]}
          />
        </View>

        <View style={styles.taskIcons}>
          <View style={styles.iconWrapper}>
            <Image source={require('../assets/comments-icon.png')} style={styles.icon} />
            <Text style={styles.iconText}>{task.comments} Comments</Text>
          </View>
          <View style={styles.iconWrapper}>
            <Image source={require('../assets/attachment.png')} style={styles.icon} />
            <Text style={styles.iconText}>{task.documents} Documents</Text>
          </View>
        </View>
      </View>
    );
  };

  const renderTeamMembers = () => {
    const displayedMembers = taskData.teamMembers.slice(0, 3);
    const remainingCount = taskData.teamMembers.length - 3;

    return (
      <View style={styles.teamList}>
        {displayedMembers.map((member, index) => (
          <View key={index} style={styles.memberCircle}>
            <Text style={styles.memberInitial}>{member.charAt(0)}</Text>
          </View>
        ))}
        {remainingCount > 0 && (
          <View style={styles.memberCircle}>
            <Text style={styles.memberInitial}>+{remainingCount}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header headingText="Project Details" />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <View style={styles.badgeContainer}>
            <Image source={require('../assets/play.png')} style={{ height: 25, width: 25, tintColor: 'white' }} />
            <Text style={styles.badgeText}>In Progress</Text>
          </View>
          <Text style={styles.taskName}>{taskData.name}</Text>
        </View>
        <Text style={{ fontSize: 14, color: '#686D76', marginBottom: 8 }}>Description</Text>

        <Text style={styles.description}>
          {isDescriptionExpanded
            ? taskData.description
            : `${taskData.description.slice(0, 150)}...`}
          <Text onPress={() => setDescriptionExpanded(!isDescriptionExpanded)} style={styles.readMoreText}>
            {isDescriptionExpanded ? ' Show Less' : 'Read More'}
          </Text>
        </Text>

        <View style={styles.teamDueContainer}>
          <View style={styles.teamWrapper}>
            <Text style={styles.teamLabel}>Team Members:</Text>
            {renderTeamMembers()}
          </View>
          <View style={styles.dueDateWrapper}>
            <Text style={styles.dueDateLabel}>Due Date:</Text>
            <Text style={styles.dueDate}>{taskData.dueDate}</Text>
          </View>
        </View>

        <View style={styles.taskProgressContainer}>
          <Text style={styles.sectionTitle}>Tasks</Text>
          {taskData.tasks.map((task, index) => renderTask(task))}
        </View>

        <Text style={{
          fontSize: 21,
          fontWeight: '600',
          color: '#333333',
          padding: 3,
        }}>Project Summary</Text>
        <Text style={{
          fontSize: 17,
          fontWeight: '400',
          color: '#686D76',
          padding: 3,
        }}>Let's finish your tasks for today!</Text>

        <View style={{ flexDirection: 'row', justifyContent: 'center', margin: 20, marginHorizontal: 2, elevation: 3, backgroundColor: "white", padding: 5 }}>

          <View style={styles.statContainer}>
            <Text style={styles.statLabel}>Total Working Hours</Text>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>{formatTime(elapsedTime)}</Text>
              <View style={styles.newbadgeContainer}>
                <Image source={require('../assets/up-arrow.png')} style={styles.uparrowIcon} />
                <Text style={styles.percentage}>34%</Text>
              </View>
            </View>
          </View>


          <View style={[styles.statContainer, { borderLeftWidth: 0.7, borderColor: "#9AA6B2" }]}>
            <Text style={styles.statLabel}>Total Tasks Activity</Text>
            <View style={styles.statValueContainer}>
              <Text style={styles.statValue}>130 Tasks</Text>
              <View style={styles.badgeContainerDown}>
                <Image source={require('../assets/down-arrow.png')} style={styles.downarrowIcon} />
                <Text style={styles.percentageDown}>14%</Text>
              </View>
            </View>
          </View>
        </View>


        <View style={styles.cardsContainer}>

          <View style={[styles.card, styles.inProgressCard]}>
            <Image
              source={require('../assets/arrow-icon.png')}
              style={styles.arrowIcon}
            />

            <Text style={styles.cardNumber}>12</Text>
            <Text style={styles.cardLabel}>Ongoing Tasks</Text>
          </View>
          <View style={[styles.card, styles.completedCard]}>
          <Image
      source={require('../assets/arrow-icon.png')}
      style={styles.arrowIcon}
    />
            <Text style={styles.cardNumber}>86</Text>
            <Text style={styles.cardLabel}>Tasks Completed</Text>
          </View>
        </View>

        <View style={styles.statisticsContainer}>
          <Text style={styles.statisticsTitle}>Project Statistics</Text>

          

          <View style={styles.barChart}>
            {statistics.map((stat, index) => (
              <View key={index} style={styles.barGroup}>
                <TouchableOpacity
                  onPress={() => handleBarPress(stat.day, 'On Target', stat.onTarget)}
                  style={[styles.bar, styles.onTarget, { height: stat.onTarget }]}
                />
                <TouchableOpacity
                  onPress={() => handleBarPress(stat.day, 'Tasks Target', stat.tasksTarget)}
                  style={[styles.bar, styles.tasksTarget, { height: stat.tasksTarget }]}
                />
                <TouchableOpacity
                  onPress={() => handleBarPress(stat.day, 'Off Target', stat.offTarget)}
                  style={[styles.bar, styles.offTarget, { height: stat.offTarget }]}
                />
                <Text style={styles.barLabel}>{stat.day}</Text>
              </View>
            ))}
          </View>
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}><View style={[styles.legendColor, { backgroundColor: '#1e88e5' }]} /><Text style={{fontSize:12}}>On Target</Text></View>
            <View style={styles.legendItem}><View style={[styles.legendColor, { backgroundColor: '#000' }]} /><Text style={{fontSize:12}}>Tasks Target</Text></View>
            <View style={styles.legendItem}><View style={[styles.legendColor, { backgroundColor: '#d32f2f' }]} /><Text style={{fontSize:12}}>Off Target</Text></View>
          </View>
        </View>





        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 30,
  },
  headerContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  taskName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 0,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4a6fe9',
    borderRadius: 2,
    paddingVertical: 5,
    paddingRight: 10,
    paddingLeft: 5,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginLeft: 5,
  },
  description: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 20,
  },
  arrowIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    tintColor: 'white',
  },
  readMoreText: {
    fontSize: 14,
    color: '#4a6fe9',
    marginBottom: 20,
  },
  teamDueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  teamWrapper: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '60%',
  },
  dueDateWrapper: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: '40%',
    alignItems: 'flex-start',
  },
  dueDateLabel: {
    fontSize: 16,
    color: '#686D76',
    marginBottom: 16,
  },
  dueDate: {
    fontSize: 22,
    fontWeight: '600',
  },
  teamLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#686D76',
    marginBottom: 12,
  },
  teamList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  memberCircle: {
    backgroundColor: '#373A40',
    width: 34,
    height: 34,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -10,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: 'white',
  },
  memberInitial: {
    color: '#fff',
    fontSize: 14,
  },
  taskProgressContainer: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  taskTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingRight: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
  },
  checkboxIcon: {
    width: 22,
    height: 22,
  },
  taskIcons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  iconWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  iconText: {
    fontSize: 14,
    color: '#666666',
  },
  statContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 10,
    marginVertical: 5,
    paddingHorizontal: 12,
    backgroundColor: "white",
    width: "50%",
  },
  statLabel: {
    fontSize: 14,
    color: '#686D76',
    marginBottom: 15,
  },
  statValue: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333333',
    marginTop: 5,
  },

  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  newbadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 5,
  },
  uparrowIcon: {
    width: 18,
    height: 18,
    marginRight: 5,
    tintColor: "#388E3C"
  },
  downarrowIcon: {
    width: 18,
    height: 18,
    marginRight: 5,
    tintColor: "#D32F2F"
  },
  percentage: {
    fontSize: 13,
    fontWeight: '600',
    color: '#388E3C',
  },
  badgeContainerDown: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
    backgroundColor: '#FFEBEE',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 5,

  },
  percentageDown: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D32F2F',
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    padding: 16,
    borderRadius: 2,
    width: 160,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    paddingVertical: 0,
    height: 150,
    paddingBottom: 20,
    position:"relative",
  },
  inProgressCard: {
    backgroundColor: '#1a1a1a',
  },
  completedCard: {
    backgroundColor: '#0078d7',
  },
  cardNumber: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
  cardLabel: {
    fontSize: 14,
    color: '#fff',
    marginTop: 4,
  },
  statisticsContainer: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 2,
  },
  statisticsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendColor: {
    width: 14,
    height: 14,
    marginRight: 5,
  },
  barChart: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems:"flex-end",
  },
  barGroup: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  bar: {
    width: 13,
    marginBottom: 2,
  },
  onTarget: {
    backgroundColor: '#1e88e5',
  },
  tasksTarget: {
    backgroundColor: '#000',
  },
  offTarget: {
    backgroundColor: '#d32f2f',
  },
  barLabel: {
    fontSize: 12,
    color: '#333',
    marginTop: 6,
  },
  bubble: {
    position: 'absolute',
    bottom: '100%',
    left: '50%',
    transform: [{ translateX: -50 }],
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    zIndex: 10,
  },
  bubbleText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  

});

export default TaskDetails;
