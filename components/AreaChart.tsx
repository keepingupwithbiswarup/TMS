import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

interface LineChartProps {
  data1: { value: number }[];
  data2: { value: number }[];
}

const AreaChartGifted: React.FC<LineChartProps> = ({ data1, data2 }) => {
  return (
    <View style={styles.container}>
      <LineChart
        areaChart
        curved
        data={data1}
        data2={data2}
        hideDataPoints
        spacing={68}
        color1="#8a56ce"
        color2="#56acce"
        startFillColor1="#8a56ce"
        startFillColor2="#56acce"
        endFillColor1="#8a56ce"
        endFillColor2="#56acce"
        startOpacity={0.9}
        endOpacity={0.2}
        initialSpacing={0}
        noOfSections={4}
        yAxisColor="white"
        yAxisThickness={0}
        rulesType="solid"
        rulesColor="gray"
        yAxisTextStyle={{ color: 'gray' }}
        yAxisLabelSuffix="%"
        xAxisColor="lightgray"
        pointerConfig={{
          pointerStripUptoDataPoint: true,
          pointerStripColor: 'lightgray',
          pointerStripWidth: 2,
          strokeDashArray: [2, 5],
          pointerColor: 'lightgray',
          radius: 4,
          pointerLabelWidth: 100,
          pointerLabelHeight: 120,
          pointerLabelComponent: (items: Array<{ value: number }>) => {
            return (
              <View style={styles.pointerLabel}>
                <Text style={styles.pointerText}>{2018}</Text>
                <Text style={styles.pointerValue}>{items[0].value}</Text>
                <Text style={styles.pointerText}>{2019}</Text>
                <Text style={styles.pointerValue}>{items[1].value}</Text>
              </View>
            );
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 100,
    paddingLeft: 20,
    backgroundColor: '#1C1C1C',
  },
  pointerLabel: {
    height: 120,
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
  pointerValue: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AreaChartGifted;
