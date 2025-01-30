import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, Modal, Button, Dimensions, Platform, Pressable } from 'react-native';
import Header from '../components/Header';

import { User } from '../utilities/types';
import usePdfSource from '../utilities/usePdfSource';
import CustomModal from '../components/CustomModal';
import IpRoute from '../utilities/iproute';
import { useFocusEffect } from '@react-navigation/native';
import { set } from 'date-fns';
import { PieChart } from 'react-native-chart-kit';





type Subtask = {
    SubTaskId: number;
    SubTaskName: string;
    Status?: 'Due' | 'Ongoing' | 'Finished';
    CreatedAt: string;
    DueDate: string;
    Description: string;
    Comments: string;
};

type Task = {
    TaskId: number;
    TaskName: string;
    Description: string;
    DueDate: string;
    ProjectId: number;
    CreatedAt: string;
    Progress?: number;
    Comments?: number;
    Documents?: number;
    AssignedTo?: string;
    Priority?: 'Low' | 'Medium' | 'High';
    Status?: 'Due' | 'Ongoing' | 'Finished';
    Subtasks?: Subtask[];
};



type Project = {
    ProjectId: number;
    ProjectName: string;
    Description: string;
    ImagePath: string | null;
    Status: string;
    CreatedAt: string;
    progress?: number;
    teamMembers?: User[];
    tasks?: Task[];
    dueDate?: string;
};


interface Timesheet {
    TimesheetId: number;
    StartTime: string;
    EndTime: string;
    DateInfo: string;
    Description: string;
    SubTaskId: number;
    SubTaskName: string;
    TaskId: number;
    TaskName: string;
    ProjectId: number;
    ProjectName: string;
}






const TimesheetProject = ({ navigation, route }: { navigation: any, route: any }) => {
    const { projectId, taskId, subtaskId, timesheetId} = route.params;

    const [projectData, setProjectData] = useState<Project | null>(null);
    const [isDescriptionExpanded, setDescriptionExpanded] = useState(false);
    const [projectModalVisible, setProjectModalVisible] = useState(false);
    const [taskModalVisible, setTaskModalVisible] = useState(false);
    const [subtaskModalVisible, setSubTaskModalVisible] = useState(false);
    const [approveModalVisible, setApproveModalVisible] = useState(false);
    const [disapproveModalVisible, setDisapproveModalVisible] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [source, changeSource] = usePdfSource();
    const [visibleSubtasks, setVisibleSubtasks] = useState<{ [key: number]: boolean }>({});
    const [currTaskId, setCurrTaskId] = useState(0);
    const [currSubTaskId, setCurrSubTaskId] = useState(0);
    const [highlightedSubtaskId, setHighlightedSubtaskId] = useState<number | null>(null);
    const [taskCount, setTaskCount] = useState(0);
    const [ongoingTaskCount, setOngoingTaskCount] = useState(0);
    const [completedTaskCount, setCompletedTaskCount] = useState(0);
    const [totalHours, setTotalHours] = useState<number>(0);

    async function getProjectStatus(projectId: number): Promise<string> {
        try {
            if (!projectId) {
                throw new Error('ProjectId is required to fetch the status.');
            }
            const numericProjectId = Number(projectId);

            const response = await fetch(`http://${IpRoute}/api/subtaskstatuses/${numericProjectId}`);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch subtasks.');
            }

            const data = await response.json();
            const subtasks = data.subtasks;

            const status = determineStatus(subtasks);
            await updateProjectStatus(numericProjectId, status);

            return status
    
        } catch (error) {
            console.error('Error fetching project status:', error);
            return 'Due';
        }
    }

    const determineStatus = (subtasks: Subtask[]): string => {
        if (subtasks.length === 0) return 'Due'; 
    
        let allFinished = true;
        let someFinished = false;
    
        subtasks.forEach((subtask) => {
            if (subtask.Status === 'Finished') {
                someFinished = true;
            } else {
                allFinished = false;
            }
        });
    
        if (allFinished) return 'Finished';
        if (someFinished) return 'Ongoing';
        return 'Due';
    };
    
    async function updateProjectStatus(projectId: number, status: string) {
        try {
            const response = await fetch(`http://${IpRoute}/api/projectstatusupdate/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            });
    
            if (!response.ok) {
                throw new Error('Failed to update project status.');
            }
            console.log(`Project ${projectId} status updated to: ${status}`);
        } catch (error) {
            console.error('Error updating project status:', error);
        }
    }

    const getTaskStatus = (subtasks: Subtask[]) => {
        let allFinished = true;
        let someFinished = false;

        for (let i = 0; i < subtasks.length; i++) {
            if (subtasks[i].Status === 'Finished') {
                someFinished = true;
            } else {
                allFinished = false;
            }
        }

        if (allFinished) {
            return 'Finished';
        } else if (someFinished) {
            return 'Ongoing';
        } else {
            return 'Due';
        }
    };


    const toggleSubtaskVisibility = (taskId: number) => {
        setVisibleSubtasks(prev => ({
            ...prev,
            [taskId]: !prev[taskId],
        }));
    };

    const openPdf = (fileName: string) => {
        const newUri = `bundle-assets://${fileName}`;
        changeSource(newUri);
        navigation.navigate('DocumentViewPage', { source: { uri: newUri, cache: true } });
    };

    const handleProjectDelete = () => {
        setProjectModalVisible(true);
    };
    const handleTaskDelete = (taskId: number) => {
        setTaskModalVisible(true);
        setCurrTaskId(taskId);
    };
    const handleSubTaskDelete = (subTaskId: number) => {
        setSubTaskModalVisible(true);
        setCurrSubTaskId(subTaskId)
    };


    const cancelProjectModal = () => {
        setProjectModalVisible(false);
    };
    const cancelTaskModal = () => {
        setTaskModalVisible(false);
    };
    const cancelSubTaskModal = () => {
        setSubTaskModalVisible(false);
    };
    const cancelApproveModal = () => {
        setApproveModalVisible(false);
    };
    const cancelDisapproveModal = () => {
        setDisapproveModalVisible(false);
    };


    const confirmProjectDeletion = async (projectId: number) => {
        if (!projectId) {
            console.error('Project ID is missing');
            return;
        }

        console.log('Attempting to delete Project ID:', projectId);

        try {
            setProjectModalVisible(false);

            const response = await fetch(`http://${IpRoute}/api/deleteproject`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ projectId }),
            });

            if (response.ok) {
                const data = await response.text();
                console.log('Project deleted:', data);
            } else {
                const errorMessage = await response.text();
                console.error('Failed to delete project:', errorMessage);
            }
        } catch (error) {
            console.error('Error deleting project:', error);
        }
    };

    const confirmTaskDeletion = async (taskId: number) => {
        if (!taskId) {
            console.error('Task ID is missing');
            return;
        }

        console.log('Attempting to delete Task ID:', taskId);

        try {
            setTaskModalVisible(false);

            const response = await fetch(`http://${IpRoute}/api/deletetask`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ taskId }),
            });

            if (response.ok) {
                const data = await response.text();
                console.log('Task deleted:', data);
            } else {
                const errorMessage = await response.text();
                console.error('Failed to delete task:', errorMessage);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const confirmSubTaskDeletion = async (subTaskId: number) => {
        if (!subTaskId) {
            console.error('Subtask ID is missing');
            return;
        }

        console.log('Attempting to delete Subtask ID:', subTaskId);

        try {
            setSubTaskModalVisible(false);

            const response = await fetch(`http://${IpRoute}/api/deletesubtask`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subTaskId }),
            });

            if (response.ok) {
                const data = await response.text();
                console.log('Subtask deleted:', data);
            } else {
                const errorMessage = await response.text();
                console.error('Failed to delete subtask:', errorMessage);
            }
        } catch (error) {
            console.error('Error deleting subtask:', error);
        }
    };

    const approveSubtask = async (subTaskId: number) => {
        try {
            const response = await fetch(`http://${IpRoute}/api/approvesubtask/${subTaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'Finished',
                    approval: 'Approved',
                    timesheetId: timesheetId,

                }),
            });

            if (response.ok) {
                const result = await response.text();
                setApproveModalVisible(false);
            } else {
                const errorMessage = await response.text();
                console.error('Failed to update subtask:', errorMessage);
            }
        } catch (error) {
            console.error('Error calling the API:', error);
        }
    };
    const disapproveSubtask = async (subTaskId: number) => {
        try {
            const response = await fetch(`http://${IpRoute}/api/approvesubtask/${subTaskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    status: 'Due',
                    approval: 'Unapproved',
                    timesheetId: timesheetId,
                }),
            });

            if (response.ok) {
                const result = await response.text();
                setDisapproveModalVisible(false);
            } else {
                const errorMessage = await response.text();
                console.error('Failed to update subtask:', errorMessage);
            }
        } catch (error) {
            console.error('Error calling the API:', error);
        }
    };



    // const [statistics, setStatistics] = useState([
    //     { day: 'M', onTarget: 30, tasksTarget: 20, offTarget: 10 },
    //     { day: 'T', onTarget: 40, tasksTarget: 25, offTarget: 15 },
    //     { day: 'W', onTarget: 20, tasksTarget: 15, offTarget: 10 },
    //     { day: 'T', onTarget: 50, tasksTarget: 30, offTarget: 20 },
    //     { day: 'F', onTarget: 35, tasksTarget: 25, offTarget: 15 },
    //     { day: 'S', onTarget: 25, tasksTarget: 20, offTarget: 5 },
    // ]);

    const projectdata = [
        {
          name: 'Done',
          population: completedTaskCount,
          color: '#4CAF50',
        },
        {
          name: 'Ongoing',
          population: ongoingTaskCount,
          color: '#FFC94A',
        },
        {
          name: 'Due',
          population: taskCount - (completedTaskCount + ongoingTaskCount),
          color: '#FF8383',
        },
      ];








    
  const formatTime = (decimalHours: number) => {
    const totalMinutes = Math.floor(decimalHours * 60); 
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60; 
    const seconds = Math.round((decimalHours * 3600) % 60); 
  
    return `${String(hours).padStart(2,'0')} hrs ${String(minutes).padStart(2,'0')} mins`;
  };
      

    const fetchProjectData = async () => {
        try {
            const response = await fetch(`http://${IpRoute}/api/projects`);
            const data = await response.json();

            const taskResponse = await fetch(`http://${IpRoute}/api/tasks`);
            const allTasks = await taskResponse.json();

            const subtaskResponse = await fetch(`http://${IpRoute}/api/subtasks`);
            const allSubtasks = await subtaskResponse.json();

            const teamResponse = await fetch(`http://${IpRoute}/api/teams`);
            const allTeams = await teamResponse.json();

            const teamMemberResponse = await fetch(`http://${IpRoute}/api/teammembers`);
            const allTeamMembers = await teamMemberResponse.json();

            const employeesResponse = await fetch(`http://${IpRoute}/api/employees`);
            const allEmployees = await employeesResponse.json();

            const project = data.find((item: any) => item.ProjectId == projectId);

            if (!project) {
                console.error('Project not found');
                return;
            }

            const projectTimesheetsResponse = await fetch(`http://${IpRoute}/api/projecttimesheets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ projectId }),
            });

            if (!projectTimesheetsResponse.ok) {
                console.error("Failed to fetch project timesheets:", projectTimesheetsResponse.statusText);
            } else {
                const data: Timesheet[] = await projectTimesheetsResponse.json();

                const totalWorkingHours = data.reduce((total, timesheet) => {
                    const startTime = new Date(timesheet.StartTime);
                    const endTime = new Date(timesheet.EndTime);
                    const hoursWorked = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
                    return total + hoursWorked;
                }, 0);

                setTotalHours(totalWorkingHours);

                console.log(`Total working hours: ${totalWorkingHours.toFixed(2)} hours`);
            }

            const projectTeams = allTeams.filter((item: any) => item.ProjectId == projectId);

            // if (projectTeams.length === 0) {
            //   console.error('No teams found for the project');
            //   return;
            // }

            const team = projectTeams[0];
            const teamMembers = allTeamMembers.filter((item: any) => item.TeamId == team.TeamId);

            // if (teamMembers.length === 0) {
            //   console.error('No team members found for this team');
            //   return;
            // }

            const projectTeam = teamMembers.map((member: any) => {
                const employee = allEmployees.find((emp: any) => emp.EmployeeId == member.EmployeeId);
                return employee || null;
            }).filter((emp: any) => emp !== null);


            if (project) {
                const tasksForProject = allTasks.filter((task: any) => task.ProjectId == projectId);


                const tasksWithSubtasks = tasksForProject.map((task: any) => {
                    const subtasks = allSubtasks.filter((subtask: any) => subtask.TaskId === task.TaskId);

                    return { ...task, Subtasks: subtasks };
                });


                const createdAt = project.CreatedAt;


                const createdDate = new Date(createdAt);
                if (isNaN(createdDate.getTime())) {
                    throw new Error('Invalid createdAt date');
                } else {
                    console.log('Valid createdAt date:', createdDate);
                }

                const dueDate = new Date(project.DueDate);



                const getFormattedDate = (date: Date) => {
                    const day = date.getDate();
                    const month = date.toLocaleString('en-GB', { month: 'short' });
                    const year = date.getFullYear();

                    const suffix = ['st', 'nd', 'rd'][((day % 10) - 1) % 10] || 'th';

                    return `${day}${suffix} ${month}, ${year}`;
                };
                const projectstatus = await getProjectStatus(projectId);

                setTaskCount(tasksForProject.length);





                setProjectData({
                    ...project,
                    tasks: tasksWithSubtasks,
                    dueDate: getFormattedDate(dueDate),
                    teamMembers: projectTeam,
                    Status: projectstatus,
                });
                setOngoingTaskCount(0);
                setCompletedTaskCount(0);

                const updateTaskStatus = async (task: any) => {
                    let allFinished = true;
                    let someFinished = false;
            
                    for (let i = 0; i < task.Subtasks.length; i++) {
                        if (task.Subtasks[i].Status === 'Finished') {
                            someFinished = true;
                        } else {
                            allFinished = false;
                        }
                    }
            
                    let newStatus = 'Due';
                    if (allFinished) {
                        newStatus = 'Finished';
                    } else if (someFinished) {
                        newStatus = 'Ongoing';
                    }
            
                    try {
                        await fetch(`http://${IpRoute}/api/taskstatus/${task.TaskId}`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: newStatus }),
                        });
            
                        return newStatus;
                    } catch (error) {
                        console.error(`Error updating task ${task.TaskId} status:`, error);
                        return 'Due';
                    }
                };
            
                for (let i = 0; i < tasksWithSubtasks.length; i++) {
                    const task = tasksWithSubtasks[i];
                    const taskStatus = await updateTaskStatus(task);
            
                    if (taskStatus === "Ongoing") {
                        setOngoingTaskCount((prevCount) => prevCount + 1);
                    } else if (taskStatus === "Finished") {
                        setCompletedTaskCount((prevCount) => prevCount + 1);
                    }
                }
            } else {
                console.error('Project not found!');
            }
        } catch (error) {
            console.error('Error fetching project data:', error);
        }
    };


    useFocusEffect(
        useCallback(() => {
            fetchProjectData();

            if (taskId) {
                setVisibleSubtasks((prev) => ({
                    ...prev,
                    [taskId]: true,
                }));
            }

            if (subtaskId) {
                setHighlightedSubtaskId(subtaskId);
            }

            const interval = setInterval(() => {
                setElapsedTime((prevTime) => prevTime + 1);
            }, 1000);

            return () => clearInterval(interval);
        }, [projectId, taskId, subtaskId])
    );

    // const handleBarPress = (day: string, type: any, count: number) => {
    //     Alert.alert(`${day} Statistics`, `${count} tasks (${type})`);
    // };



    const renderTask = (task: Task, index: number) => {
        const isSubtaskVisible = visibleSubtasks[task.TaskId] || false;








        return (
            <View style={styles.taskCard}>
                <View style={styles.taskTitleContainer}>
                    <View style={styles.rightSideContainer}>
                        <Image
                            source={
                                task.Subtasks && task.Subtasks.length > 0
                                    ? getTaskStatus(task.Subtasks) === "Finished"
                                        ? require('../assets/tick.png')
                                        : getTaskStatus(task.Subtasks) === "Ongoing"
                                            ? require('../assets/ongoing.png')
                                            : require('../assets/checkbox.png')
                                    : require('../assets/checkbox.png')
                            }
                            style={[styles.checkboxIcon, { tintColor: task.Subtasks && task.Subtasks.length > 0 && getTaskStatus(task.Subtasks) === "Finished" ? '#4CAF50' : '#666666' }]}
                        />


                        <TouchableOpacity onPress={() => toggleSubtaskVisibility(task.TaskId)}>
                            <Image
                                source={isSubtaskVisible ? require('../assets/up-arrow.png') : require('../assets/down-arrow.png')}
                                style={[styles.subarrowIcon, { tintColor: "black" }]}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { navigation.navigate('EditTask', { taskId: task.TaskId }) }}>
                            <Image
                                source={require('../assets/editcard.png')}
                                style={[styles.subarrowIcon, { tintColor: "black", marginLeft: 5, marginTop: 4 }]}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => handleTaskDelete(task.TaskId)} style={styles.iconButton}>
                            <Image
                                source={require('../assets/delete-icon.png')}
                                style={[styles.icon, { tintColor: "red", height: 23, width: 23 }]}
                            />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.taskTitle}>{index + 1}. {task.TaskName}</Text>
                </View>

                <Text style={{ padding: 1, color: "#7D7C7C", paddingVertical: 5 }}>{task.Description}</Text>



                {isSubtaskVisible ? (
                    task.Subtasks && task.Subtasks.length > 0 ? (
                        <View style={styles.subtaskContainer}>
                            {task.Subtasks.map((subtask, subindex) => {
                                return (
                                    <View key={subtask.SubTaskId} style={styles.subtaskItem}>
                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text
                                                style={[
                                                    styles.subtaskText,
                                                    highlightedSubtaskId === subtask.SubTaskId && styles.highlightedSubtask,
                                                ]}
                                            >{index + 1}:{subindex + 1} {subtask.SubTaskName}</Text>
                                            <TouchableOpacity
                                                onPress={() => {

                                                    if (subtask.SubTaskId === subtaskId) {
                                                        if (subtask.Status === 'Finished') {
                                                            setDisapproveModalVisible(true);
                                                        } else {
                                                            setApproveModalVisible(true);
                                                        }
                                                    }
                                                }}
                                            >
                                                <Image
                                                    source={
                                                        subtask.Status === 'Finished'
                                                            ? require('../assets/tick.png')
                                                            : require('../assets/checkbox.png')
                                                    }
                                                    style={[
                                                        styles.statusIcon,
                                                        { tintColor: subtask.Status === 'Finished' ? '#4CAF50' : '#666666' },
                                                    ]}
                                                />
                                            </TouchableOpacity>

                                            <TouchableOpacity onPress={() => { navigation.navigate('EditSubTask', { subTaskId: subtask.SubTaskId }) }}>
                                                <Image
                                                    source={require('../assets/editcard.png')}
                                                    style={[styles.subarrowIcon, { tintColor: "black", marginLeft: 5, height: 25, width: 25, marginTop: 4 }]}
                                                />
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => handleSubTaskDelete(subtask.SubTaskId)} style={styles.iconButton}>
                                                <Image
                                                    source={require('../assets/delete-icon.png')}
                                                    style={[styles.icon, { tintColor: "red", height: 21, width: 21 }]}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                fontStyle: 'italic',
                                                paddingLeft: 31,
                                                paddingTop: 10,
                                                color: '#61677A',
                                            }}
                                        >
                                            {subtask.Description}
                                        </Text>
                                    </View>

                                );
                            })}
                            <View style={{ height: 25, borderLeftWidth: 1, borderLeftColor: "#4a6fe9", marginLeft: 11.2 }} />
                            <View style={{ flexDirection: 'row', alignItems: "center" }}>

                                <Image source={require("../assets/addcircle.png")} style={{ height: 23, width: 23, tintColor: "#4a6fe9" }} />
                                <Text onPress={() => { navigation.navigate('AddSubTask', { taskId: task.TaskId }) }} style={{ fontSize: 14, marginLeft: 5, paddingVertical: 10, fontWeight: "bold", color: "#4a6fe9" }}>Add Subtask</Text>
                            </View>

                        </View>

                    ) : (
                        <View>
                            <Text style={{ fontStyle: "italic", fontSize: 12, paddingVertical: 10 }}>No subtasks available</Text>
                            <View style={{ flexDirection: 'row', alignItems: "center" }}>

                                <Image source={require("../assets/addcircle.png")} style={{ height: 23, width: 23, tintColor: "#4a6fe9" }} />
                                <Text onPress={() => { navigation.navigate('AddSubTask', { taskId: task.TaskId }) }} style={{ fontSize: 14, marginLeft: 5, paddingVertical: 10, fontWeight: "bold", color: "#4a6fe9" }}>Add Subtask</Text>
                            </View>
                        </View>
                    )
                ) : null}


                <View style={styles.taskIcons}>
                    <View style={styles.iconWrapper}>
                        <Image source={require('../assets/comments-icon.png')} style={styles.icon} />
                        <Text style={styles.iconText}>{task.Comments} Comments</Text>
                    </View>
                    <View style={styles.iconWrapper}>
                        <Image source={require('../assets/attachment.png')} style={styles.icon} />
                        <Text style={styles.iconText}>{task.Documents} Documents</Text>
                    </View>
                </View>

            </View>
        );
    };


    const renderTeamMembers = () => {
        const teamMembers = projectData?.teamMembers || [];

        if (teamMembers.length === 0) {
            return <Text style={{
                fontSize: 14,
                color: '#777',
                paddingVertical: 10,
                fontStyle: "italic",
            }}>No members assigned</Text>;
        }

        const displayedMembers = teamMembers.slice(0, 3);
        const remainingCount = teamMembers.length - 3;

        return (
            <TouchableOpacity onPress={() => { navigation.navigate('TeamMembers', { projectId }) }} style={styles.teamList}>
                {displayedMembers.map((member, index) => (
                    <View key={index} style={styles.memberCircle}>
                        <Text style={styles.memberInitial}>{member?.Username.charAt(0)}</Text>
                    </View>
                ))}
                {remainingCount > 0 && (
                    <View style={styles.memberCircle}>
                        <Text style={styles.memberInitial}>+{remainingCount}</Text>
                    </View>
                )}
            </TouchableOpacity>
        );
    };


    if (!projectData) {
        return (
            <View style={styles.container}>
                <Header headingText="Project Details" />
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer2}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image
                        source={require('../assets/back-arrow.png')}
                        style={styles.backIcon}
                    />
                </TouchableOpacity>

                <Text style={styles.headerText}>Project Details</Text>

                <View style={styles.iconContainer}>
                    <TouchableOpacity onPress={() => { navigation.navigate('AddTask', { projectId: projectId }) }} style={styles.iconButton}>
                        <Image
                            source={require('../assets/add-icon.png')}
                            style={styles.icon}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('EditProject', { projectId: projectId }) }} style={styles.iconButton}>
                        <Image
                            source={require('../assets/editcard.png')}
                            style={[styles.icon, { marginTop: 4 }]}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleProjectDelete} style={styles.iconButton}>
                        <Image
                            source={require('../assets/delete-icon.png')}
                            style={[styles.icon, { tintColor: "red" }]}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.headerContainer}>
                    <View
                        style={[
                            styles.badgeContainer,
                            projectData.Status === 'Finished'
                                ? { backgroundColor: '#4CAF50' }
                                : projectData.Status === 'Ongoing'
                                    ? { backgroundColor: '#068FFF' }
                                    : { backgroundColor: '#F44336' },
                        ]}
                    >
                        <Image
                            source={
                                projectData.Status === 'Finished'
                                    ? require('../assets/tick.png')
                                    : projectData.Status === 'Ongoing'
                                        ? require('../assets/ongoing.png')
                                        : require('../assets/checkbox.png')
                            }
                            style={{
                                height: 25,
                                width: 25,
                                tintColor: 'white',
                            }}
                        />
                        <Text style={styles.badgeText}>{projectData.Status}</Text>
                    </View>
                    <Text style={styles.taskName}>{projectData.ProjectName}</Text>
                </View>
                <Text style={{ fontSize: 14, color: '#686D76', marginBottom: 8 }}>Description</Text>

                <Text style={styles.description}>
                    {isDescriptionExpanded
                        ? projectData.Description
                        : `${projectData.Description.slice(0, 150)}...`}
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
                        <Text style={styles.dueDate}>{projectData.dueDate}</Text>
                    </View>
                </View>

                <View style={styles.taskProgressContainer}>
                    <Text style={styles.sectionTitle}>Tasks</Text>
                    {projectData.tasks?.map((task, index) => renderTask(task, index))}
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
                            <Text style={styles.statValue}>{formatTime(totalHours)}</Text>
                            {/* <View style={styles.newbadgeContainer}>
                                <Image source={require('../assets/up-arrow.png')} style={styles.uparrowIcon} />
                                <Text style={styles.percentage}>34%</Text>
                            </View> */}
                        </View>
                    </View>


                    <View style={[styles.statContainer, { borderLeftWidth: 0.7, borderColor: "#9AA6B2" }]}>
                        <Text style={styles.statLabel}>Total Tasks Activity</Text>
                        <View style={styles.statValueContainer}>
                            <Text style={styles.statValue}>{taskCount} Tasks</Text>
                            {/* <View style={styles.badgeContainerDown}>
                                <Image source={require('../assets/down-arrow.png')} style={styles.downarrowIcon} />
                                <Text style={styles.percentageDown}>14%</Text>
                            </View> */}
                        </View>
                    </View>
                </View>


                <View style={styles.cardsContainer}>

                    <View style={[styles.card, styles.inProgressCard]}>
                        <Image
                            source={require('../assets/grid.png')}
                            style={styles.arrowIcon}
                        />

                        <Text style={styles.cardNumber}>{ongoingTaskCount}</Text>
                        <Text style={styles.cardLabel}>Ongoing Tasks</Text>
                    </View>
                    <View style={[styles.card, styles.completedCard]}>
                        <Image
                            source={require('../assets/grid.png')}
                            style={styles.arrowIcon}
                        />
                        <Text style={styles.cardNumber}>{completedTaskCount}</Text>
                        <Text style={styles.cardLabel}>Tasks Completed</Text>
                    </View>
                </View>

                {/* <View style={styles.statisticsContainer}>
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
                        <View style={styles.legendItem}><View style={[styles.legendColor, { backgroundColor: '#1e88e5' }]} /><Text style={{ fontSize: 12 }}>On Target</Text></View>
                        <View style={styles.legendItem}><View style={[styles.legendColor, { backgroundColor: '#000' }]} /><Text style={{ fontSize: 12 }}>Tasks Target</Text></View>
                        <View style={styles.legendItem}><View style={[styles.legendColor, { backgroundColor: '#d32f2f' }]} /><Text style={{ fontSize: 12 }}>Off Target</Text></View>
                    </View>
                </View> */}

<View style={{ marginTop: 20 }}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tast Status</Text>
            <Image source={require('../assets/arrow-icon.png')} style={styles.arrowIcon} />
          </View>
          <View style={styles.divider} />
          <PieChart
            data={projectdata}
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

                <Text style={{
                    fontSize: 18,
                    fontWeight: '600',
                    color: '#333333',
                    padding: 3,
                    marginTop: 25,
                }}>List of documents attached</Text>

                <Text style={{
                    fontSize: 13,
                    fontWeight: '400',
                    color: '#686D76',
                    padding: 3,
                    fontStyle: "italic",
                }}>View the documents attached by clicking on them</Text>


                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => openPdf('resume.pdf')}
                        style={styles.selectPdfButton}
                    >
                        <View style={styles.iconTextContainer}>
                            <Image
                                source={require('../assets/report.png')}
                                style={styles.iconreport}
                            />
                            <Text style={styles.selectPdfText}>report.pdf</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        onPress={() => openPdf('sample.pdf')}
                        style={styles.selectPdfButton}
                    >
                        <View style={styles.iconTextContainer}>
                            <Image
                                source={require('../assets/report.png')}
                                style={styles.iconreport}
                            />
                            <Text style={styles.selectPdfText}>report2.pdf</Text>
                        </View>
                    </TouchableOpacity>
                </View>









                <View style={{ height: 50 }} />
            </ScrollView>

            <CustomModal visible={projectModalVisible} cancelModal={cancelProjectModal} confirmDeletion={() => confirmProjectDeletion(parseInt(projectId))} title='Are you sure you want to delete this project permanently?' subtitle='Deleting this project would mean deletion of the associated tasks and subtasks.' />
            <CustomModal
                visible={taskModalVisible}
                cancelModal={cancelTaskModal}
                confirmDeletion={() => confirmTaskDeletion(currTaskId)}
                title="Are you sure you want to delete this task permanently?"
                subtitle="Deleting this would mean deletion of the associated subtasks."
            />
            <CustomModal
                visible={approveModalVisible}
                cancelModal={cancelApproveModal}
                confirmDeletion={() => approveSubtask(subtaskId)}
                title="Do you want to approve this subtask?"
                subtitle="Approving this would mean the subtask is completed."
            />
            <CustomModal
                visible={disapproveModalVisible}
                cancelModal={cancelDisapproveModal}
                confirmDeletion={() => disapproveSubtask(subtaskId)}
                title="Do you want to disapprove this subtask?"
                subtitle="Disapproving this would mean the subtask is due."
            />

            <CustomModal visible={subtaskModalVisible} cancelModal={cancelSubTaskModal} confirmDeletion={() => confirmSubTaskDeletion(currSubTaskId)} title='Are you sure you want to delete this subtask permanently?' subtitle='Deleting this would mean deletion of the associated timesheets.' />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    iconTextContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconButton: {
        marginLeft: 5,

    },
    pdf: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    iconreport: {
        width: 28,
        height: 28,
        marginRight: 10,
        tintColor: 'white',
    },
    selectPdfButton: {
        paddingVertical: 3,
        width: "35%",
        paddingHorizontal: 11,
        backgroundColor: '#C62E2E',
        borderRadius: 3,
        marginVertical: 2,
    },
    buttonContainer: {
        marginTop: 5,
    },
    selectPdfText: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
    },
    button: {
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    modalContent: {
        flex: 1,
        padding: 20,
    },
    closeButton: {
        padding: 10,
        backgroundColor: 'red',
        marginTop: 20,
        borderRadius: 5,
    },
    scrollContainer: {
        padding: 20,
        paddingBottom: 30,
    },
    headerContainer: {
        marginBottom: 20,
        position: 'relative',
    },

    headerContainer2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingVertical: 20,
        paddingHorizontal: 15,
        elevation: 1,
        marginBottom: 1,
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
        alignItems: 'center',
        marginBottom: 12,
        position: 'relative',
    },
    taskTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333333',
        marginTop: 40,
    },
    checkboxIcon: {
        width: 22,
        height: 22,
    },
    rightSideContainer: {
        position: 'absolute',
        top: 0,
        right: 0,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    subarrowIcon: {
        width: 28,
        height: 28,
        marginLeft: 7,
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
        width: 25,
        height: 25,
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
    backIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
        marginLeft: 105,
    },
    plusButton: {
        position: 'absolute',
        right: 20,
        top: 20,
        zIndex: 10,
    },
    divider: {
        marginHorizontal: 15,
        marginVertical: 10,
      },
      sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingTop: 15,
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
        position: "relative",
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
        alignItems: "flex-end",
    },
    barGroup: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    backButton: {
        position: 'absolute',
        left: 15,
        top: 20,
        zIndex: 10,
    },
    plusIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
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

    subtaskContainer: {
        paddingVertical: 8,
    },
    subtaskItem: {
        marginBottom: 5,
        paddingTop: 25,

    },
    subtaskText: {
        fontSize: 14,
        color: '#4A4947',
        marginLeft: 5,
        fontWeight: "bold",
    },
    subtaskIcon: {
        width: 18,
        height: 18,
        marginRight: 8,
        tintColor: '#666',
    },
    subtaskStatus: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
        marginLeft: 8,
    },

    statusIcon: {
        width: 18,
        height: 18,
        marginLeft: 8,
    },
    highlightedSubtask: {
        backgroundColor: '#ffffcc',
        borderRadius: 5,
        padding: 10,

    },





});

export default TimesheetProject;
