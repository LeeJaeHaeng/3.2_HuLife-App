import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function CommunityListScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>모임 목록</Text>
      <Text style={styles.text}>모임 목록이 여기에 표시됩니다</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF', padding: 24},
  title: {fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 16},
  text: {fontSize: 16, color: '#6B7280'},
});
