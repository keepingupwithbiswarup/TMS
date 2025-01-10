import { Dimensions, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Pdf from 'react-native-pdf';

const DocumentViewPage = ({ route }:{route:any}) => {
  const { source } = route.params;

  return (
    <View style={styles.container}>
      <Text style={{ margin: 15, fontSize: 15, fontWeight: "bold", marginBottom: 0 }}>
        View Pdf
      </Text>
      <View style={styles.pdfContainer}>
        <Pdf
          trustAllCerts={false}
          source={source}
          style={styles.pdf}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: '#fff', 
  },
  pdfContainer: {
    flex: 1,
    width: Dimensions.get('window').width,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    marginTop: 20,
  },
  pdf: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default DocumentViewPage;
