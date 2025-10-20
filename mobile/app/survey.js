// ✨ React와 함께 useState를 import 합니다.
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { submitSurveyAnswers } from '../api/surveyService'; // API 서비스 import

// 질문 데이터 (변경 없음)
const questions = [
  { id: "1", question: "야외 활동을 얼마나 선호하시나요?", options: [ { value: "1", label: "전혀 선호하지 않음" }, { value: "2", label: "별로 선호하지 않음" }, { value: "3", label: "보통" }, { value: "4", label: "선호함" }, { value: "5", label: "매우 선호함" } ] },
  { id: "2", question: "자연 속에서 시간을 보내는 것을 좋아하시나요?", options: [ { value: "1", label: "전혀 좋아하지 않음" }, { value: "2", label: "별로 좋아하지 않음" }, { value: "3", label: "보통" }, { value: "4", label: "좋아함" }, { value: "5", label: "매우 좋아함" } ] },
  { id: "3", question: "다른 사람들과 함께하는 활동을 선호하시나요?", options: [ { value: "1", label: "혼자 하는 것을 선호" }, { value: "2", label: "대체로 혼자 선호" }, { value: "3", label: "상관없음" }, { value: "4", label: "함께 하는 것을 선호" }, { value: "5", label: "반드시 함께 하고 싶음" } ] },
  { id: "4", question: "새로운 사람들을 만나는 것에 대해 어떻게 생각하시나요?", options: [ { value: "1", label: "부담스러움" }, { value: "2", label: "약간 부담스러움" }, { value: "3", label: "보통" }, { value: "4", label: "좋음" }, { value: "5", label: "매우 좋음" } ] },
  { id: "5", question: "창의적인 활동(그림, 공예 등)에 관심이 있으신가요?", options: [ { value: "1", label: "전혀 관심 없음" }, { value: "2", label: "별로 관심 없음" }, { value: "3", label: "보통" }, { value: "4", label: "관심 있음" }, { value: "5", label: "매우 관심 있음" } ] },
  { id: "6", question: "예술적 표현 활동을 해보고 싶으신가요?", options: [ { value: "1", label: "전혀 원하지 않음" }, { value: "2", label: "별로 원하지 않음" }, { value: "3", label: "보통" }, { value: "4", label: "원함" }, { value: "5", label: "매우 원함" } ] },
  { id: "7", question: "신체 활동이 포함된 취미를 원하시나요?", options: [ { value: "1", label: "전혀 원하지 않음" }, { value: "2", label: "별로 원하지 않음" }, { value: "3", label: "보통" }, { value: "4", label: "원함" }, { value: "5", label: "매우 원함" } ] },
  { id: "8", question: "취미 활동에 투자할 수 있는 예산은 어느 정도인가요?", options: [ { value: "1", label: "최소한으로" }, { value: "2", label: "적당히" }, { value: "3", label: "보통" }, { value: "4", label: "여유있게" }, { value: "5", label: "제한 없이" } ] },
];


export default function SurveyScreen() {
  const router = useRouter();
  // useState를 사용하기 위해 import 확인
  const [currentQuestion, setCurrentQuestion] = useState(0); 
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false); 

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  const handleAnswer = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (!responses[currentQ.id]) {
      Alert.alert("알림", "답변을 선택해주세요.");
      return;
    }
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!responses[currentQ.id]) {
      Alert.alert("알림", "답변을 선택해주세요.");
      return;
    }
    setLoading(true);

    try {
      console.log("[설문 화면] 🚀 서버에 답변 제출 시작:", responses);
      await submitSurveyAnswers(responses);
      console.log("[설문 화면] ✅ 답변 제출 성공!");
      Alert.alert("성공", "설문이 완료되었습니다! 추천 페이지로 이동합니다.");
      router.replace('/recommendations'); 
    } catch (e) {
      console.error("[설문 화면] ❌ 답변 제출 실패:", e.message);
      Alert.alert("오류", e.message || "설문 제출 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* 1. 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Feather name="x" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>취미 추천 설문</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* 2. 진행도 바 */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>

      {/* ScrollView 사용 */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* 3. 질문 */}
        <Text style={styles.questionCounter}>질문 {currentQuestion + 1}/{questions.length}</Text>
        <Text style={styles.questionText}>{currentQ.question}</Text>

        {/* 4. 선택지 */}
        <View style={styles.optionsContainer}>
          {currentQ.options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.optionButton,
                responses[currentQ.id] === option.value && styles.selectedOption,
              ]}
              onPress={() => handleAnswer(currentQ.id, option.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  responses[currentQ.id] === option.value && styles.selectedOptionText,
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
      
      {/* 5. 하단 네비게이션 버튼 */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.navButton, styles.prevButton]}
          onPress={handlePrevious}
          disabled={currentQuestion === 0 || loading}
        >
          <Feather name="chevron-left" size={20} color={currentQuestion === 0 || loading ? '#cbd5e1' : 'black'} />
          <Text style={[styles.navButtonText, { color: currentQuestion === 0 || loading ? '#cbd5e1' : 'black' }]}>이전</Text>
        </TouchableOpacity>

        {currentQuestion < questions.length - 1 ? (
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton]}
            onPress={handleNext}
            disabled={loading}
          >
            <Text style={[styles.navButtonText, { color: 'white' }]}>다음</Text>
            <Feather name="chevron-right" size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.navButton, styles.nextButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text style={[styles.navButtonText, { color: 'white' }]}>
              {loading ? "제출 중..." : "결과 보기"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

// styles 정의 (변경 없음)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  progressContainer: { height: 8, backgroundColor: '#e5e7eb' },
  progressBar: { height: '100%', backgroundColor: '#FF7A5C' },
  content: { padding: 20, paddingBottom: 100 }, 
  questionCounter: { fontSize: 16, color: '#6b7280', marginBottom: 8 },
  questionText: { fontSize: 24, fontWeight: 'bold', marginBottom: 32 },
  optionsContainer: { },
  optionButton: {
    backgroundColor: '#f3f4f6',
    padding: 20,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: '#FF7A5C',
    backgroundColor: '#fff5f0',
  },
  optionText: { fontSize: 18, fontWeight: '500' },
  selectedOptionText: { color: '#FF7A5C' },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  prevButton: { backgroundColor: '#f3f4f6' },
  nextButton: { backgroundColor: '#FF7A5C' },
  navButtonText: { fontSize: 16, fontWeight: 'bold' },
  disabledButton: { backgroundColor: '#9ca3af' },
});