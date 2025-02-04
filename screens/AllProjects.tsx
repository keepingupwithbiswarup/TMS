import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import * as Progress from 'react-native-progress';
import IpRoute from '../utilities/iproute';
import Header from '../components/Header';

const projectIcon = require('../assets/project-icon.png');
const commentIcon = require('../assets/settings.png');
const documentIcon = require('../assets/report-icon.png');
const menuIcon = require('../assets/grid.png');

interface UtilityProps {
  route: any;
  navigation: any;
}

const AllProjects: React.FC<UtilityProps> = ({ navigation }) => {
  const [filter, setFilter] = useState('In Progress');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Function to fetch project status (if needed for future use)
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

  // Define fetchProjects so it can be used in both useEffect and onRefresh
  const fetchProjects = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://${IpRoute}/api/projects`);
      const data = await response.json();

      // Map each project to include status and progress
      const projectsWithStatus = await Promise.all(
        data.map(async (project: any) => {
          const status = project.Status;
          return {
            id: project.ProjectId.toString(),
            name: project.ProjectName,
            progress: status === 'Ongoing' ? 50 : status === 'Finished' ? 100 : 0,
            status: status,
            comments: 0,
            documents: 0,
          };
        })
      );

      setProjects(projectsWithStatus);
    } catch (error) {
      setError('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProjects();
    setRefreshing(false);
  };

  const filteredProjects = projects
    .filter((project) => {
      if (filter === 'All Projects') {
        return true;
      }
      if (filter === 'In Progress') {
        return project.progress > 0 && project.progress < 100;
      }
      return project.status === filter;
    })
    .filter((project) => project.name.toLowerCase().includes(searchQuery.toLowerCase()));

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

    return (
      <TouchableOpacity
        onPress={() => navigation.navigate('TaskDetails', { projectId: item.id })}
        activeOpacity={0.8}
      >
        <View style={styles.projectCard}>
          <View style={styles.header}>
            <View style={[styles.statusBadge, { backgroundColor: statusBackgroundColor }]}>
              <Image source={projectIcon} style={[styles.statusIcon, { tintColor: statusTextColor }]} />
              <Text style={[styles.statusText, { color: statusTextColor }]}>{statusText}</Text>
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
              color={statusBackgroundColor}
              unfilledColor="#F5F5F5"
              style={{ flex: 1, borderWidth: 0 }}
            />
            <Text style={[styles.progressText, { color: statusBackgroundColor }]}>{item.progress}%</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/back-arrow.png')} style={styles.backIcon} />
        </TouchableOpacity>

        <Text style={styles.headerText}>Projects</Text>
      </View>

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

      <TextInput
        style={styles.searchBar}
        placeholder="Search projects..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#4a6fe9" style={styles.loadingIndicator} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : (
        <FlatList
          data={filteredProjects}
          renderItem={renderProject}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4a6fe9']} />
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 2,
    borderWidth: 0.2,
    borderColor: 'black',
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
    tintColor: '#4a6fe9',
  },
  statusText: {
    fontSize: 12,
    color: '#4a6fe9',
    fontWeight: '600',
  },
  menuIcon: {
    width: 16,
    height: 16,
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
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 20,
    paddingHorizontal: 15,
    elevation: 1,
    marginBottom: 1,
  },
  backButton: {
    position: 'absolute',
    left: 15,
    top: 20,
    zIndex: 10,
  },
  backIcon: {
    width: 20,
    height: 20,
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
    right: 20,
    top: 20,
    zIndex: 10,
  },
  plusIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});

export default AllProjects;
