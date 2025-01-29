import moment from "moment";
import React from "react";
import { View, Dimensions, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";

// Define types for the props
interface ChartWithDonutProps {
  data: {
    DeptName: string;
    ProjectCount: number;
  }[];
}

// Chart Component
const ChartWithDonut: React.FC<ChartWithDonutProps> = ({ data }) => {
  // Extract labels and values for the pie chart
  const chartData = data.map((dept, index) => ({
    value: dept.ProjectCount,
    label: dept.DeptName.trim(),
    color: colorPalette[index % colorPalette.length], // Ensures unique color assignment
  }));
  



  return (
    <View style={styles.container}>
      <Text style={styles.chartTitle}>Project Allocatation Tracking</Text>
      <Text style={styles.chartDate}>Projects assigned to each department by count</Text>

      <PieChart
        data={chartData}
        // width={chartWidth}
        // height={250}
        donut // Makes the pie chart into a donut
        innerRadius={80} // Radius of the hole in the center of the donut
        radius={120} // Outer radius of the donut
        textColor="#fff" // Color of the text inside the pie chart
        centerLabelComponent={() => (
            <View>
                <Text style={{ fontSize: 14, color: "black",textAlign:"center",marginBottom:5 }}>Total Projects</Text>
                <Text style={{ fontSize: 24, color: "black",textAlign:"center" }}>
                    {chartData.reduce((sum, item) => sum + item.value, 0)}
                </Text>
            </View>
        )}
      />

<View style={styles.legendContainer}>
  {chartData.map((item, index) => (
    <View key={index} style={styles.legendItem}>
      <View style={[styles.legendColor, { backgroundColor: item.color }]} />
      <Text style={styles.legendText}>
        {item.label}: <Text style={[styles.legendValue,{color:item.color}]}>{item.value}</Text>
      </Text>
    </View>
  ))}
</View>

    </View>
  );
};

// Function to generate random colors
const colorPalette = [
    "#FF6B6B", // Soft Red
    "#FF9F43", // Orange
    "#FFC312", // Yellow
    "#4CAF50", // Green
    "#45AAF2", // Light Blue
    "#2D98DA", // Blue
    "#9B59B6", // Purple
    "#D980FA", // Light Purple
    "#F368E0", // Pink
    "#3D3D3D", // Dark Gray
  ];
  
  const getRandomColor = () => {
    return colorPalette[Math.floor(Math.random() * colorPalette.length)];
  };
  

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    justifyContent:"center",
    alignContent:"center",
    alignItems:"center",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  chartDate: {
    fontSize: 14,
    color: "#888",
    marginBottom: 16,
  },
  legendContainer: {
    marginTop: 20,
    flexDirection: "column", // Stacked layout
    alignItems: "flex-start", // Align items to the left
    backgroundColor: "white", // Light background for contrast
    padding: 10,
    borderRadius: 10,
   
    width: "100%", // Full width
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "white", // White box for contrast
    marginBottom: 6,
    width: "100%",
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  legendValue: {
    fontSize: 14,
    fontWeight: "thin",

  },
});

export default ChartWithDonut;
