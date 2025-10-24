import React, { useState } from 'react';
import {
  Alert,
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
import { createHobbyReview } from '../api/hobbyService';

const BRAND_COLOR = '#FF7A5C';

export default function AddReviewModal({ visible, onClose, hobbyId, hobbyName, onReviewAdded }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset form
  const resetForm = () => {
    setRating(0);
    setComment('');
  };

  // Handle close
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Handle submit
  const handleSubmit = async () => {
    // Validation
    if (rating === 0) {
      Alert.alert('입력 오류', '별점을 선택해주세요.');
      return;
    }

    if (!comment.trim()) {
      Alert.alert('입력 오류', '후기 내용을 입력해주세요.');
      return;
    }

    if (comment.trim().length < 10) {
      Alert.alert('입력 오류', '후기는 최소 10자 이상 작성해주세요.');
      return;
    }

    setLoading(true);

    try {
      await createHobbyReview(hobbyId, {
        rating,
        comment: comment.trim(),
      });

      Alert.alert('성공', '리뷰가 등록되었습니다.');
      if (onReviewAdded) onReviewAdded();
      handleClose();
    } catch (error) {
      console.error('[리뷰 작성 오류]', error);
      Alert.alert('오류', error.message || '리뷰 작성에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // Star rating component
  const StarRating = () => {
    return (
      <View style={styles.starContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            style={styles.starButton}
          >
            <Feather
              name="star"
              size={40}
              color={star <= rating ? '#FFD700' : '#d1d5db'}
              fill={star <= rating ? '#FFD700' : 'transparent'}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose}>
            <Feather name="x" size={24} color="#111827" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>리뷰 작성</Text>
          <TouchableOpacity onPress={handleSubmit} disabled={loading}>
            {loading ? (
              <ActivityIndicator size="small" color={BRAND_COLOR} />
            ) : (
              <Text style={styles.submitText}>등록</Text>
            )}
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {/* Hobby Name */}
          <View style={styles.hobbySection}>
            <Text style={styles.label}>취미</Text>
            <Text style={styles.hobbyName}>{hobbyName}</Text>
          </View>

          {/* Star Rating */}
          <View style={styles.section}>
            <Text style={styles.label}>별점 *</Text>
            <StarRating />
            {rating > 0 && (
              <Text style={styles.ratingText}>
                {rating === 1 && '별로예요'}
                {rating === 2 && '그저 그래요'}
                {rating === 3 && '보통이에요'}
                {rating === 4 && '좋아요'}
                {rating === 5 && '최고예요!'}
              </Text>
            )}
          </View>

          {/* Comment */}
          <View style={styles.section}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>후기 내용 *</Text>
              <Text style={styles.charCount}>{comment.length} / 500</Text>
            </View>
            <TextInput
              style={styles.textarea}
              value={comment}
              onChangeText={setComment}
              placeholder="이 취미에 대한 솔직한 후기를 남겨주세요. (최소 10자)"
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={8}
              maxLength={500}
              textAlignVertical="top"
            />
            <Text style={styles.hint}>
              * 욕설, 비방, 광고성 내용은 삭제될 수 있습니다.
            </Text>
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
  submitText: {
    fontSize: 16,
    fontWeight: '600',
    color: BRAND_COLOR,
  },
  content: {
    flex: 1,
  },
  hobbySection: {
    padding: 20,
    backgroundColor: '#f9fafb',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  section: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  charCount: {
    fontSize: 14,
    color: '#6b7280',
  },
  hobbyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BRAND_COLOR,
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginTop: 8,
  },
  textarea: {
    height: 150,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#fff',
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
  },
});
