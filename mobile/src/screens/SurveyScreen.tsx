import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';
import {SurveyQuestion, SurveyResponses} from '../types';
import {surveyService} from '../services/api';

type Props = NativeStackScreenProps<RootStackParamList, 'Survey'>;

const QUESTIONS: SurveyQuestion[] = [
  {
    id: '1',
    question: '야외 활동을 얼마나 선호하시나요?',
    options: [
      {value: '1', label: '전혀 선호하지 않음'},
      {value: '2', label: '별로 선호하지 않음'},
      {value: '3', label: '보통'},
      {value: '4', label: '선호함'},
      {value: '5', label: '매우 선호함'},
    ],
  },
  {
    id: '2',
    question: '자연 속에서 시간을 보내는 것을 좋아하시나요?',
    options: [
      {value: '1', label: '전혀 좋아하지 않음'},
      {value: '2', label: '별로 좋아하지 않음'},
      {value: '3', label: '보통'},
      {value: '4', label: '좋아함'},
      {value: '5', label: '매우 좋아함'},
    ],
  },
  {
    id: '3',
    question: '다른 사람들과 함께하는 활동을 선호하시나요?',
    options: [
      {value: '1', label: '혼자 하는 것을 선호'},
      {value: '2', label: '대체로 혼자 선호'},
      {value: '3', label: '상관없음'},
      {value: '4', label: '함께 하는 것을 선호'},
      {value: '5', label: '반드시 함께 하고 싶음'},
    ],
  },
  {
    id: '4',
    question: '새로운 사람들을 만나는 것에 대해 어떻게 생각하시나요?',
    options: [
      {value: '1', label: '부담스러움'},
      {value: '2', label: '약간 부담스러움'},
      {value: '3', label: '보통'},
      {value: '4', label: '좋음'},
      {value: '5', label: '매우 좋음'},
    ],
  },
  {
    id: '5',
    question: '창의적인 활동(그림, 공예 등)에 관심이 있으신가요?',
    options: [
      {value: '1', label: '전혀 관심 없음'},
      {value: '2', label: '별로 관심 없음'},
      {value: '3', label: '보통'},
      {value: '4', label: '관심 있음'},
      {value: '5', label: '매우 관심 있음'},
    ],
  },
  {
    id: '6',
    question: '예술적 표현 활동을 해보고 싶으신가요?',
    options: [
      {value: '1', label: '전혀 원하지 않음'},
      {value: '2', label: '별로 원하지 않음'},
      {value: '3', label: '보통'},
      {value: '4', label: '원함'},
      {value: '5', label: '매우 원함'},
    ],
  },
  {
    id: '7',
    question: '신체 활동이 포함된 취미를 원하시나요?',
    options: [
      {value: '1', label: '전혀 원하지 않음'},
      {value: '2', label: '별로 원하지 않음'},
      {value: '3', label: '보통'},
      {value: '4', label: '원함'},
      {value: '5', label: '매우 원함'},
    ],
  },
  {
    id: '8',
    question: '취미 활동에 투자할 수 있는 예산은 어느 정도인가요?',
    options: [
      {value: '1', label: '최소한으로'},
      {value: '2', label: '적당히'},
      {value: '3', label: '보통'},
      {value: '4', label: '여유있게'},
      {value: '5', label: '제한 없이'},
    ],
  },
];

export default function SurveyScreen({navigation}: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const progress = ((currentQuestion + 1) / QUESTIONS.length) * 100;
  const currentQ = QUESTIONS[currentQuestion];

  const handleAnswer = (questionId: string, value: string) => {
    setResponses(prev => ({...prev, [questionId]: value}));
  };

  const handleNext = () => {
    if (!responses[currentQ.id]) {
      Alert.alert('알림', '답변을 선택해주세요');
      return;
    }

    if (currentQuestion < QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!responses[currentQ.id]) {
      Alert.alert('알림', '답변을 선택해주세요');
      return;
    }

    setIsSubmitting(true);

    // Convert string responses to numbers
    const numericResponses: SurveyResponses = {};
    Object.entries(responses).forEach(([key, value]) => {
      numericResponses[key] = parseInt(value);
    });

    try {
      await surveyService.submitSurvey(numericResponses);
      Alert.alert('완료', '설문이 완료되었습니다!', [
        {
          text: '확인',
          onPress: () => navigation.replace('Recommendations'),
        },
      ]);
    } catch (error: any) {
      console.error('Survey submission error:', error);

      // 401 Unauthorized - 로그인 필요
      if (error.response?.status === 401) {
        Alert.alert(
          '로그인 필요',
          '설문을 제출하려면 먼저 로그인해주세요.',
          [
            {text: '취소', style: 'cancel'},
            {
              text: '로그인하기',
              onPress: () => navigation.navigate('Login'),
            },
          ]
        );
      } else {
        // 기타 오류
        const errorMessage = error.response?.data?.error || error.message || '설문 제출에 실패했습니다.';
        Alert.alert('오류', errorMessage);
      }

      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Progress Header */}
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressText}>
            질문 {currentQuestion + 1} / {QUESTIONS.length}
          </Text>
          <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
        </View>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, {width: `${progress}%`}]} />
        </View>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Question Card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionTitle}>{currentQ.question}</Text>

          {/* Options */}
          <View style={styles.optionsContainer}>
            {currentQ.options.map(option => {
              const isSelected = responses[currentQ.id] === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                  onPress={() => handleAnswer(currentQ.id, option.value)}
                  activeOpacity={0.7}>
                  <View
                    style={[styles.radioButton, isSelected && styles.radioButtonSelected]}>
                    {isSelected && <View style={styles.radioButtonInner} />}
                  </View>
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Navigation Buttons */}
      <View style={styles.navigationContainer}>
        <TouchableOpacity
          style={[styles.navButton, styles.navButtonOutline, currentQuestion === 0 && styles.navButtonDisabled]}
          onPress={handlePrevious}
          disabled={currentQuestion === 0}>
          <Text style={[styles.navButtonText, styles.navButtonTextOutline]}>이전</Text>
        </TouchableOpacity>

        {currentQuestion < QUESTIONS.length - 1 ? (
          <TouchableOpacity style={[styles.navButton, styles.navButtonPrimary]} onPress={handleNext}>
            <Text style={[styles.navButtonText, styles.navButtonTextPrimary]}>다음</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, styles.navButtonPrimary]}
            onPress={handleSubmit}
            disabled={isSubmitting}>
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={[styles.navButtonText, styles.navButtonTextPrimary]}>결과 보기</Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  progressContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressPercent: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF7A5C',
    borderRadius: 4,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  questionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 24,
    lineHeight: 30,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
  },
  optionButtonSelected: {
    borderColor: '#FF7A5C',
    backgroundColor: '#FFF4F2',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: '#FF7A5C',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF7A5C',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  optionTextSelected: {
    color: '#FF7A5C',
    fontWeight: '500',
  },
  navigationContainer: {
    flexDirection: 'row',
    padding: 24,
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  navButton: {
    flex: 1,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  navButtonPrimary: {
    backgroundColor: '#FF7A5C',
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  navButtonTextOutline: {
    color: '#374151',
  },
  navButtonTextPrimary: {
    color: '#FFFFFF',
  },
});
