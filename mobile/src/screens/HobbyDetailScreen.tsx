import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'HobbyDetail'>;

export default function HobbyDetailScreen({route}: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>취미 상세</Text>
      <Text style={styles.text}>ID: {route.params.hobbyId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF', padding: 24},
  title: {fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 16},
  text: {fontSize: 16, color: '#6B7280'},
});
