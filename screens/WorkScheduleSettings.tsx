import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

const WorkScheduleSettings = ({ navigation }: { navigation: any }) => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image
                        source={require('../assets/back-arrow.png')}
                        style={styles.backIcon}
                    />
                </TouchableOpacity>

                <Text style={styles.headerText}>Work Schedule Settings</Text>

                <TouchableOpacity onPress={() => {navigation.navigate('CreateWorkSchedule')}} style={styles.plusButton}>
                    <Image
                        source={require('../assets/add-icon.png')}
                        style={styles.plusIcon}
                    />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default WorkScheduleSettings;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#F7F8Fc',
        flex: 1,
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
