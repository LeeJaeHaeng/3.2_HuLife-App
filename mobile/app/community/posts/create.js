import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { createPostAPI } from '../../../api/communityService';

export default function CreatePostPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form fields
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('자유');

  const categories = ['공지', '자유', '질문', '후기', '모집'];

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('알림', '제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      Alert.alert('알림', '내용을 입력해주세요.');
      return;
    }

    try {
      setLoading(true);

      const postData = {
        title: title.trim(),
        content: content.trim(),
        category,
      };

      console.log('[게시글 작성] 데이터:', postData);

      await createPostAPI(postData);

      Alert.alert('성공', '게시글이 작성되었습니다!', [
        {
          text: '확인',
          onPress: () => router.back(),
        }
      ]);
    } catch (error) {
      console.error('[게시글 작성] 실패:', error);
      Alert.alert('오류', error.message || '게시글 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7A5C" />
          <Text style={styles.loadingText}>게시글을 작성하는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>게시글 작성</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.form}>
          {/* Category Picker */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>카테고리 *</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(value) => setCategory(value)}
                style={styles.picker}
              >
                {categories.map((cat) => (
                  <Picker.Item key={cat} label={cat} value={cat} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Title Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>제목 *</Text>
            <TextInput
              style={styles.input}
              placeholder="제목을 입력하세요"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
            />
            <Text style={styles.charCount}>{title.length}/100</Text>
          </View>

          {/* Content Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>내용 *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="내용을 입력하세요"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[styles.submitButton, (!title.trim() || !content.trim()) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!title.trim() || !content.trim()}
          >
            <Text style={styles.submitButtonText}>작성하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
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
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 200,
    paddingTop: 12,
  },
  charCount: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: '#FF7A5C',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
