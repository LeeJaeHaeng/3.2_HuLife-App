import React, { useState } from 'react';
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Picker } from '@react-native-picker/picker';
import { updateUserProfile } from '../api/userService';

const BRAND_COLOR = '#FF7A5C';

export default function EditProfileModal({ visible, onClose, user, onUpdate }) {
  const [name, setName] = useState(user?.name || '');
  const [age, setAge] = useState(user?.age?.toString() || '');
  const [location, setLocation] = useState(user?.location || '서울');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [imageFile, setImageFile] = useState(null); // For upload
  const [loading, setLoading] = useState(false);

  // Image Picker
  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('권한 필요', '사진을 선택하려면 갤러리 접근 권한이 필요합니다.');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,  // ✅ 적절한 압축 (0.7 = 고품질 유지하면서 크기 감소)
        base64: false, // Base64 직접 받지 않음 (수동 변환)
      });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
        setImageFile(result.assets[0]);
      }
    } catch (error) {
      console.error('[이미지 선택 오류]', error);
      Alert.alert('오류', '이미지를 선택하는 중 오류가 발생했습니다.');
    }
  };

  // Handle Save
  const handleSave = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('입력 오류', '이름을 입력해주세요.');
      return;
    }

    const ageNum = parseInt(age);
    if (!ageNum || ageNum < 1 || ageNum > 150) {
      Alert.alert('입력 오류', '올바른 나이를 입력해주세요.');
      return;
    }

    setLoading(true);

    try {
      const updates = {
        name: name.trim(),
        age: ageNum,
        location,
        phone: phone.trim() || null,
      };

      // If there's a new image file, convert to Base64 with compression check
      if (imageFile) {
        console.log('[프로필 수정] 이미지 Base64 변환 중...');

        // Read image as Base64
        const response = await fetch(imageFile.uri);
        const blob = await response.blob();

        // 파일 크기 체크 (정보 표시용, 제한 없음)
        const fileSizeKB = blob.size / 1024;
        const fileSizeMB = fileSizeKB / 1024;
        console.log('[프로필 수정] 원본 이미지 크기:', fileSizeMB > 1 ? `${fileSizeMB.toFixed(2)} MB` : `${fileSizeKB.toFixed(2)} KB`);

        // 크기 제한 제거 - LONGTEXT는 최대 4GB까지 지원

        const reader = new FileReader();
        const base64 = await new Promise((resolve, reject) => {
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });

        const base64Length = base64.length;
        console.log('[프로필 수정] Base64 변환 완료, 길이:', base64Length, '문자');
        console.log('[프로필 수정] Base64 크기:', (base64Length / 1024).toFixed(2), 'KB');

        updates.profileImage = base64; // Add Base64 string to updates
      }

      // Send as JSON (with or without image)
      console.log('[프로필 수정] 프로필 업데이트 요청 전송...');
      await updateUserProfile(updates);

      Alert.alert('성공', '프로필이 업데이트되었습니다.');
      onUpdate(); // Reload parent data
      onClose();
    } catch (error) {
      console.error('[프로필 업데이트 오류]', error);
      Alert.alert('오류', error.message || '프로필 업데이트에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Feather name="x" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>프로필 수정</Text>
          <TouchableOpacity onPress={handleSave} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color={BRAND_COLOR} />
            ) : (
              <Text style={styles.saveText}>저장</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Profile Image */}
          <View style={styles.imageSection}>
            <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                  <Text style={styles.avatarText}>{name[0] || '?'}</Text>
                </View>
              )}
              <View style={styles.cameraButton}>
                <Feather name="camera" size={20} color="#fff" />
              </View>
            </TouchableOpacity>
            <Text style={styles.imageHint}>사진을 탭하여 변경</Text>
          </View>

          {/* Form Fields */}
          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>이름 *</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="홍길동"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>나이 *</Text>
              <TextInput
                style={styles.input}
                value={age}
                onChangeText={setAge}
                placeholder="65"
                keyboardType="number-pad"
                placeholderTextColor="#9ca3af"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>거주 지역 *</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={location}
                  onValueChange={(itemValue) => setLocation(itemValue)}
                  style={styles.picker}
                >
                  <Picker.Item label="서울" value="서울" />
                  <Picker.Item label="경기" value="경기" />
                  <Picker.Item label="인천" value="인천" />
                  <Picker.Item label="부산" value="부산" />
                  <Picker.Item label="대구" value="대구" />
                  <Picker.Item label="광주" value="광주" />
                  <Picker.Item label="대전" value="대전" />
                  <Picker.Item label="울산" value="울산" />
                  <Picker.Item label="세종" value="세종" />
                  <Picker.Item label="강원" value="강원" />
                  <Picker.Item label="충북" value="충북" />
                  <Picker.Item label="충남" value="충남" />
                  <Picker.Item label="전북" value="전북" />
                  <Picker.Item label="전남" value="전남" />
                  <Picker.Item label="경북" value="경북" />
                  <Picker.Item label="경남" value="경남" />
                  <Picker.Item label="제주" value="제주" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>전화번호</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="010-1234-5678"
                keyboardType="phone-pad"
                placeholderTextColor="#9ca3af"
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  saveText: {
    fontSize: 16,
    fontWeight: '600',
    color: BRAND_COLOR,
  },
  content: {
    flex: 1,
  },
  imageSection: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#f9fafb',
  },
  imageContainer: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e5e7eb',
  },
  avatarFallback: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BRAND_COLOR,
  },
  avatarText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: BRAND_COLOR,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#fff',
  },
  imageHint: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  formSection: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
});
