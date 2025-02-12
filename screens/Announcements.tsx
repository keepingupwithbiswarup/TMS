import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ListRenderItemInfo,
  TouchableOpacity,
  Image,
  Alert,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import relativeTime from 'dayjs/plugin/relativeTime';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import IpRoute from '../utilities/iproute';
import { useNavigation } from '@react-navigation/native';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(advancedFormat);

const getRelativeTime = (dateStr: string): string => {
  const now = dayjs(); // local time now
  const past = dayjs.utc(dateStr).local(); // convert UTC date to local time
  const diffSeconds = now.diff(past, 'second');
  console.log(diffSeconds);

  if (diffSeconds < 60) return "just now";

  const diffMinutes = now.diff(past, 'minute');
  if (diffMinutes < 60) return `${diffMinutes} mins ago`;

  const diffHours = now.diff(past, 'hour');
  if (diffHours < 24) return `${diffHours} hours ago`;

  const diffDays = now.diff(past, 'day');
  if (diffDays < 30) return `${diffDays} days ago`;

  const diffMonths = now.diff(past, 'month');
  if (diffMonths < 12) return `${diffMonths} months ago`;

  const diffYears = now.diff(past, 'year');
  return `${diffYears} years ago`;
};


interface Announcement {
  AnnouncementId: number;
  DeptName: string;
  EmployeeId: number;
  Announcement: string;
  AnnouncementDate: string;
  Username: string;
}

const AnnouncementsScreen = ({ navigation }: { navigation: any }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Today'); // default to Today
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnnouncements = useCallback(() => {
    fetch(`http://${IpRoute}/api/announcements`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: Announcement[]) => {
        setAnnouncements(data);
        setLoading(false);
        setRefreshing(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAnnouncements();
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://${IpRoute}/api/deleteannouncement/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete announcement');
      }
      setAnnouncements(prev => prev.filter(item => item.AnnouncementId !== id));
    } catch (error) {
      console.error('Error deleting announcement:', error);
      Alert.alert('Failed to delete announcement. Please try again.');
    }
  };

  const renderRightActions = (id: number) => (
    <View style={styles.rightActionContainer}>
      <TouchableOpacity
        onPress={() => navigation.navigate('EditAnnouncement', { announcementId: id })}
        style={[styles.actionButton, styles.editButton]}
      >
        <Text style={styles.actionText}>Edit</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.actionButton, styles.deleteButton]}
        onPress={() => handleDelete(id)}
      >
        <Text style={styles.actionText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  const filterAnnouncements = () => {
    if (activeTab === 'Today') {
      return announcements.filter(a => dayjs.utc(a.AnnouncementDate).isSame(dayjs.utc(), 'day'));
    } else if (activeTab === 'Yesterday') {
      return announcements.filter(a =>
        dayjs.utc(a.AnnouncementDate).isSame(dayjs.utc().subtract(1, 'day'), 'day')
      );
    } else {
      return announcements;
    }
  };

  const renderItem = ({ item }: ListRenderItemInfo<Announcement>) => {
    // Format absolute time in UTC so that "2025-02-11T17:37:12.043Z" becomes 5:37 PM
    const absoluteDate = dayjs.utc(item.AnnouncementDate).format('ddd, MMM D, h:mm A');
    const relativeDate = getRelativeTime(item.AnnouncementDate);

    return (
      <Swipeable renderRightActions={() => renderRightActions(item.AnnouncementId)}>
        <View style={styles.card}>
          <View style={styles.rowContainer}>
            <View style={styles.dateContainer}>
              <Text style={styles.absoluteDate}>{absoluteDate}</Text>
              <Text style={styles.relativeTime}>{relativeDate}</Text>
            </View>
            <View style={styles.messageContainer}>
              <Text style={styles.rowText}>
                <Text style={styles.creatorName}>{item.Username}</Text>
                <Text style={styles.message}> made an announcement</Text>
              </Text>
              <Text style={styles.message}>{item.Announcement}</Text>
            </View>
          </View>
        </View>
      </Swipeable>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading announcements...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  const filteredAnnouncements = filterAnnouncements();

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={'#ffa300'} barStyle={'light-content'} />
      <Image source={require('../assets/announcebanner.png')} style={styles.banner} />
      <View style={{ flexDirection: 'row', paddingTop: 8 }}>
        <View style={styles.tabsContainer}>
          {['Today', 'Yesterday', 'All'].map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.addAnnouncementContainer}>
          <Text style={styles.addAnnouncementText}>Make an announcement</Text>
          <TouchableOpacity onPress={() => navigation.navigate('AddAnnouncement')}>
            <Image source={require('../assets/addcircle.png')} style={styles.addIcon} />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={filteredAnnouncements}
        keyExtractor={item => item.AnnouncementId.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {activeTab === 'Today'
                ? 'No announcements made today'
                : activeTab === 'Yesterday'
                  ? 'No announcements made yesterday'
                  : 'No announcements available'}
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    width: '100%',
    height: 200,
    marginRight: 10,
    resizeMode: 'cover',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10,
    marginLeft: 15,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 5,
    borderBottomWidth: 0.8,
    borderColor: 'transparent',
    marginHorizontal: 4,
  },
  activeTab: {
    borderColor: '#ffa300',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#ffa300',
  },
  addAnnouncementContainer: {
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#602bf9',
    borderWidth: 0.5,
    borderRadius: 20,
    paddingVertical: 5,
    margin: 10,
    width: '48%',
  },
  addAnnouncementText: {
    fontSize: 15,
    color: "#602bf9",
  },
  addIcon: {
    width: 20,
    height: 20,
    marginHorizontal: 7,
    tintColor: "#602bf9",
  },
  list: {
    padding: 10,
    backgroundColor: 'white',
  },
  card: {
    marginVertical: 5,
    padding: 10,
    paddingLeft: 15,
    backgroundColor: 'white',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dateContainer: {
    width: 80,
    justifyContent: 'center',
  },
  absoluteDate: {
    fontSize: 14,
    color: '#666',
    paddingVertical: 2,
  },
  relativeTime: {
    fontSize: 12,
    color: '#999',
  },
  messageContainer: {
    flex: 1,
    paddingLeft: 10,
  },
  rowText: {
    fontSize: 16,
    marginBottom: 4,
  },
  creatorName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  message: {
    fontSize: 14,
    color: '#333',
  },
  rightActionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 5,
  },
  actionButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 65,
    borderRadius: 10,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  editButton: {
    backgroundColor: '#FFB22C',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  actionText: {
    color: 'white',
    fontWeight: '400',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    fontStyle: "italic",
  },
});

export default AnnouncementsScreen;
