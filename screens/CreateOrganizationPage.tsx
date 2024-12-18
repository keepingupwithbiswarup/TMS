import { Image, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import DropDownPicker from 'react-native-dropdown-picker';

const CreateOrganizationPage = ({ navigation }: { navigation: any }) => {
    const [organizationName, setOrganizationName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [industry, setIndustry] = useState(null);
    const [open, setOpen] = useState(false); 
    const [organizationSize, setOrganizationSize] = useState('');

    const isFormValid = () => {
        return organizationName !== '' && phoneNumber!=='' && industry!==null && organizationSize!=='';
    };

    const handleOrganizationSizeSelect = (size: string) => {  
        setOrganizationSize(size); 
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar backgroundColor={"white"} barStyle={'dark-content'}></StatusBar>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.goBack()} >
                    <Image tintColor={"black"} style={styles.image} source={require('../assets/back-arrow.png')} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{navigation.navigate('ChooseGoalPage')}}
                    style={[styles.nextButton, { backgroundColor: isFormValid() ? '#602bf9' : '#d3d3d3' }]}
                    disabled={!isFormValid()}
                >
                    <Text style={styles.btnText}>Next</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: 20 }} />
            <View>
                <Text style={styles.headerText}>Let's start your organization on the right track</Text>
                <Text style={styles.subText}>Help us create the best experience for you.</Text>
            </View>
            <View style={{ height: 15 }} />
            <View style={{ marginHorizontal: 7 }}>
                <TextInput
                    style={styles.input}
                    placeholder="Your organization name"
                    value={organizationName}
                    onChangeText={setOrganizationName}
                />
            </View>

            <View style={styles.phoneInputContainer}>
                <Text style={styles.countryCode}>+91</Text>
                <TextInput
                    style={styles.phoneInput}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phoneNumber}
                    onChangeText={setPhoneNumber}
                />
            </View>


            <View style={{ marginHorizontal: 7, marginTop: 15 }}>
                <View>
                    <DropDownPicker
                        open={open}
                        value={industry}
                        items={[
                            { label: 'Technology', value: 'Technology' },
                            { label: 'Healthcare', value: 'Healthcare' },
                            { label: 'Finance', value: 'Finance' },
                            { label: 'Education', value: 'Education' },
                            { label: 'Retail', value: 'Retail' },
                        ]}
                        setOpen={setOpen}
                        setValue={setIndustry}
                        placeholder="Select Industry"
                        style={styles.input}
                        arrowIconStyle={styles.arrowIconStyle}
                        placeholderStyle={styles.placeholderStyle}
                        dropDownContainerStyle={styles.dropDownContainer}
                        listItemLabelStyle={{ color: "grey" }}

                    />
                </View>

                <View style={styles.organizationSizeContainer}>
                <Text style={styles.label}>Organization size</Text>
                <View style={styles.sizeButtonsContainer}>
                    {['1-10', '11-20', '21-50', '51-100', '100+'].map((size) => (
                        <TouchableOpacity
                            key={size}
                            style={[
                                styles.sizeButton,
                                organizationSize === size && styles.selectedSizeButton,
                            ]}
                            onPress={() => handleOrganizationSizeSelect(size)}
                        >
                            <Text
                                style={[
                                    styles.sizeButtonText,
                                    organizationSize === size && styles.selectedSizeButtonText,
                                ]}
                            >
                                {size}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>


            </View>
            </View>

        </SafeAreaView>
    )
}

export default CreateOrganizationPage

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flex: 1,
        padding: 15,
    },
    image: {
        height: 25,
        width: 25,
    },
    nextButton: {
        paddingVertical: 12,
        borderRadius: 8,
        width: "20%",
    },
    btnText: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: 16,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    headerText: {
        fontSize: 25,
        fontWeight: "bold",
        paddingHorizontal: 8,
    },
    subText: {
        fontSize: 14,
        fontWeight: "thin",
        paddingHorizontal: 8,
        paddingVertical: 5,
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "white",
        borderRadius: 10,
        paddingLeft: 15,
        fontSize: 15,
        color: "#000",
        borderWidth: 1,
        borderColor: "#dcdcdc",
        fontWeight: "bold",
    },
    phoneInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 7,
        marginTop: 15,
        borderWidth: 1,
        borderColor: "#dcdcdc",
        borderRadius: 10,
        backgroundColor: "white",
        paddingLeft: 10,
    },
    countryCode: {
        fontSize: 16,
        fontWeight: "bold",
        color: "grey",
        marginRight: 8,
        marginLeft: 2,
    },
    phoneInput: {
        flex: 1,
        height: 50,
        fontSize: 15,
        color: "#000",
        fontWeight: "bold",
        paddingLeft: 5,
    },
    dropDownStyle: {
        backgroundColor: "#f0f0f0",
        borderRadius: 10,
        marginTop: 8,
        borderWidth: 0,
    },
    arrowIconStyle: {
        width: 20,
        height: 20,
    },
    placeholderStyle: {
        color: 'grey',
        fontSize: 15,
    },
    dropDownContainer: {
        backgroundColor: "white",
        borderRadius: 10,
        borderColor: "#dcdcdc",

    },
    organizationSizeContainer: {
        marginTop: 20,
    },

    label: {
        fontSize: 15,
        fontWeight: 'bold',
        marginBottom: 12,
        paddingLeft:3,
        color:"grey",
    },
    sizeButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingVertical:5,
    },
    sizeButton: {
        paddingVertical: 20,
        paddingHorizontal: 19,
        backgroundColor: '#F7F8Fc',
        borderWidth: 1,
        borderColor: '#dcdcdc',
    },
    selectedSizeButton: {
        backgroundColor: '#E5D9F2',
        borderColor:"#602bf9"
    },
    sizeButtonText: {
        fontSize: 14,
        color: '#000',
    },
    selectedSizeButtonText: {
        color: '000',
    },


})
