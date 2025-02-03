import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import moment from 'moment';


interface TimesheetItem {
  Date: string;
  TimesheetCount: number;
}

interface ChartProps {
  data1: TimesheetItem[]; 
  data2: TimesheetItem[]; 
}

const ChartComponent: React.FC<ChartProps> = ({ data1, data2 }) => {

  const getValueForDate = (dateStr: string, data: TimesheetItem[]): number => {
    const record = data.find(item => moment(item.Date).format('YYYY-MM-DD') === dateStr);
    return record ? record.TimesheetCount : 0;
  };
  const last7Dates = Array.from({ length: 7 }, (_, i) =>
    moment().subtract(6 - i, 'days').format('YYYY-MM-DD')
  );

  const xAxisLabels = last7Dates.map(dateStr => moment(dateStr).format('MMM DD'));

  const formattedData1 = last7Dates.map(dateStr => ({
    value: getValueForDate(dateStr, data1),
  }));
  const formattedData2 = last7Dates.map(dateStr => ({
    value: getValueForDate(dateStr, data2),
  }));

  const maxValue = Math.max(
    ...formattedData1.map(item => item.value),
    ...formattedData2.map(item => item.value)
  );

  return (
    <View style={styles.container}>
      <LineChart
        areaChart
        curved
        data={formattedData1}
        data2={formattedData2}
        hideDataPoints
        spacing={42}
        color1="transparent"
        color2="transparent"
        startFillColor1="#8a56ce"
        startFillColor2="#56acce"
        endFillColor1="#8a56ce"
        endFillColor2="#56acce"
        startOpacity={0.9}
        endOpacity={0.2}
        initialSpacing={20}
        noOfSections={5}
        yAxisColor="gray"
        yAxisThickness={0.5}
        rulesType="solid"
        rulesColor="gray"
        yAxisTextStyle={{ color: 'gray' , fontSize: 10}}
        yAxisLabelSuffix=""
        maxValue={maxValue+1}
        rulesLength={280}
        
        xAxisColor="lightgray"
        xAxisLength={280}
        xAxisLabelTexts={xAxisLabels}
        xAxisLabelTextStyle={{ color: 'gray' , fontSize: 10}}
        // pointerConfig={{
        //   pointerStripUptoDataPoint: true,
        //   pointerStripColor: 'lightgray',
        //   pointerStripWidth: 0,
        //   strokeDashArray: [2, 5],
        //   pointerColor: 'lightgray',
        //   radius: 4,
        //   pointerLabelWidth: 100,
        //   pointerLabelHeight: 100,
        //   pointerLabelComponent: (items: Array<{ value: number }>) => {
        //     return (
        //       <View style={styles.pointerLabel}>
        //         <Text style={styles.pointerText}>User A: {items[0].value}</Text>
        //         <Text style={[styles.pointerText, { marginTop: 5 }]}>
        //           User B: {items[1].value}
        //         </Text>
        //       </View>
        //     );
        //   },
        // }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    backgroundColor: 'white',
  },
  pointerLabel: {
    height: 100,
    width: 100,
    backgroundColor: '#282C3E',
    borderRadius: 4,
    justifyContent: 'center',
    paddingLeft: 16,
  },
  pointerText: {
    color: 'lightgray',
    fontSize: 12,
  },
});

export default ChartComponent;
