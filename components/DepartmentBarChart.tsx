import React from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions } from "react-native";
import Svg, { Rect, Text as SVGText } from "react-native-svg";

interface DepartmentPopulation {
  Department: string;
  Population: number;
}

interface Props {
  deptPopulation: DepartmentPopulation[];
}

const HorizontalBarChart: React.FC<Props> = ({ deptPopulation }) => {
  const screenWidth = Dimensions.get("window").width;
  const barHeight = 14;
  const chartHeight = deptPopulation.length * (barHeight + 20);

  const maxPopulation = Math.max(...deptPopulation.map((item) => item.Population));

  return (
    <ScrollView horizontal>
      <View style={styles.chartContainer}>
        <Svg width={screenWidth} height={chartHeight}>
          {deptPopulation.map((item, index) => {
            const barWidth = (item.Population / maxPopulation)*10;

            return (
              <React.Fragment key={index}>
            
                <SVGText
                  x={0}
                  y={index * (barHeight + 10) + barHeight / 1.5}
                  fontSize={10}
  
                >
                  {item.Department==null? "Not assigned to any Department":item.Department}
                </SVGText>

                
                <Rect
                  x={200} 
                  y={index * (barHeight + 10)}
                  width={barWidth}
                  height={barHeight}
                  fill="#008040"
                />

                <SVGText
                  x={200 + barWidth + 5} 
                  y={index * (barHeight + 10) + barHeight /1.3}
                  fontSize={10}
                  
        
                >
                  {item.Population}
                </SVGText>
              </React.Fragment>
            );
          })}
        </Svg>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: "white",
    borderRadius: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
    color: "#333",
  },
});

export default HorizontalBarChart;
