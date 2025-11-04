import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { createScheduleAPI, updateScheduleAPI } from '../api/userService';

export default function AddScheduleModal({ visible, onClose, editingSchedule, onScheduleAdded }) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState('class');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = !!editingSchedule;

  // Load existing schedule data when editing
  useEffect(() => {
    if (editingSchedule) {
      setTitle(editingSchedule.title || '');
      setType(editingSchedule.type || 'class');
      // Format date for display (YYYY-MM-DD)
      const scheduleDate = new Date(editingSchedule.date);
      const formattedDate = scheduleDate.toISOString().split('T')[0];
      setDate(formattedDate);
      setTime(editingSchedule.time || '');
      setLocation(editingSchedule.location || '');
    } else {
      // Reset form for new schedule
      setTitle('');
      setType('class');
      setDate('');
      setTime('');
      setLocation('');
    }
  }, [editingSchedule, visible]);

  const scheduleTypes = [
    { value: 'class', label: '수업' },
    { value: 'practice', label: '연습' },
    { value: 'meeting', label: '모임' },
    { value: 'event', label: '행사' },
  ];

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('알림', '제목을 입력해주세요.');
      return;
    }
    if (!date) {
      Alert.alert('알림', '날짜를 입력해주세요.');
      return;
    }
    if (!time) {
      Alert.alert('알림', '시간을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const scheduleData = {
        title: title.trim(),
        type,
        date: new Date(date).toISOString(),
        time,
        location: location.trim() || undefined,
      };

      if (isEditMode) {
        // Update existing schedule
        await updateScheduleAPI(editingSchedule.id, scheduleData);
        Alert.alert('성공', '일정이 수정되었습니다!');
      } else {
        // Create new schedule
        await createScheduleAPI(scheduleData);
        Alert.alert('성공', '일정이 추가되었습니다!');
      }

      onScheduleAdded?.(); // Callback to refresh schedule list
      onClose(); // Close modal
    } catch (error) {
      Alert.alert('오류', error.message || `일정 ${isEditMode ? '수정' : '추가'}에 실패했습니다.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{isEditMode ? '일정 수정' : '일정 추가'}</Text>
            <TouchableOpacity onPress={onClose} disabled={isSubmitting}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <Text style={styles.modalDescription}>
            {isEditMode ? '일정 정보를 수정하세요.' : '새로운 취미 활동 일정을 추가하세요.'}
          </Text>

          <ScrollView style={styles.formContainer}>
            {/* Title */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>제목</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
                placeholder="예: 수채화 수업"
                placeholderTextColor="#999"
              />
            </View>

            {/* Type */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>유형</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={type}
                  onValueChange={(value) => setType(value)}
                  style={styles.picker}
                >
                  {scheduleTypes.map((item) => (
                    <Picker.Item key={item.value} label={item.label} value={item.value} />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Date */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>날짜</Text>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD (예: 2025-10-20)"
                placeholderTextColor="#999"
              />
              <Text style={styles.hint}>날짜 형식: 2025-10-20</Text>
            </View>

            {/* Time */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>시간</Text>
              <TextInput
                style={styles.input}
                value={time}
                onChangeText={setTime}
                placeholder="HH:MM (예: 14:30)"
                placeholderTextColor="#999"
              />
              <Text style={styles.hint}>시간 형식: 14:30</Text>
            </View>

            {/* Location (Optional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>장소 (선택)</Text>
              <TextInput
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholder="예: 문화센터 3층"
                placeholderTextColor="#999"
              />
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
              disabled={isSubmitting}
            >
              <Text style={styles.cancelButtonText}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>{isEditMode ? '수정하기' : '추가하기'}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  formContainer: {
    paddingHorizontal: 20,
    maxHeight: 400,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  hint: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
  },
  picker: {
    height: 50,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  submitButton: {
    backgroundColor: '#FF7A5C',
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});
