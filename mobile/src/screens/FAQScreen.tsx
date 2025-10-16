import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'FAQ'>;

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQScreen({navigation}: Props) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs: FAQItem[] = [
    {
      question: '휴라이프는 어떤 서비스인가요?',
      answer:
        '휴라이프는 은퇴 후 새로운 취미를 찾고 싶은 분들을 위한 플랫폼입니다. AI 기반 취미 추천, 지역 기반 모임 매칭, 커뮤니티 기능을 제공하여 즐거운 노후 생활을 지원합니다.',
    },
    {
      question: '회원가입은 어떻게 하나요?',
      answer:
        "웹사이트 우측 상단의 '시작하기' 버튼을 클릭하거나, Google, Naver, Kakao 계정으로 간편하게 가입하실 수 있습니다.",
    },
    {
      question: '취미 추천은 어떻게 받나요?',
      answer:
        "로그인 후 '취미 추천받기' 메뉴에서 간단한 설문조사를 완료하시면, AI가 분석하여 회원님께 맞는 취미를 추천해드립니다.",
    },
    {
      question: '모임은 어떻게 찾나요?',
      answer:
        "'커뮤니티' 메뉴에서 관심 있는 취미나 지역을 선택하여 모임을 찾으실 수 있습니다. 각 모임의 상세 정보를 확인하고 가입 신청을 하실 수 있습니다.",
    },
    {
      question: '모임을 직접 만들 수 있나요?',
      answer:
        "네, 가능합니다. 커뮤니티 페이지에서 '모임 만들기' 버튼을 클릭하여 새로운 모임을 생성하실 수 있습니다.",
    },
    {
      question: '서비스 이용료가 있나요?',
      answer:
        '기본적인 서비스는 모두 무료로 제공됩니다. 취미 추천, 모임 가입, 커뮤니티 이용 등 대부분의 기능을 무료로 사용하실 수 있습니다.',
    },
    {
      question: '개인정보는 안전하게 보호되나요?',
      answer:
        '네, 회원님의 개인정보는 철저하게 보호됩니다. 개인정보처리방침에 따라 안전하게 관리되며, 회원님의 동의 없이 제3자에게 제공되지 않습니다.',
    },
    {
      question: '모임 활동은 어떻게 진행되나요?',
      answer:
        '각 모임마다 정기적인 활동 일정이 있으며, 모임 페이지의 게시판과 채팅을 통해 회원들과 소통하실 수 있습니다. 오프라인 모임 일정도 확인하실 수 있습니다.',
    },
    {
      question: '문의사항이 있을 때는 어떻게 하나요?',
      answer:
        "하단의 '문의하기'를 통해 문의하시거나, contact@hulife.com으로 이메일을 보내주시면 빠르게 답변드리겠습니다.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <ScrollView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <Text style={styles.title}>자주 묻는 질문</Text>
        <Text style={styles.subtitle}>
          휴라이프 이용에 대해 궁금하신 점을 확인해보세요
        </Text>
      </View>

      {/* FAQ 아코디언 */}
      <View style={styles.faqList}>
        {faqs.map((faq, index) => (
          <View key={index} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.questionContainer}
              onPress={() => toggleFAQ(index)}
              activeOpacity={0.7}>
              <Text style={styles.questionText}>{faq.question}</Text>
              <Text style={styles.expandIcon}>
                {expandedIndex === index ? '−' : '+'}
              </Text>
            </TouchableOpacity>
            {expandedIndex === index && (
              <View style={styles.answerContainer}>
                <Text style={styles.answerText}>{faq.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* 추가 문의 안내 */}
      <View style={styles.contactBanner}>
        <Text style={styles.contactBannerTitle}>
          원하시는 답변을 찾지 못하셨나요?
        </Text>
        <Text style={styles.contactBannerText}>
          contact@hulife.com으로 문의해주시면 친절하게 답변드리겠습니다.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 20,
    paddingTop: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  faqList: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  faqItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
    overflow: 'hidden',
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  questionText: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
    paddingRight: 12,
  },
  expandIcon: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6B7280',
    width: 24,
    textAlign: 'center',
  },
  answerContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 0,
  },
  answerText: {
    fontSize: 15,
    color: '#6B7280',
    lineHeight: 22,
  },
  contactBanner: {
    backgroundColor: '#F9FAFB',
    marginHorizontal: 20,
    marginVertical: 24,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  contactBannerTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  contactBannerText: {
    fontSize: 15,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 22,
  },
});
