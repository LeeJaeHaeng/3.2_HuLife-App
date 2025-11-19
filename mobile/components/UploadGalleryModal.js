import { useState, useEffect } from 'react';
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
  ActivityIndicator,
  Platform
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';
import { VideoView, useVideoPlayer } from 'expo-video';
import { createGalleryItem, updateGalleryItem } from '../api/galleryService';

export default function UploadGalleryModal({ visible, onClose, onUploadSuccess, editingItem = null, hobbyId = null, hobbyName = null }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null); // Base64 string for images
  const [imageUri, setImageUri] = useState(null); // For preview
  const [videoUrl, setVideoUrl] = useState(null); // Video URI
  const [videoThumbnail, setVideoThumbnail] = useState(null); // Base64 video thumbnail
  const [mediaType, setMediaType] = useState('image'); // 'image' or 'video'
  const [isUploading, setIsUploading] = useState(false);

  const isEditMode = !!editingItem;

  // expo-video 플레이어 (동영상 미리보기용)
  const videoPlayer = useVideoPlayer(videoUrl, (player) => {
    player.loop = true;
    player.muted = true;
  });

  // 수정 모드 데이터 로드
  useEffect(() => {
    if (visible && editingItem) {
      console.log('[업로드 모달] 수정 모드 - 기존 데이터 로드:', editingItem.title);
      setTitle(editingItem.title);
      setDescription(editingItem.description || '');
      setImage(editingItem.image);
      setImageUri(editingItem.image); // Base64 이미지를 그대로 미리보기에 사용
    }
  }, [visible, editingItem]);

  // 미디어 선택 (이미지 또는 동영상)
  const handlePickMedia = async () => {
    try {
      // 권한 요청
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert('권한 필요', '사진 및 동영상 라이브러리 접근 권한이 필요합니다.');
        return;
      }

      // 이미지 또는 동영상 선택
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images', 'videos'], // ✅ 이미지와 동영상 모두 허용
        allowsEditing: true,
        aspect: [9, 16], // 세로 영상 비율
        quality: 0.8,
        base64: true, // 이미지일 경우 base64 사용
        videoMaxDuration: 60, // 최대 60초
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedMedia = result.assets[0];
        const isVideo = selectedMedia.type === 'video' || selectedMedia.uri.includes('.mp4') || selectedMedia.uri.includes('.mov');

        console.log('[업로드 모달] ✅ 미디어 선택 완료, 타입:', isVideo ? '동영상' : '이미지');
        setImageUri(selectedMedia.uri);

        if (isVideo) {
          // 동영상: URI 저장 + 썸네일 생성
          setMediaType('video');
          setVideoUrl(selectedMedia.uri);
          setImage(null);
          console.log('[업로드 모달] ✅ 동영상 URI 저장:', selectedMedia.uri);

          // 동영상 썸네일 생성
          try {
            console.log('[업로드 모달] 🎬 동영상 썸네일 생성 중...');
            const { uri: thumbnailUri } = await VideoThumbnails.getThumbnailAsync(
              selectedMedia.uri,
              {
                time: 1000, // 1초 시점의 프레임 캡처
                quality: 0.8,
              }
            );
            console.log('[업로드 모달] ✅ 썸네일 URI 생성 완료:', thumbnailUri);

            // 썸네일을 Base64로 변환
            const response = await fetch(thumbnailUri);
            const blob = await response.blob();
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64data = reader.result;
              setVideoThumbnail(base64data);
              console.log('[업로드 모달] ✅ 썸네일 Base64 변환 완료 (크기:', base64data.length, 'bytes)');
            };
            reader.readAsDataURL(blob);
          } catch (thumbnailError) {
            console.error('[업로드 모달] ⚠️ 썸네일 생성 실패:', thumbnailError);
            // 썸네일 생성 실패해도 동영상 업로드는 계속 진행
            setVideoThumbnail(null);
          }
        } else {
          // 이미지: Base64로 저장
          setMediaType('image');
          setVideoUrl(null);
          setVideoThumbnail(null);
          if (selectedMedia.base64) {
            const dataUrl = `data:image/jpeg;base64,${selectedMedia.base64}`;
            setImage(dataUrl);
            console.log('[업로드 모달] ✅ Base64 변환 완료 (크기:', dataUrl.length, 'bytes)');
          } else {
            throw new Error('Base64 데이터를 가져올 수 없습니다.');
          }
        }
      }
    } catch (error) {
      console.error('[업로드 모달] 미디어 선택 오류:', error);
      Alert.alert('오류', '미디어를 선택하는데 실패했습니다.');
    }
  };

  // 유효성 검증
  const validateForm = () => {
    // 생성 모드일 때만 hobbyId 확인 (수정 모드는 이미 hobbyId가 있음)
    if (!isEditMode && !hobbyId) {
      Alert.alert('오류', '취미 페이지에서 업로드해주세요.');
      return false;
    }
    if (!title.trim()) {
      Alert.alert('입력 오류', '작품 제목을 입력해주세요.');
      return false;
    }
    if (title.length < 2) {
      Alert.alert('입력 오류', '제목은 2자 이상 입력해주세요.');
      return false;
    }
    if (title.length > 100) {
      Alert.alert('입력 오류', '제목은 100자 이내로 입력해주세요.');
      return false;
    }
    if (!image && !videoUrl) {
      Alert.alert('입력 오류', '작품 이미지 또는 동영상을 선택해주세요.');
      return false;
    }
    return true;
  };

  // 업로드/수정 처리
  const handleUpload = async () => {
    if (!validateForm()) return;

    try {
      setIsUploading(true);

      if (isEditMode) {
        // 수정 모드
        console.log('[업로드 모달] 작품 수정 시작...');
        const updateData = {
          title: title.trim(),
          description: description.trim() || null,
          image: image, // Base64 data URL (변경된 경우)
        };

        await updateGalleryItem(editingItem.id, updateData);

        Alert.alert('성공', '작품이 성공적으로 수정되었습니다!', [
          {
            text: '확인',
            onPress: () => {
              resetForm();
              onUploadSuccess();
            },
          },
        ]);
      } else {
        // 생성 모드
        console.log('[업로드 모달] 작품 업로드 시작...');

        const galleryData = {
          hobbyId: hobbyId,
          hobbyName: hobbyName,
          title: title.trim(),
          description: description.trim() || null,
          image: image || null, // Base64 data URL (이미지일 경우)
          videoUrl: videoUrl || null, // Video URI (동영상일 경우)
          videoThumbnail: videoThumbnail || null, // Base64 video thumbnail
        };

        await createGalleryItem(galleryData);

        Alert.alert('성공', '작품이 성공적으로 업로드되었습니다!', [
          {
            text: '확인',
            onPress: () => {
              resetForm();
              onUploadSuccess();
            },
          },
        ]);
      }
    } catch (error) {
      console.error(`[업로드 모달] ${isEditMode ? '수정' : '업로드'} 실패:`, error);
      Alert.alert(`${isEditMode ? '수정' : '업로드'} 실패`, error.message);
    } finally {
      setIsUploading(false);
    }
  };

  // 폼 초기화
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setImage(null);
    setImageUri(null);
    setVideoUrl(null);
    setVideoThumbnail(null);
    setMediaType('image');
  };

  // 모달 닫기 (취소)
  const handleClose = () => {
    if (isUploading) return;

    if (title || description || image || videoUrl) {
      Alert.alert(
        '작성 중인 내용이 있습니다',
        '정말 닫으시겠습니까? 작성 중인 내용이 사라집니다.',
        [
          { text: '계속 작성', style: 'cancel' },
          {
            text: '닫기',
            style: 'destructive',
            onPress: () => {
              resetForm();
              onClose();
            },
          },
        ]
      );
    } else {
      resetForm();
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={handleClose}>
      <View style={styles.container}>
        {/* 헤더 */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} disabled={isUploading}>
            <Feather name="x" size={24} color="#1f2937" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEditMode ? '작품 수정' : '작품 업로드'}</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
          {/* 미디어 선택 (이미지 또는 동영상) */}
          <TouchableOpacity
            style={styles.imagePickerContainer}
            onPress={handlePickMedia}
            disabled={isUploading}
          >
            {imageUri || videoUrl ? (
              mediaType === 'video' && videoUrl ? (
                <VideoView
                  player={videoPlayer}
                  style={styles.previewImage}
                  contentFit="cover"
                  nativeControls={true}
                />
              ) : (
                <Image source={{ uri: imageUri }} style={styles.previewImage} />
              )
            ) : (
              <View style={styles.imagePlaceholder}>
                <Feather name="film" size={48} color="#cbd5e1" />
                <Text style={styles.imagePlaceholderText}>이미지 또는 동영상 선택</Text>
                <Text style={styles.imagePlaceholderSubtext}>탭하여 미디어 업로드 (동영상 최대 60초)</Text>
              </View>
            )}
            {(imageUri || videoUrl) && (
              <View style={styles.changeImageBadge}>
                <Feather name={mediaType === 'video' ? 'film' : 'camera'} size={16} color="#fff" />
                <Text style={styles.changeImageText}>변경</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* 취미 (읽기 전용) */}
          <View style={styles.field}>
            <Text style={styles.label}>취미</Text>
            <View style={styles.hobbyDisplayContainer}>
              <Feather name="tag" size={16} color="#FF7A5C" style={styles.hobbyIcon} />
              <Text style={styles.hobbyDisplayText}>
                {isEditMode ? editingItem?.hobbyName : hobbyName || '취미를 선택해주세요'}
              </Text>
            </View>
          </View>

          {/* 제목 */}
          <View style={styles.field}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                작품 제목 <Text style={styles.required}>*</Text>
              </Text>
              <Text style={styles.charCount}>
                {title.length}/100
              </Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="예: 첫 번째 유화 작품"
              value={title}
              onChangeText={setTitle}
              maxLength={100}
              editable={!isUploading}
            />
          </View>

          {/* 설명 (선택) */}
          <View style={styles.field}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>설명 (선택)</Text>
              <Text style={styles.charCount}>
                {description.length}/500
              </Text>
            </View>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="작품에 대한 설명을 입력하세요..."
              value={description}
              onChangeText={setDescription}
              maxLength={500}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              editable={!isUploading}
            />
          </View>
        </ScrollView>

        {/* 하단 버튼 */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={handleClose}
            disabled={isUploading}
          >
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.uploadButton, isUploading && styles.buttonDisabled]}
            onPress={handleUpload}
            disabled={isUploading}
          >
            {isUploading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.uploadButtonText}>{isEditMode ? '수정 완료' : '업로드'}</Text>
            )}
          </TouchableOpacity>
        </View>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  imagePickerContainer: {
    width: '100%',
    aspectRatio: 0.75, // 3:4 ratio
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
  },
  imagePlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    borderRadius: 12,
  },
  imagePlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginTop: 12,
  },
  imagePlaceholderSubtext: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  changeImageBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.6)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  changeImageText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  field: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  required: {
    color: '#ef4444',
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
  },
  hobbyDisplayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F2',
    borderWidth: 1,
    borderColor: '#FFD4CC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  hobbyIcon: {
    marginRight: 8,
  },
  hobbyDisplayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF7A5C',
    flex: 1,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    backgroundColor: '#f9fafb',
  },
  picker: {
    height: Platform.OS === 'ios' ? 180 : 50,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 10,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },
  uploadButton: {
    backgroundColor: '#FF7A5C',
  },
  uploadButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
