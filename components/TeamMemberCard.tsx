import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type TeamMemberCardProps = {
  name: string;
  email: string;
  role: string;
  status: 'Enabled' | 'Disabled';
  lastLogin: string;
  onLongPress: () => void;
  onPress: () => void;
  isSelection: boolean;
};

const getRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  
  for (let i = 0; i < 3; i++) {
    let hexValue = Math.floor(Math.random() * 128).toString(16);
    if (hexValue.length === 1) {
      hexValue = '0' + hexValue; 
    }
    color += hexValue;
  }

  return color;
};


const TeamMemberCard: React.FC<TeamMemberCardProps> = ({
  name,
  email,
  role,
  status,
  lastLogin,
  onLongPress,
  onPress,
  isSelection,
}) => {
  const avatarColor = getRandomColor();

  return (
    <TouchableOpacity
      style={[styles.card, isSelection ? { backgroundColor: '#e0f7fa' } : {}]}
      onLongPress={onLongPress} onPress={onPress}
    >




      <View style={styles.info}>
        <View style={styles.topRow}>
          <View style={styles.toprightcontainer}>
            <View style={[styles.avatar, { backgroundColor: avatarColor }]}>
              <Text style={styles.avatarText}>{name.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{name}</Text>
              <Text style={styles.email}>{email}</Text>
            </View>

          </View>

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBadge,
                status === 'Enabled' ? styles.enabledBadge : styles.disabledBadge,
              ]}
            >
              <Text
                style={[
                  styles.disabledText,
                  status === 'Enabled' ? styles.enabledText : styles.disabledText,
                ]}
              >
                Active
              </Text>
            </View>
          </View>

        </View>

        <View style={{ borderBottomWidth: 0.2, borderBottomColor: "#D8D8D8", padding: 5, }} />

        <View style={styles.bottomRow}>
          <View style={styles.headingContainer}>
            <Text style={styles.role}>Role</Text>
            <Text style={styles.lastLogin}>{role}</Text>

          </View>

          <View style={styles.valueContainer}>
            <Text style={styles.role}>Last Login</Text>

            <Text style={styles.lastLogin}>{lastLogin}</Text>
          </View>
        </View>


      </View>




    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    height: 130,
    elevation: 2,
    marginHorizontal: 20,
    marginBottom:10,
  },
  avatar: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  toprightcontainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingTop: 15,
  },
  name: {
    fontSize: 17,
    marginLeft: 10,
  },
  email: {
    fontSize: 12,
    color: '#929AAB',
    marginTop: 4,
    marginLeft: 10,
    fontStyle:"italic",

  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal:20,
  },
  headingContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  valueContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  role: {
    fontSize: 14,
    color: '#888',
    fontWeight: '600',
    paddingVertical: 5,
  },
  lastLogin: {
    fontSize: 12,
    color: '#aaa',
  },
  statusContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  enabledBadge: {
    backgroundColor: '#ecfdf5',
  },
  disabledBadge: {
    backgroundColor: '#fef2f2',
  },
  enabledText: {
    color: '#22c55e',
    fontWeight: '600',
  },
  disabledText: {
    color: '#ef4444',
    fontWeight: '600',
  },
});

export default TeamMemberCard;
