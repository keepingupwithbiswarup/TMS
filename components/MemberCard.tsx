import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MemberCardProps {
    name: string;
    department: string;
    role: string;
    onPress: () => void;
}

const MemberCard: React.FC<MemberCardProps> = ({ name, department, role, onPress }) => {
    return (
        <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
            <View style={styles.profilePicContainer}>
                <Text style={styles.profilePicText}>{name[0]}</Text>
            </View>
            <View style={styles.memberInfoContainer}>
                <Text style={styles.memberName}>{name}</Text>
                <Text style={styles.memberSublabel}>Department: {department}</Text>
                <Text style={styles.memberSublabel}>Role: {role}</Text>
            </View>
            <Image
                source={require('../assets/arrow-icon.png')}
                style={styles.cardArrowIcon}
            />
        </TouchableOpacity>
    );
};

export default MemberCard;

const styles = StyleSheet.create({
    cardContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 15,
        elevation: 1,
        marginBottom: 1,
    },
    profilePicContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    profilePicText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    memberInfoContainer: {
        flex: 1,
    },
    memberName: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#000000',
    },
    memberSublabel: {
        fontSize: 12,
        color: '#707070',
        marginTop: 2,
    },
    cardArrowIcon: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
});
