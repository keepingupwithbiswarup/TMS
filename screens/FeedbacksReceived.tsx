import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IpRoute from '../utilities/iproute';

interface Feedback {
  FeedbackId: number;
  ReviewerId: number;
  EmployeeId: number;
  FeedbackText: string;
  Rating: number;
  CreatedOn: string;
  ModifiedOn: string;
  Response: string;
  Username: string;
  Reviewer: string;
}

const FeedbacksReceived = ({ navigation }: { navigation: any }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedCardId, setExpandedCardId] = useState<number | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchFeedbacks();
    }
  }, [currentUser]);

  const getCurrentUser = async () => {
    try {
      const userString = await AsyncStorage.getItem('currentUser');
      if (userString) {
        const user = JSON.parse(userString);
        setCurrentUser(user);
      }
    } catch (error) {
      console.error('Error reading user from AsyncStorage:', error);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://${IpRoute}/api/getfeedbacks`);
      let data: Feedback[] = await response.json();

      if (currentUser && currentUser.EmployeeId) {
        data = data.filter(
          (feedback) => feedback.EmployeeId === currentUser.EmployeeId
        );
      }
      setFeedbacks(data);

      if (data.length > 0) {
        setExpandedCardId(data[0].FeedbackId);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (feedbackId: number) => {
    try {
      const response = await fetch(
        `http://${IpRoute}/api/deletefeedback/${feedbackId}`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        Alert.alert('Success', 'Feedback deleted successfully');
        setFeedbacks((prev) => prev.filter((fb) => fb.FeedbackId !== feedbackId));
      } else {
        Alert.alert('Error', 'Feedback not found or could not be deleted');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
      Alert.alert('Error', 'An error occurred while deleting feedback');
    }
  };

  const handleThanks = async (feedbackId: number) => {
    try {
      const response = await fetch(`http://${IpRoute}/api/updateresponse`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          FeedbackId: feedbackId,
          Response: 'Helpful',
        }),
      });
      if (response.ok) {
        Alert.alert('Success', 'Response updated successfully');
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((fb) =>
            fb.FeedbackId === feedbackId ? { ...fb, Response: 'Thanks' } : fb
          )
        );
      } else {
        Alert.alert('Error', 'Failed to update response');
      }
    } catch (error) {
      console.error('Error updating feedback response:', error);
      Alert.alert('Error', 'An error occurred while updating response');
    }
  };

  const renderStars = (rating: number) => {
    return (
      <View style={styles.starRow}>
        {Array.from({ length: 5 }).map((_, index) => {
          const tintColor = index < rating ? '#FFCC00' : '#E0E0E0';
          return (
            <Image
              key={index}
              source={require('../assets/star.png')}
              style={[styles.starIcon, { tintColor }]}
            />
          );
        })}
      </View>
    );
  };

  const totalReviews = feedbacks.length;
  const totalRatingSum = feedbacks.reduce((acc, fb) => acc + fb.Rating, 0);
  const averageRating =
    totalReviews > 0 ? (totalRatingSum / totalReviews).toFixed(1) : '0.0';

  const distribution = [0, 0, 0, 0, 0];
  feedbacks.forEach(({ Rating }) => {
    distribution[Rating - 1] += 1;
  });

  const renderStarsRow = (starCount: number) => {
    return (
      <View style={{ flexDirection: 'row', marginRight: 8 }}>
        {Array.from({ length: starCount }).map((_, i) => (
          <Image
            key={i}
            source={require('../assets/star.png')}
            style={styles.breakdownStarIcon}
          />
        ))}
      </View>
    );
  };

  const renderDistributionRow = (star: number) => {
    const count = distribution[star - 1];
    const percentage =
      totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;

    return (
      <View style={styles.breakdownRow} key={star}>
        {renderStarsRow(star)}

        <View style={styles.breakdownBarBackground}>
          <View
            style={[
              styles.breakdownBarFill,
              { width: `${percentage}%` },
            ]}
          />
        </View>

        <Text style={styles.breakdownCount}>{count}</Text>
      </View>
    );
  };

  const renderFeedback = ({ item }: { item: Feedback }) => {
    const isExpanded = item.FeedbackId === expandedCardId;
    const cardStyle =
      [styles.card, styles.cardCollapsed];

    return (
      <TouchableOpacity
        activeOpacity={0.95}
        onPress={() => setExpandedCardId(item.FeedbackId)}
        style={cardStyle}
      >
        <View style={styles.reviewHeaderRow}>
          <Text style={styles.reviewerName}>{item.Reviewer}</Text>
          <Text style={styles.reviewDate}>
            {new Date(item.CreatedOn).toLocaleDateString()}
          </Text>
        </View>

        {renderStars(item.Rating)}

        <Text style={styles.feedbackText}>{item.FeedbackText}</Text>

        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate('EditFeedback', { feedbackId: item.FeedbackId })
            }
          >
            <Image
              source={require('../assets/pencil-icon.png')}
              style={styles.actionIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleDelete(item.FeedbackId)}
          >
            <Image
              source={require('../assets/delete-icon.png')}
              style={styles.actionIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={
              item.Response ? styles.thanksButtonFilled : styles.thanksButtonUnfilled
            }
            onPress={() => {
              if (!item.Response) {
                handleThanks(item.FeedbackId);
              }
            }}
          >

            <Text
              style={item.Response ? styles.thanksTextFilled : styles.thanksTextUnfilled}
            >
              Helpful
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Image
          source={require('../assets/back2.png')}
          style={styles.backIcon}
        />
      </TouchableOpacity>
      <Text style={styles.heading}>Rating & Reviews</Text>

      <View style={styles.ratingDistributionRow}>
        <View style={styles.leftRatingContainer}>
          <Text style={styles.bigRating}>{averageRating}</Text>
          <Text style={styles.totalRatingsText}>{totalReviews} ratings</Text>
        </View>

        <View style={styles.rightDistributionContainer}>
          {[5, 4, 3, 2, 1].map((star) => renderDistributionRow(star))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007BFF" style={{ marginTop: 20 }} />
      ) : (
        <>
          <View style={styles.reviewsHeader}>
            <Text style={styles.reviewsHeaderText}>{totalReviews} reviews</Text>
          </View>

          <FlatList
            data={feedbacks}
            keyExtractor={(item) => item.FeedbackId.toString()}
            renderItem={renderFeedback}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        </>
      )}
    </View>
  );
};

export default FeedbacksReceived;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',

    paddingTop: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: '900',
    paddingTop: 15,
    paddingBottom: 25,
    paddingHorizontal: 16
  },

  ratingDistributionRow: {
    flexDirection: 'row',
    marginBottom: 16,
    marginHorizontal: 16,
  },

  leftRatingContainer: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bigRating: {
    fontSize: 48,
    fontWeight: '700',
    color: '#FFCC00',
  },
  backButton: {
    marginVertical: 5,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
    marginLeft: 16,
  },
  totalRatingsText: {
    fontSize: 14,
    color: '#777',
    marginTop: 4,
  },

  rightDistributionContainer: {
    width: '70%',
    justifyContent: 'center',
    paddingLeft: 12,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
  },
  breakdownStarIcon: {
    width: 16,
    height: 16,
    resizeMode: 'contain',
    tintColor: '#FFCC00',
  },
  breakdownBarBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginRight: 8,
    marginLeft: 4,
  },
  breakdownBarFill: {
    height: 8,
    backgroundColor: '#FF0000', // red fill
    borderRadius: 4,
  },
  breakdownCount: {
    width: 24,
    textAlign: 'right',
    color: '#333',
    fontSize: 12,
  },

  reviewsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginHorizontal: 16
  },
  reviewsHeaderText: {
    fontSize: 19,
    fontWeight: '600',
    color: '#333',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 12,
  },

  cardCollapsed: {
    padding: 12,
    elevation: 3,
  },
  reviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  reviewDate: {
    fontSize: 14,
    color: '#999',
  },

  starRow: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  starIcon: {
    width: 20,
    height: 20,
    marginRight: 2,
    resizeMode: 'contain',
  },

  feedbackText: {
    fontSize: 14,
    color: '#444',
    marginVertical: 8,
    lineHeight: 20,
  },

  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  actionButton: {
    marginLeft: 10,
  },
  actionIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  thanksButtonUnfilled: {
    marginLeft: 10,
    borderWidth: 1,
    borderColor: '#28a745',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  thanksTextUnfilled: {
    color: '#28a745',
    fontSize: 14,
  },
  thanksButtonFilled: {
    marginLeft: 10,
    backgroundColor: '#28a745',
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  thanksTextFilled: {
    color: '#fff',
    fontSize: 14,
  },
});
