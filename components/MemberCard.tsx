import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface MemberCardProps {
    name: string;
    department: string;
    role: string;
    onPress: () => void;
    onLongPress: () => void;
    isSelected: boolean;
}

const MemberCard: React.FC<MemberCardProps> = ({ name, department, role, onPress, onLongPress,isSelected }) => {
    return (
        <TouchableOpacity style={[
            styles.cardContainer,
            isSelected && { borderColor:'#4a6fe9',borderWidth:1, backgroundColor: "#dbe4ff" }, 
          ]} onPress={onPress} onLongPress={onLongPress}>
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
        marginBottom: 1,
    },
    profilePicContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#35374B',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    profilePicText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    memberInfoContainer: {
        flex: 1,
    },
    memberName: {
        fontSize: 13,
        fontWeight: 'bold',
        color: '#000000',
    },
    memberSublabel: {
        fontSize: 10,
        color: '#707070',
        marginTop: 2,
    },
    cardArrowIcon: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
});
