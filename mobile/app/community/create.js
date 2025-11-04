import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { getAllHobbies } from '../../api/hobbyService';
import { createCommunityAPI } from '../../api/communityService';
import hobbyImages from '../../assets/hobbyImages';

// 한국 행정구역 데이터 (간소화 버전)
const LOCATION_DATA = {
  '서울': ['강남구', '강동구', '강북구', '강서구', '관악구', '광진구', '구로구', '금천구', '노원구', '도봉구', '동대문구', '동작구', '마포구', '서대문구', '서초구', '성동구', '성북구', '송파구', '양천구', '영등포구', '용산구', '은평구', '종로구', '중구', '중랑구'],
  '경기': ['수원시', '성남시', '고양시', '용인시', '부천시', '안산시', '안양시', '남양주시', '화성시', '평택시', '의정부시', '시흥시', '파주시', '광명시', '김포시', '군포시', '광주시', '이천시', '양주시', '오산시', '구리시', '안성시', '포천시', '의왕시', '하남시', '여주시', '동두천시', '과천시'],
  '인천': ['중구', '동구', '미추홀구', '연수구', '남동구', '부평구', '계양구', '서구', '강화군', '옹진군'],
  '부산': ['중구', '서구', '동구', '영도구', '부산진구', '동래구', '남구', '북구', '해운대구', '사하구', '금정구', '강서구', '연제구', '수영구', '사상구', '기장군'],
  '대구': ['중구', '동구', '서구', '남구', '북구', '수성구', '달서구', '달성군'],
  '광주': ['동구', '서구', '남구', '북구', '광산구'],
  '대전': ['동구', '중구', '서구', '유성구', '대덕구'],
};

const PROVINCES = Object.keys(LOCATION_DATA);

export default function CreateCommunityScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [hobbyId, setHobbyId] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [schedule, setSchedule] = useState('');
  const [maxMembers, setMaxMembers] = useState('10');

  // Data
  const [hobbies, setHobbies] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedHobby, setSelectedHobby] = useState(null);

  useEffect(() => {
    loadHobbies();
  }, []);

  const loadHobbies = async () => {
    try {
      setLoading(true);
      const data = await getAllHobbies();
      setHobbies(data);
    } catch (error) {
      console.error('[모임 생성] 취미 목록 로드 실패:', error);
      Alert.alert('오류', '취미 목록을 불러올 수 없습니다.');
    } finally {
      setLoading(false);
    }
  };

  const handleProvinceChange = (province) => {
    setSelectedProvince(province);
    setCities(LOCATION_DATA[province] || []);
    setSelectedCity(''); // Reset city
  };

  const handleHobbyChange = (hobbyId) => {
    setHobbyId(hobbyId);
    const hobby = hobbies.find(h => h.id === hobbyId);
    setSelectedHobby(hobby);
  };

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('알림', '모임 이름을 입력해주세요.');
      return;
    }
    if (!hobbyId) {
      Alert.alert('알림', '취미를 선택해주세요.');
      return;
    }
    if (!description.trim()) {
      Alert.alert('알림', '모임 설명을 입력해주세요.');
      return;
    }
    if (!selectedProvince || !selectedCity) {
      Alert.alert('알림', '활동 지역을 선택해주세요.');
      return;
    }
    if (!schedule.trim()) {
      Alert.alert('알림', '모임 일정을 입력해주세요.');
      return;
    }
    if (!maxMembers || parseInt(maxMembers) < 2) {
      Alert.alert('알림', '최대 인원은 2명 이상이어야 합니다.');
      return;
    }

    try {
      setSubmitting(true);
      const location = `${selectedProvince} ${selectedCity}`;
      // 취미 이름을 이미지 URL로 저장 (예: "축구" -> "/축구.png")
      const imageUrl = selectedHobby?.name ? `/${selectedHobby.name}.png` : '/placeholder.svg';

      const communityData = {
        name: name.trim(),
        hobbyId,
        description: description.trim(),
        location,
        schedule: schedule.trim(),
        maxMembers: parseInt(maxMembers),
        imageUrl,
      };

      console.log('[모임 생성] 데이터:', communityData);
      await createCommunityAPI(communityData);

      Alert.alert(
        '성공',
        '모임이 생성되었습니다!',
        [
          {
            text: '확인',
            onPress: () => router.back()
          }
        ]
      );
    } catch (error) {
      console.error('[모임 생성] 실패:', error);
      Alert.alert('오류', error.message || '모임 생성 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7A5C" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>새 모임 만들기</Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        enableOnAndroid={true}
        enableAutomaticScroll={true}
        extraScrollHeight={100}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hobby Image Preview */}
        {selectedHobby && (
          <View style={styles.imagePreviewContainer}>
            <Text style={styles.sectionLabel}>모임 이미지 미리보기</Text>
            <Image
              source={hobbyImages[selectedHobby.name] || require('../../assets/icon.png')}
              style={styles.imagePreview}
            />
          </View>
        )}

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>모임 이름 *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="예: 주말 수채화 동호회"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>취미 선택 *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={hobbyId}
                onValueChange={handleHobbyChange}
                style={styles.picker}
              >
                <Picker.Item label="취미를 선택하세요" value="" />
                {hobbies.map((hobby) => (
                  <Picker.Item key={hobby.id} label={hobby.name} value={hobby.id} />
                ))}
              </Picker>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>모임 설명 *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="모임에 대해 소개해주세요"
              placeholderTextColor="#999"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>활동 지역 *</Text>
            <View style={styles.locationRow}>
              <View style={[styles.pickerContainer, styles.halfWidth]}>
                <Picker
                  selectedValue={selectedProvince}
                  onValueChange={handleProvinceChange}
                  style={styles.picker}
                >
                  <Picker.Item label="시/도 선택" value="" />
                  {PROVINCES.map((province) => (
                    <Picker.Item key={province} label={province} value={province} />
                  ))}
                </Picker>
              </View>
              <View style={[styles.pickerContainer, styles.halfWidth]}>
                <Picker
                  selectedValue={selectedCity}
                  onValueChange={setSelectedCity}
                  enabled={!!selectedProvince}
                  style={styles.picker}
                >
                  <Picker.Item label="시/군/구 선택" value="" />
                  {cities.map((city) => (
                    <Picker.Item key={city} label={city} value={city} />
                  ))}
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>정기 모임 일정 *</Text>
            <TextInput
              style={styles.input}
              value={schedule}
              onChangeText={setSchedule}
              placeholder="예: 매주 토요일 오후 2시"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>최대 인원 *</Text>
            <TextInput
              style={styles.input}
              value={maxMembers}
              onChangeText={setMaxMembers}
              placeholder="2-100"
              placeholderTextColor="#999"
              keyboardType="numeric"
            />
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      {/* Submit Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? '생성 중...' : '모임 만들기'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  imagePreviewContainer: {
    padding: 16,
    backgroundColor: '#f9f9f9',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#e0e0e0',
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    paddingTop: 12,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  locationRow: {
    flexDirection: 'row',
    gap: 8,
  },
  halfWidth: {
    flex: 1,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  submitButton: {
    backgroundColor: '#FF7A5C',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
