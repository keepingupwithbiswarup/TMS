import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-gifted-charts";

// Define the types for the props
interface Project {
  ProjectName: string;
  Status: string;
}

interface ChartWithDonutProps {
  projects: Project[];
}

// Status Color Mapping
const colorPalette = [
  "#009FFF", // Blue
//   "#93FCF8", // Cyan
//   "#BDB2FA", // Purple
//   "#FFA5BA", // Pink
  "#FF9F43", // Orange
  "#FFC312", // Yellow
  "#4CAF50", // Green
];

const getColor = (index: number) => colorPalette[index % colorPalette.length];

const PieChartGifted: React.FC<ChartWithDonutProps> = ({ projects }) => {

  const statusCounts = projects.reduce((acc, project) => {
    acc[project.Status] = (acc[project.Status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.keys(statusCounts).map((status, index) => ({
    value: statusCounts[status],
    color: getColor(index),
    gradientCenterColor: getColor(index), 
    label: status,
    focused: status === "Finished",
  }));
  

  const renderDot = (color: string) => (
    <View style={[styles.dot, { backgroundColor: color }]} />
  );

  const renderLegendComponent = () => (
    <View style={styles.legendContainer}>
      {pieData.map((item, index) => (
        <View key={index} style={styles.legendItem}>
          {renderDot(item.color)}
          <Text style={{ color: "#333" }}>
            {item.label}: {item.value} Projects
          </Text>
        </View>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        {/* <Text style={styles.title}>Project Status Overview</Text> */}

        <View style={styles.pieChartWrapper}>
          <PieChart
            data={pieData}
            donut
            showGradient
            sectionAutoFocus
            radius={120}
            innerRadius={85}
            innerCircleColor={"#232B5D"}
            centerLabelComponent={() => (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={styles.centerLabel}>
                  {projects.length}
                </Text>
                <Text style={styles.centerText}>Total Projects</Text>
              </View>
            )}
          />
        </View>

        {renderLegendComponent()}
      </View>
    </View>
  );
};

// **Styles**
const styles = StyleSheet.create({
  container: {
    // paddingVertical: 100,
    // backgroundColor: "#34448B",
  },
  chartContainer: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: "white",
  },
  title: {
    color: "#333",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  pieChartWrapper: {
    padding: 20,
    alignItems: "center",
  },
  centerLabel: {
    fontSize: 45,
    color: "white",
    padding: 2,
  },
  centerText: {
    fontSize: 13,
    color: "white",
  },
  legendContainer: {
    marginTop: 20,
    flexDirection: "column",
    alignItems: "flex-start",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default PieChartGifted;
