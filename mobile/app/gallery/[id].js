import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { VideoView, useVideoPlayer } from 'expo-video';
import {
  getAllGalleryItems,
  toggleGalleryLike,
  deleteGalleryItem,
  getGalleryComments,
  createGalleryComment,
} from '../../api/galleryService';
import { getCurrentUser } from '../../api/authService';
import UploadGalleryModal from '../../components/UploadGalleryModal';
import hobbyImages from '../../assets/hobbyImages';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// 릴스 스타일 갤러리 아이템 컴포넌트
const GalleryReelItem = ({ item, currentUser, onLike, onEdit, onDelete, isActive }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item.likes || 0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const lastTap = useRef(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isCommentsModalVisible, setIsCommentsModalVisible] = useState(false);

  const isOwner = currentUser && currentUser.id === item.userId;
  const isVideo = item.videoUrl || item.image?.includes('video') || item.image?.includes('.mp4');

  // expo-video 플레이어 생성
  const player = useVideoPlayer(isVideo ? (item.videoUrl || item.image) : null, (player) => {
    player.loop = true;
  });

  // 화면 활성화 시 비디오 재생
  useEffect(() => {
    if (isActive && player && isVideo) {
      player.play();
    } else if (!isActive && player) {
      player.pause();
    }
  }, [isActive, isVideo, player]);

  // 비디오 진행 상황 추적
  useEffect(() => {
    if (!player || !isVideo) return;

    const interval = setInterval(() => {
      setCurrentTime(player.currentTime);
      setDuration(player.duration || 0);
    }, 100);

    return () => clearInterval(interval);
  }, [player, isVideo]);

  // 댓글 로드
  useEffect(() => {
    const loadComments = async () => {
      try {
        const fetchedComments = await getGalleryComments(item.id);
        setComments(fetchedComments);
        console.log(`[갤러리 릴스] 댓글 ${fetchedComments.length}개 로드됨`);
      } catch (error) {
        console.error('[갤러리 릴스] 댓글 로드 실패:', error);
      }
    };

    if (isActive) {
      loadComments();
    }
  }, [item.id, isActive]);

  const handleLike = async () => {
    if (!currentUser) {
      Alert.alert('로그인 필요', '좋아요를 누르려면 로그인이 필요합니다.');
      return;
    }

    try {
      const result = await onLike(item.id);
      setIsLiked(result.isLiked);
      setLikeCount(result.likes);
    } catch (error) {
      console.error('[좋아요 실패]', error);
    }
  };

  const handleDoubleTap = () => {
    if (!isLiked) {
      handleLike();
      // 하트 애니메이션
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 0, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      ]).start();
    }
  };

  const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds === 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300; // 300ms 이내 두 번 탭하면 더블탭

    if (lastTap.current && (now - lastTap.current) < DOUBLE_TAP_DELAY) {
      // 더블탭 - 좋아요
      lastTap.current = null;
      handleDoubleTap();
    } else {
      // 싱글탭 - 아무 동작 안함 (하단 정보는 항상 표시)
      lastTap.current = now;
    }
  };

  const handleAddComment = async () => {
    if (!currentUser) {
      Alert.alert('로그인 필요', '댓글을 작성하려면 로그인이 필요합니다.');
      return;
    }
    if (!newComment.trim()) {
      return;
    }

    try {
      const createdComment = await createGalleryComment(item.id, newComment.trim());
      setComments(prev => [createdComment, ...prev]);
      setNewComment('');
      console.log('[갤러리 릴스] 댓글 작성 성공');
      // 댓글 작성 성공 시 모달은 열린 상태 유지 (사용자가 더 많은 댓글 볼 수 있도록)
    } catch (error) {
      console.error('[갤러리 릴스] 댓글 작성 실패:', error);
      Alert.alert('오류', error.message || '댓글 작성에 실패했습니다.');
    }
  };

  return (
    <TouchableOpacity
      style={styles.reelContainer}
      activeOpacity={1}
      onPress={handleTap}
    >
      {/* 미디어 (이미지 또는 비디오) */}
      {isVideo ? (
        <VideoView
          player={player}
          style={styles.media}
          contentFit="cover"
          nativeControls={false}
        />
      ) : (
        <Image
          source={
            // 1순위: hobbyName으로 로컬 이미지 찾기
            item.hobbyName && hobbyImages[item.hobbyName]
              ? hobbyImages[item.hobbyName]
              // 2순위: Base64 또는 URL 이미지
              : item.image && item.image.length > 0
              ? { uri: item.image }
              // 3순위: placeholder
              : require('../../assets/icon.png')
          }
          style={styles.media}
          resizeMode="cover"
          defaultSource={require('../../assets/icon.png')}
          onError={(e) => {
            console.error('[갤러리 릴스] 이미지 로드 실패:', item.title, e.nativeEvent.error);
            if (item.hobbyName) {
              console.log('[갤러리 릴스] 취미 이름:', item.hobbyName, '/ 이미지 존재:', !!hobbyImages[item.hobbyName]);
            }
          }}
        />
      )}

      {/* 우측 액션 버튼 제거 - 하단 메타 영역으로 통일 */}

      {/* 동영상 프로그레스 바 */}
      {isVideo && duration > 0 && (
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(currentTime / duration) * 100}%` }
              ]}
            />
          </View>
          <Text style={styles.progressTime}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
        </View>
      )}

      {/* 하단 정보 (고정 크기) - 인스타그램 릴스 스타일 */}
      <View style={styles.bottomInfo}>
        <View style={styles.bottomInfoContent}>
          {/* 작가명 + 제목 */}
          <Text style={styles.captionText}>
            <Text style={styles.userName}>{item.userName}</Text>
            {' '}
            <Text style={styles.titleText}>{item.title}</Text>
          </Text>

          {/* 설명 (1줄 제한) */}
          {item.description && (
            <Text style={styles.descriptionText} numberOfLines={1}>{item.description}</Text>
          )}

          {/* 메타 정보 (취미 태그 + 조회수) + 본인 작품 컨트롤 */}
          <View style={styles.metaRow}>
            <View style={styles.metaLeftGroup}>
              <View style={styles.hobbyTag}>
                <Feather name="tag" size={10} color="#FF7A5C" />
                <Text style={styles.hobbyText}>{item.hobbyName}</Text>
              </View>
              <View style={styles.viewsInfo}>
                <Feather name="eye" size={10} color="rgba(255,255,255,0.7)" />
                <Text style={styles.viewsText}>{item.views || 0}회</Text>
              </View>
            </View>

            {/* 모든 작품에 좋아요 + 본인 작품일 때 수정 버튼 추가 (통일된 UI) */}
            <View style={styles.ownerControls}>
              {/* 좋아요 (모든 작품에 표시) */}
              <TouchableOpacity style={styles.ownerControlButton} onPress={handleLike}>
                <Feather
                  name="heart"
                  size={18}
                  color={isLiked ? '#FF7A5C' : 'rgba(255,255,255,0.9)'}
                  fill={isLiked ? '#FF7A5C' : 'transparent'}
                />
                <Text style={styles.ownerControlText}>{likeCount}</Text>
              </TouchableOpacity>

              {/* 수정 (본인 작품만) */}
              {isOwner && (
                <TouchableOpacity
                  style={styles.ownerControlButton}
                  onPress={() => {
                    Alert.alert('작품 관리', null, [
                      { text: '취소', style: 'cancel' },
                      { text: '수정', onPress: () => onEdit(item) },
                      { text: '삭제', style: 'destructive', onPress: () => onDelete(item.id) },
                    ]);
                  }}
                >
                  <Feather name="more-horizontal" size={18} color="rgba(255,255,255,0.9)" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* 댓글 버튼 */}
          <TouchableOpacity
            style={styles.commentButton}
            onPress={() => setIsCommentsModalVisible(true)}
          >
            <Feather name="message-circle" size={16} color="#fff" />
            <Text style={styles.commentButtonText}>
              댓글 {comments.length}개 {comments.length > 0 ? '보기' : '달기'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 댓글 모달 */}
      <Modal
        visible={isCommentsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsCommentsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            style={styles.modalContainer}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            {/* 모달 헤더 */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>댓글 {comments.length}</Text>
              <TouchableOpacity onPress={() => setIsCommentsModalVisible(false)}>
                <Feather name="x" size={24} color="#1f2937" />
              </TouchableOpacity>
            </View>

            {/* 댓글 목록 */}
            <FlatList
              data={comments}
              keyExtractor={(comment) => comment.id}
              renderItem={({ item: comment }) => (
                <View style={styles.modalCommentItem}>
                  <Text style={styles.modalCommentUser}>{comment.userName}</Text>
                  <Text style={styles.modalCommentContent}>{comment.content}</Text>
                  <Text style={styles.modalCommentTime}>
                    {new Date(comment.createdAt).toLocaleString('ko-KR', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </Text>
                </View>
              )}
              contentContainerStyle={styles.modalCommentList}
              ListEmptyComponent={
                <View style={styles.modalEmptyState}>
                  <Feather name="message-circle" size={48} color="#cbd5e1" />
                  <Text style={styles.modalEmptyText}>첫 댓글을 남겨보세요!</Text>
                </View>
              }
            />

            {/* 댓글 입력 */}
            {currentUser && (
              <View style={styles.modalInputContainer}>
                <TextInput
                  style={styles.modalInput}
                  placeholder="댓글을 입력하세요..."
                  placeholderTextColor="#9ca3af"
                  value={newComment}
                  onChangeText={setNewComment}
                  multiline
                  maxLength={500}
                />
                <TouchableOpacity
                  style={[
                    styles.modalSendButton,
                    !newComment.trim() && styles.modalSendButtonDisabled
                  ]}
                  onPress={handleAddComment}
                  disabled={!newComment.trim()}
                >
                  <Feather name="send" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </TouchableOpacity>
  );
};

// 메인 갤러리 릴스 화면
export default function GalleryReelsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const flatListRef = useRef(null);

  const [galleryItems, setGalleryItems] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // 데이터 로드
  const loadData = async () => {
    try {
      setLoading(true);
      console.log('[갤러리 릴스] 데이터 로딩 시작...');

      const [items, user] = await Promise.all([
        getAllGalleryItems(),
        getCurrentUser().catch(() => null),
      ]);

      setGalleryItems(items);
      setCurrentUser(user);

      // 초기 인덱스 찾기
      if (id) {
        const index = items.findIndex(item => item.id === id);
        if (index !== -1) {
          setCurrentIndex(index);
          // FlatList 스크롤
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index, animated: false });
          }, 100);
        }
      }

      console.log('[갤러리 릴스] 작품 로드:', items.length, '개');
    } catch (error) {
      console.error('[갤러리 릴스] 로딩 실패:', error);
      Alert.alert('오류', error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  // 화면 포커스 시 재로드
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleLike = async (itemId) => {
    try {
      const result = await toggleGalleryLike(itemId);

      // 목록 업데이트
      setGalleryItems(prev => prev.map(item =>
        item.id === itemId
          ? { ...item, likes: result.likes }
          : item
      ));

      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsEditModalVisible(true);
  };

  const handleDelete = (itemId) => {
    Alert.alert(
      '작품 삭제',
      '정말 이 작품을 삭제하시겠습니까?\n삭제된 작품은 복구할 수 없습니다.',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteGalleryItem(itemId);
              Alert.alert('성공', '작품이 삭제되었습니다.');
              loadData();
            } catch (error) {
              console.error('[삭제 실패]', error);
              Alert.alert('오류', error.message);
            }
          },
        },
      ]
    );
  };

  const handleUpdateSuccess = () => {
    setIsEditModalVisible(false);
    setEditingItem(null);
    loadData();
  };

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index || 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF7A5C" />
        <Text style={styles.loadingText}>작품 불러오는 중...</Text>
      </View>
    );
  }

  if (!galleryItems.length) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Feather name="image" size={64} color="#cbd5e1" />
        <Text style={styles.emptyText}>아직 업로드된 작품이 없습니다</Text>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>돌아가기</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={galleryItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <GalleryReelItem
            item={item}
            currentUser={currentUser}
            onLike={handleLike}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isActive={index === currentIndex}
          />
        )}
        pagingEnabled
        showsVerticalScrollIndicator={false}
        snapToInterval={SCREEN_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(data, index) => ({
          length: SCREEN_HEIGHT,
          offset: SCREEN_HEIGHT * index,
          index,
        })}
        initialScrollIndex={currentIndex}
        onScrollToIndexFailed={() => {
          // 스크롤 실패 시 재시도
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({ index: currentIndex, animated: false });
          }, 100);
        }}
      />

      {/* 수정 모달 */}
      {isEditModalVisible && editingItem && (
        <UploadGalleryModal
          visible={isEditModalVisible}
          onClose={() => {
            setIsEditModalVisible(false);
            setEditingItem(null);
          }}
          onUploadSuccess={handleUpdateSuccess}
          editingItem={editingItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#fff',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    fontSize: 18,
    color: '#fff',
    marginBottom: 24,
  },
  backButtonText: {
    color: '#FF7A5C',
    fontSize: 16,
    fontWeight: '600',
  },

  // 릴스 아이템
  reelContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
  },
  media: {
    width: '100%',
    height: '100%',
  },

  // 우측 액션 - 위치 및 시인성 개선
  rightActions: {
    position: 'absolute',
    right: 16,
    bottom: SCREEN_HEIGHT * 0.35, // 하단 정보 위에 여유있게 배치
    alignItems: 'center',
    gap: 24,
    zIndex: 10, // 다른 요소들 위에 표시
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionButtonWithBg: {
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // 반투명 검은 배경
    padding: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionTextBold: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  // 프로그레스 바
  progressBarContainer: {
    position: 'absolute',
    bottom: 60,
    left: 12,
    right: 70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 16,
  },
  progressBar: {
    flex: 1,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF7A5C',
    borderRadius: 2,
  },
  progressTime: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
    minWidth: 60,
    textAlign: 'right',
  },

  // 하단 정보 (Instagram Reels 스타일) - 고정 크기
  bottomInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 180, // 고정 높이 (커지거나 작아지지 않음)
    backgroundColor: 'rgba(0,0,0,0.85)',
  },
  bottomInfoContent: {
    padding: 16,
    paddingBottom: 20,
  },
  captionText: {
    fontSize: 14,
    color: '#fff',
    lineHeight: 20,
    marginBottom: 4,
  },
  userName: {
    fontWeight: '700',
    color: '#fff',
  },
  titleText: {
    fontWeight: '600',
    color: '#fff',
  },
  descriptionText: {
    fontSize: 13,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 18,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // 좌우 정렬
    marginBottom: 12,
  },
  metaLeftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  hobbyTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 122, 92, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF7A5C',
  },
  hobbyText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FF7A5C',
  },
  viewsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },

  // 본인 작품 컨트롤 (하단 우측)
  ownerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  ownerControlButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  ownerControlText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },

  // 댓글 버튼
  commentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  commentButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },

  // 댓글 모달
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: SCREEN_HEIGHT * 0.75, // 화면의 75%
    paddingTop: 8,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  modalCommentList: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  modalCommentItem: {
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  modalCommentUser: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FF7A5C',
    marginBottom: 6,
  },
  modalCommentContent: {
    fontSize: 14,
    color: '#1f2937',
    lineHeight: 20,
    marginBottom: 6,
  },
  modalCommentTime: {
    fontSize: 11,
    color: '#9ca3af',
  },
  modalEmptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  modalEmptyText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 12,
  },
  modalInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  modalInput: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1f2937',
    maxHeight: 100,
  },
  modalSendButton: {
    backgroundColor: '#FF7A5C',
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalSendButtonDisabled: {
    backgroundColor: '#cbd5e1',
  },
});
