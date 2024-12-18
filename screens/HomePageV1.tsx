import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const HomePageV1 = ({ navigation }: { navigation: any }) => {
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"white"} barStyle={'dark-content'}></StatusBar>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <Image tintColor={"black"} style={styles.image} source={require('../assets/logout.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <Image tintColor={"black"} style={styles.image} source={require('../assets/refresh.png')} />
                </TouchableOpacity>
            </View>

            <View style={styles.bodyContainer}>
                <Text style={styles.headerText}>Hi Biswarup Dutta,</Text>
                <Text style={styles.subHeader}>Create or join an organization to put in your best hours at work.</Text>

            </View>
            <View style={{height:100}}/>
            <View style={styles.imageContainer}>
                <Image
                    tintColor={"#979798"}
                    style={styles.centeredImage}
                    source={require('../assets/body.png')}
                />
                <Text style={styles.bodyHeader}>You are not part of any organizations</Text>
                <Text style={styles.bodySubText}>Ask your manager to send you an invite or create your own organization in IECS's TMS.</Text>
            </View>

            <View style={[ {backgroundColor: "white", width: "100%", paddingBottom: 20, paddingTop: 10},{position:'absolute',bottom:0} ]}>
                                <Text style={{ fontSize: 14, color: "#686D76", textAlign: "center", fontWeight:"bold" }}>Want to manage your team's time tracking?</Text>
                                <View style={{ height: 5, }} />
                                <Text onPress={() => { navigation.navigate('CreateOrganizationPage') }} style={{ fontSize: 15, color: "#602bf9", fontWeight: "bold", textAlign: "center" }}>Create a new organization</Text>
                            </View>




        </SafeAreaView>
    )
}

export default HomePageV1

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#F7F8Fc",
        flex: 1,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "white",
        padding: 15,
        elevation: 1,
    },
    image: {
        height: 22,
        width: 22,
    },

    bodyContainer: {
        padding: 20,
    },
    headerText: {
        fontSize: 26,
        fontWeight: "bold",
    },
    subHeader: {
        fontSize: 15,
        paddingRight: 40,
        paddingTop: 5,
    },
    imageContainer: {
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
    },
    centeredImage: {
        height: 200,
        width: 200,
    },
    bodyHeader:{
        fontSize:16,
        fontWeight:"bold",
        color:"#979798"
    },
    bodySubText:{
        fontSize:14,
        margin:5,
        color:"#979798",
        textAlign:"center",
    }

})