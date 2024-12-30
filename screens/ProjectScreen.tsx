import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as Progress from 'react-native-progress';
import Header from '../components/Header';


const projectsData = [
    {
        id: '1',
        name: 'PreCorp Website Design',
        progress: 75,
        status: 'In Progress',
        comments: 26,
        documents: 2,
    },
    {
        id: '2',
        name: 'Tasktion - Project Management...',
        progress: 40,
        status: 'In Progress',
        comments: 16,
        documents: 3,
    },
    {
        id: '3',
        name: 'Project Infinity Web Design',
        progress: 0,
        status: 'Due',
        comments: 10,
        documents: 1,
    },
    {
        id: '4',
        name: 'Complete Web App Design',
        progress: 100,
        status: 'Completed',
        comments: 30,
        documents: 5,
    },
];

const projectIcon = require('../assets/project-icon.png');
const commentIcon = require('../assets/settings.png');
const documentIcon = require('../assets/report-icon.png');
const menuIcon = require('../assets/menu-icon.png');

interface DepartmentDetailsProps {
    department: any;
    route: any;
    navigation: any;
}

const ProjectScreen: React.FC<DepartmentDetailsProps> = ({navigation}) => {
    const [filter, setFilter] = useState('In Progress');

    
    const filteredProjects = projectsData.filter((project) => {
        if (filter === 'All Projects') {
            return true; 
        }
        if (filter === 'In Progress') {
            return project.progress > 0 && project.progress < 100; 
        }
        return project.status === filter; 
    });
    

    const renderProject = ({ item }: { item: any }) => {
        const progressValue = Math.max(0, Math.min(Number(item.progress) / 100, 1));
        let statusText = '';
        let statusBackgroundColor = '#dbe4ff'; 
        let statusTextColor = '#4a6fe9';
    
        if (item.progress === 100) {
            statusText = 'Completed';
            statusBackgroundColor = '#4CAF50';
            statusTextColor = 'white'; 
        } else if (item.progress === 0) {
            statusText = 'Due';
            statusBackgroundColor = '#FFC94A'; 
            statusTextColor = '#C07F00';
        } else {
            statusText = 'In Progress';
        }
    

        

        if (item.progress === 100) {
            statusText = 'Completed';
        } else if (item.progress === 0) {
            statusText = 'Due';
        } else {
            statusText = 'In Progress';
        }

        return (
            <TouchableOpacity onPress={()=>{navigation.navigate('TaskDetails')}} activeOpacity={0.8}>
            <View style={styles.projectCard}>
                <View style={styles.header}>
                    <View style={[styles.statusBadge,{backgroundColor: statusBackgroundColor}]}>
                        <Image source={projectIcon} style={[styles.statusIcon,{tintColor:statusTextColor}]} />
                        <Text style={[styles.statusText,{color:statusTextColor}]}>{statusText}</Text>
                    </View>
                    <Image source={menuIcon} style={styles.menuIcon} />
                </View>

                <Text style={styles.projectName}>{item.name}</Text>
                <View style={styles.infoRow}>
                    <View style={styles.infoItem}>
                        <Image source={commentIcon} style={styles.infoIcon} />
                        <Text style={styles.infoText}>{item.comments} Comments</Text>
                    </View>
                    <View style={styles.infoItem}>
                        <Image source={documentIcon} style={styles.infoIcon} />
                        <Text style={styles.infoText}>{item.documents} Documents</Text>
                    </View>
                </View>

                <View style={styles.progressRow}>
                    <Progress.Bar
                        progress={progressValue}
                        width={null}
                        height={9}
                        borderRadius={4}
                        color={item.status === 'In Progress' ? '#4a6fe9' : statusBackgroundColor}
                        unfilledColor="#F5F5F5"
                        style={{ flex: 1, borderWidth: 0 }}
                    />
                    <Text style={[styles.progressText,{color: item.status === 'In Progress' ? '#4a6fe9' : statusBackgroundColor}]}>{item.progress}%</Text>
                </View>
            </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Header headingText="Projects" />

            <View style={styles.filterContainer}>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'In Progress' && styles.activeButton]}
                    onPress={() => setFilter('In Progress')}
                >
                    <Text style={styles.filterText}>In Progress</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.filterButton, filter === 'All Projects' && styles.activeButton]}
                    onPress={() => setFilter('All Projects')}
                >
                    <Text style={styles.filterText}>All Projects</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredProjects}
                renderItem={renderProject}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FAFAFA',
    },
    listContent: {
        paddingBottom: 20,
        paddingHorizontal: 15,
    },
    projectCard: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#dbe4ff',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    statusIcon: {
        width: 16,
        height: 16,
        marginRight: 5,
        tintColor: "#4a6fe9"
    },
    statusText: {
        fontSize: 12,
        color: '#4a6fe9',
        fontWeight: '600',
    },
    menuIcon: {
        width: 16,
        height: 16,
        tintColor: "#4a6fe9"
    },
    projectName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333333',
        marginBottom: 10,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    infoIcon: {
        width: 16,
        height: 16,
        marginRight: 5,
    },
    infoText: {
        fontSize: 12,
        color: '#666666',
    },
    progressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    progressText: {
        fontSize: 12,
        color: '#4a6fe9',
        fontWeight: '600',
        paddingLeft: 10,
    },
    filterContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        paddingHorizontal: 20,
        marginTop: 20,
    },
    filterButton: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: '#B6BBC4',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1,
        marginBottom: 10,
    },
    activeButton: {
        backgroundColor: '#4a6fe9',
    },
    filterText: {
        fontSize: 14,
        color: '#FFF',
    },
});

export default ProjectScreen;
