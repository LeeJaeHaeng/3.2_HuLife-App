import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';

export default function HobbyListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>취미 목록</Text>
      <Text style={styles.text}>취미 목록이 여기에 표시됩니다</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF', padding: 24},
  title: {fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 16},
  text: {fontSize: 16, color: '#6B7280'},
});
