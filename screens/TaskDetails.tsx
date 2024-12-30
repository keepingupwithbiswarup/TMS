import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import * as Progress from 'react-native-progress';
import Header from '../components/Header';

type Task = {
  title: string;
  progress: number;
};

const taskData = {
  name: 'Tasktion - Project Management Dashboard',
  description: 'This project has a task management theme for a dashboard or web app platform. Here there is a complete brief along with the task to be completed. It involves creating user interfaces, wireframing, and more technical steps such as integration with APIs and backend services.',
  dueDate: 'Sept 24, 2022',
  progress: 75,
  teamMembers: ['John Doe', 'Jane Smith', 'Sam Wilson', 'Emily Davis', 'Michael Brown'],
  tasks: [
    { title: 'Style Guide & Component', progress: 100 },
    { title: 'Wireframing & Sketch', progress: 40 },
    { title: 'UI Design & Prototype', progress: 60 },
  ] as Task[],
};

const TaskDetails = ({ navigation }: { navigation: any }) => {
  const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);

  const renderTask = (task: Task) => {
    return (
      <View style={styles.taskCard}>
        <Text style={styles.taskTitle}>{task.title}</Text>
        <Progress.Bar
          progress={task.progress / 100}
          width={null}
          height={8}
          borderRadius={10}
          color="#4a6fe9"
          unfilledColor="#E0E0E0"
          style={styles.progressBar}
        />
        <Text style={styles.progressText}>{task.progress}%</Text>
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
        <View style={styles.taskHeader}>
          <Text style={styles.taskName}>{taskData.name}</Text>
        </View>

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
  taskHeader: {
    marginBottom: 20,
  },
  taskName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#333333',
    marginBottom: 0,
  },
  description: {
    fontSize: 15,
    color: '#666666',
    lineHeight: 24,
    marginBottom: 20,
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
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 15,
    paddingHorizontal:5,
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
  taskTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 12,
  },
  progressBar: {
    marginTop: 8,
    borderWidth:0,

  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    marginTop: 6,
  },
  completeButton: {
    backgroundColor: '#4a6fe9',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  completeButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default TaskDetails;
