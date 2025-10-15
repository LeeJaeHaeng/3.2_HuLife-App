import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Survey'>;

export default function SurveyScreen({navigation}: Props) {
  const [answers, setAnswers] = useState<{[key: string]: string}>({});

  const handleComplete = () => {
    navigation.replace('Recommendations', {surveyResults: answers});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>취미 추천 설문</Text>
      <Text style={styles.text}>설문 질문이 여기에 표시됩니다</Text>
      <TouchableOpacity style={styles.button} onPress={handleComplete}>
        <Text style={styles.buttonText}>완료</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF', padding: 24},
  title: {fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 16},
  text: {fontSize: 16, color: '#6B7280', marginBottom: 24},
  button: {height: 56, backgroundColor: '#FF7A5C', borderRadius: 12, justifyContent: 'center', alignItems: 'center'},
  buttonText: {fontSize: 16, fontWeight: 'bold', color: '#FFFFFF'},
});
