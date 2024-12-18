import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MenuCard from '../components/MenuCard';

const Menu = ({navigation}:{navigation:any}) => {
  return (
    
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Menu</Text>
      </View>
      <ScrollView>

        <View style={{ padding: 15,paddingBottom:17  }}>
          <Text style={styles.labelText}>Organization</Text>
        </View>
        <TouchableOpacity>
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.circle}>
              <Text style={styles.circleText}>M</Text>
            </View>
            <Text style={styles.cardText}>Mendine</Text>
            <Image
              source={require('../assets/arrow-icon.png')}
              style={styles.arrowIcon}
            />
          </View>
        </View>
        </TouchableOpacity>

        <View style={{ height: 15 }} />

        <MenuCard
          text="Time off"
          imageSource={require('../assets/time-off.png')}
          onRightArrowPress={() => { }}
        />


        <MenuCard
          text="Reports"
          imageSource={require('../assets/report-icon.png')}
          onRightArrowPress={() => { }}
        />

        <View style={{ padding: 15 ,paddingBottom:17 }}>
          <Text style={styles.labelText}>Settings</Text>
        </View>

        <MenuCard
          text="People"
          imageSource={require('../assets/people-icon.png')}
          onRightArrowPress={() => { }}
        />
        <MenuCard
          text="Work Schedules"
          imageSource={require('../assets/work-schedule.png')}
          onRightArrowPress={() => { }}
        />
        <MenuCard
          text="Projects"
          imageSource={require('../assets/project-icon.png')}
          onRightArrowPress={() => { }}
        />

        <View style={{ padding: 15 }}>
          <Text style={styles.labelText}>Account</Text>
        </View>

        <MenuCard
          text="Personal Settings"
          imageSource={require('../assets/personal-settings.png')}
          onRightArrowPress={() => {navigation.navigate('PersonalSettings')}}
        />

        <View style={{ padding: 15,paddingBottom:17 }}>
          <Text style={styles.labelText}>Help</Text>
        </View>

        <MenuCard
          text="Support"
          imageSource={require('../assets/support.png')}
          onRightArrowPress={() => { }}
        />

<View style={{ height: 25 }}/>
         

      </ScrollView>
    </SafeAreaView>
  );
};

export default Menu;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F8Fc',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 35,
    elevation:1,
  },
  headerText: {
    position: 'absolute',
    top: 26,
    right: 35,
    textAlign: 'center',
    fontSize: 16,
    width: '100%',
    alignSelf: 'center',
    fontWeight: 'bold',
  },
  labelText: {
    fontWeight: 'bold',
  },
  card: {
    elevation: 1,
    width: '100%',
    height: 80,
    backgroundColor: 'white',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingRight:12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#602bf9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardText: {
    fontSize: 15,
    fontWeight: 'bold',
    flex: 1,
    marginHorizontal: 15,
  },
  arrowIcon: {
    width: 18,
    height: 18,
    tintColor:"#aaa"
  },
});
