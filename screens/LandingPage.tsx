import { Image, NativeScrollEvent, NativeSyntheticEvent, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import ButtonCustom from '../components/Button';

const LandingPage = ({navigation}:{navigation:any}) => {
  const [activeDot, setActiveDot] = useState(0);


  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const activeIndex = Math.floor(contentOffsetX / 340);  
    setActiveDot(activeIndex);
  };

  const data = [
    {
      image: require('../assets/employees2.png'),
      label: 'Make Time Count',
      sublabel: 'Manage your workforce the right way',
    },
    {
      image: require('../assets/employees1.png'),
      label: 'Boost Productivity',
      sublabel: "Optimize your team's efficiency",
    },
    {
      image: require('../assets/employees3.png'),
      label: 'Streamline Operations',
      sublabel: 'Make your workflows more efficient',
    },
  ];

  return (
    
    <View style={styles.container}>

      <View style={{ height: 100, }} /> 
      <StatusBar backgroundColor={"white"} barStyle={'dark-content'} ></StatusBar>

      <ScrollView
        horizontal
        pagingEnabled
        onScroll={handleScroll}
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
      >
        {data.map((item, index) => (
          <View key={index} style={styles.carouselItem}>
            <Image style={styles.image} source={item.image} />
            <View style={{height:10}}></View>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.sublabel}>{item.sublabel}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={{ height: 100, }} />

      <View style={styles.dotsContainer}>
        {[...Array(3)].map((_, index) => (
          
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: activeDot === index ? '#602bf9' : '#D3D3D3' },
            ]}
          />
          
        ))}
      </View>
      <View style={{ height: 30, }} />
      <ButtonCustom text='Login to Start Tracking' onPress={()=>{navigation.navigate('LoginPage')}}/>
      
      <View style={{ height: 27, }} />
      <View style={{backgroundColor:"#f6f6f9",width:"100%",paddingBottom:50,paddingTop:10}}>
      <Text style={{fontSize:14,color:"#686D76",textAlign:"center"}}>Don't have an account?</Text>
      <View style={{ height: 5, }} />
      <Text onPress={()=>{navigation.navigate('SignUpPage')}} style={{fontSize:15,color:"#602bf9",fontWeight:"bold",textAlign:"center"}}>Sign Up</Text>
      </View>

    </View>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-start', 
    backgroundColor: '#fff',
  },
  carouselItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 395, 
    padding: 20, 
  },

  scrollContainer: {
    flexDirection: 'row',
    width: '100%', 
 },
  image: {
    height: 290,
    width: 395,  
    resizeMode:"center"
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20, 
    textAlign: 'center', 
  },
  sublabel: {
    fontSize: 14,
    color: '#686D76',
    marginTop: 5,
    textAlign: 'center', 
  },
  dotsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 20, 
  },
  loginButton:{
    paddingHorizontal:80,
    paddingVertical:15,
    backgroundColor:"#602bf9",
    borderRadius:8,
    width:"90%",

  },
  btnText:{
    color:"white",
    fontWeight:"bold",
    textAlign:"center",
  }
});
