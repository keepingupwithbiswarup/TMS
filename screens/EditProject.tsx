import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View, TouchableOpacity, Alert, Platform, ScrollView, ActivityIndicator } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Header from '../components/Header';
import { format } from 'date-fns';
import IpRoute from '../utilities/iproute';

const EditProject = ({ route }: { route: any }) => {
  const { projectId } = route.params;

  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState(new Date());
  const [formattedDueDate, setFormattedDueDate] = useState(format(new Date(), 'do MMMM, yyyy, EEEE'));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      try {
        const response = await fetch(`http://${IpRoute}/api/projects`);
        const projects = await response.json();

        if (response.ok) {
            const project = projects.find((p: any) => p.ProjectId === parseInt(projectId, 10));

          if (project) {
            setProjectName(project.ProjectName);
            setDescription(project.Description);
            const projectDueDate = new Date(project.DueDate);
            setDueDate(projectDueDate);
            setFormattedDueDate(format(projectDueDate, 'do MMMM, yyyy, EEEE'));
          } else {
            Alert.alert('Error', `Project with ID ${projectId} not found.`);
          }
        } else {
          Alert.alert('Error', projects.error || 'Failed to fetch projects.');
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        Alert.alert('Error', 'Something went wrong while fetching project details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProjectDetails();
  }, [projectId]);

  const handleDateChange = (event: any, selectedDate: any) => {
    if (Platform.OS === 'android') setShowDatePicker(false);
    if (selectedDate) {
      setDueDate(selectedDate);
      setFormattedDueDate(format(selectedDate, 'do MMMM, yyyy, EEEE'));
    }
  };

  const handleSubmit = async () => {
    if (!projectName || !description || !dueDate) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }
  
    const projectData = {
      projectId: parseInt(projectId, 10),
      projectName,
      description,
      dueDate: dueDate.toISOString(),
    };
  
    try {
      const response = await fetch(`http://${IpRoute}/api/updateproject`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });
  
      const result = await response.json();
      console.log(result); 
  
      if (response.ok) {
        Alert.alert('Success', 'Project updated successfully!');
      } else {
        Alert.alert('Error', result.error || 'Failed to update project.');
      }
    } catch (err) {
      console.error('Error updating project:', err);
      Alert.alert('Error', 'Something went wrong. Please try again later.');
    }
  };
  
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4a6fe9" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header headingText="Edit Project" />
      <View style={styles.form}>
        <Text style={styles.label}>Project Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter project name"
          value={projectName}
          onChangeText={setProjectName}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Enter project description"
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.label}>Due Date</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePicker}>
          <Text style={styles.dateText}>{formattedDueDate}</Text>
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
          <Text style={styles.submitText}>Update Project</Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EditProject;
