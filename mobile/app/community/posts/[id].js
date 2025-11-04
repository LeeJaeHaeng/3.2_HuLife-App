import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Share,
  TextInput,
  Platform,
  DeviceEventEmitter,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getPostByIdAPI, getPostCommentsAPI, createCommentAPI, togglePostLikeAPI, updateCommentAPI, deleteCommentAPI, updatePostAPI, deletePostAPI } from '../../../api/communityService';
import { getCurrentUser } from '../../../api/authService';
import { logActivity, ActivityTypes } from '../../../api/activityService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const IMAGE_WIDTH = SCREEN_WIDTH - 32; // 16px padding on each side

export default function PostDetailPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');

  // Activity tracking: duration measurement
  const startTimeRef = useRef(null);

  useEffect(() => {
    loadPost();
    loadComments();
    loadCurrentUser();

    // Start tracking view duration
    startTimeRef.current = Date.now();

    // Cleanup: log activity with duration when leaving the screen
    return () => {
      if (startTimeRef.current && id) {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000); // seconds
        logActivity(ActivityTypes.VIEW_POST, id, { duration });
      }
    };
  }, [id]);

  const loadCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('[사용자 정보 로드 실패]', error);
      setCurrentUser(null);
    }
  };

  // 🔔 전역 이벤트 리스너: 다른 화면에서 돌아왔을 때 좋아요 상태 유지
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('POST_LIKE_CHANGED', (data) => {
      if (data.postId === id) {
        console.log('[게시글 상세] 🔔 좋아요 상태 변경 이벤트 수신 (자신):', data);
        setLikes(data.likes);
        setLiked(data.liked);
      }
    });

    return () => {
      subscription.remove();
    };
  }, [id]);

  const handleLike = async () => {
    const newLiked = !liked;
    const newLikes = newLiked ? likes + 1 : likes - 1;

    // Optimistic UI update
    setLiked(newLiked);
    setLikes(newLikes);

    try {
      // API 호출하여 서버에 좋아요 상태 저장
      const response = await togglePostLikeAPI(id);
      console.log('[게시글 상세] 좋아요 API 응답:', response);

      // 서버 응답으로 정확한 좋아요 수 업데이트
      if (response && typeof response.likesCount !== 'undefined') {
        setLikes(response.likesCount);
        setLiked(response.liked);
      }

      // 🔔 전역 이벤트 발송: 게시글 목록에 좋아요 변경 알림
      DeviceEventEmitter.emit('POST_LIKE_CHANGED', {
        postId: id,
        likes: response.likesCount || newLikes,
        liked: response.liked !== undefined ? response.liked : newLiked
      });
      console.log('[게시글 상세] 좋아요 상태 변경 이벤트 발송:', { postId: id, likes: response.likesCount });
    } catch (error) {
      console.error('[게시글 좋아요] API 호출 실패:', error);
      // Revert optimistic update on error
      setLiked(!newLiked);
      setLikes(!newLiked ? likes + 1 : likes - 1);
      Alert.alert('오류', '좋아요 처리에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${post.title}\n\n${post.content}`,
        title: post.title,
      });
    } catch (error) {
      console.error('[게시글 공유] 실패:', error);
    }
  };

  const loadPost = async () => {
    try {
      setLoading(true);
      const postData = await getPostByIdAPI(id);
      setPost(postData);
      setLikes(postData.likes || 0);
      setLiked(postData.isLiked || false);
      console.log('[게시글 상세] 데이터 로드 성공:', postData.title, '좋아요 상태:', postData.isLiked);
    } catch (error) {
      console.error('[게시글 상세] 데이터 로드 실패:', error);
      Alert.alert('오류', error.message || '게시글을 불러올 수 없습니다.');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const commentsData = await getPostCommentsAPI(id);
      setComments(commentsData);
      console.log('[댓글] 데이터 로드 성공:', commentsData.length, '개');
    } catch (error) {
      console.error('[댓글] 데이터 로드 실패:', error);
      // 댓글 로딩 실패해도 계속 진행 (빈 배열 유지)
      setComments([]);
    }
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim()) {
      Alert.alert('알림', '댓글 내용을 입력해주세요.');
      return;
    }

    try {
      setSubmittingComment(true);
      await createCommentAPI(id, commentText.trim());
      setCommentText('');
      await loadComments();

      // Update post comment count
      if (post) {
        setPost({ ...post, comments: post.comments + 1 });
      }

      Alert.alert('성공', '댓글이 작성되었습니다.');
    } catch (error) {
      console.error('[댓글 작성] 실패:', error);
      Alert.alert('오류', error.message || '댓글 작성에 실패했습니다.');
    } finally {
      setSubmittingComment(false);
    }
  };

  // Edit comment
  const handleEditComment = (comment) => {
    if (!currentUser || currentUser.id !== comment.userId) {
      Alert.alert('오류', '본인의 댓글만 수정할 수 있습니다.');
      return;
    }
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.content);
  };

  // Save edited comment
  const handleSaveEditComment = async (commentId) => {
    if (!editingCommentText.trim()) {
      Alert.alert('알림', '댓글 내용을 입력해주세요.');
      return;
    }

    try {
      await updateCommentAPI(commentId, editingCommentText.trim());
      setEditingCommentId(null);
      setEditingCommentText('');
      await loadComments();
      Alert.alert('성공', '댓글이 수정되었습니다.');
    } catch (error) {
      console.error('[댓글 수정] 실패:', error);
      Alert.alert('오류', error.message || '댓글 수정에 실패했습니다.');
    }
  };

  // Cancel edit comment
  const handleCancelEditComment = () => {
    setEditingCommentId(null);
    setEditingCommentText('');
  };

  // Delete comment
  const handleDeleteComment = (commentId, commentUserId) => {
    if (!currentUser || currentUser.id !== commentUserId) {
      Alert.alert('오류', '본인의 댓글만 삭제할 수 있습니다.');
      return;
    }

    Alert.alert(
      '댓글 삭제',
      '정말 이 댓글을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCommentAPI(commentId);
              await loadComments();
              // Update post comment count
              if (post) {
                setPost({ ...post, comments: Math.max(0, post.comments - 1) });
              }
              Alert.alert('성공', '댓글이 삭제되었습니다.');
            } catch (error) {
              console.error('[댓글 삭제] 실패:', error);
              Alert.alert('오류', error.message || '댓글 삭제에 실패했습니다.');
            }
          },
        },
      ]
    );
  };

  // Delete post
  const handleDeletePost = () => {
    if (!currentUser || !post || currentUser.id !== post.userId) {
      Alert.alert('오류', '본인의 게시글만 삭제할 수 있습니다.');
      return;
    }

    Alert.alert(
      '게시글 삭제',
      '정말 이 게시글을 삭제하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePostAPI(id);
              Alert.alert('성공', '게시글이 삭제되었습니다.');
              router.back();
            } catch (error) {
              console.error('[게시글 삭제] 실패:', error);
              Alert.alert('오류', error.message || '게시글 삭제에 실패했습니다.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF7A5C" />
          <Text style={styles.loadingText}>로딩 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>게시글을 찾을 수 없습니다.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>게시글</Text>
        {currentUser && post && currentUser.id === post.userId ? (
          <TouchableOpacity onPress={handleDeletePost} style={styles.headerButton}>
            <Ionicons name="trash-outline" size={24} color="#ef4444" />
          </TouchableOpacity>
        ) : (
          <View style={{ width: 24 }} />
        )}
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
        extraScrollHeight={20}
        keyboardShouldPersistTaps="handled"
      >
        {/* Category Badge */}
        <View style={styles.categoryContainer}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{post.category}</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>{post.title}</Text>

        {/* Author & Date */}
        <View style={styles.metaContainer}>
          <View style={styles.authorContainer}>
            <View style={styles.avatar}>
              {post.userImage ? (
                <Image
                  source={{ uri: post.userImage }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.avatarText}>{post.userName?.[0] || 'U'}</Text>
              )}
            </View>
            <View style={styles.authorInfo}>
              <Text style={styles.authorName}>{post.userName}</Text>
              <Text style={styles.postDate}>
                {new Date(post.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Ionicons name="eye-outline" size={18} color="#666" />
            <Text style={styles.statText}>조회 {post.views}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="heart-outline" size={18} color="#666" />
            <Text style={styles.statText}>좋아요 {likes}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="chatbubble-outline" size={18} color="#666" />
            <Text style={styles.statText}>댓글 {post.comments}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.contentText}>{post.content}</Text>
        </View>

        {/* Images */}
        {post.images && post.images.length > 0 && (
          <View style={styles.imagesContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              decelerationRate="fast"
              snapToInterval={IMAGE_WIDTH + 12}
              contentContainerStyle={styles.imagesScrollContent}
            >
              {post.images.map((imageBase64, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image
                    source={{ uri: imageBase64 }}
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                  <View style={styles.imageCounter}>
                    <Text style={styles.imageCounterText}>{index + 1} / {post.images.length}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.divider} />

        {/* Action Buttons */}
        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={24}
              color={liked ? "#FF0000" : "#FF7A5C"}
            />
            <Text style={[styles.actionButtonText, liked && styles.likedText]}>
              좋아요 {likes}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color="#666" />
            <Text style={styles.actionButtonText}>공유</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Comments Section */}
        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>댓글 {comments.length}개</Text>
          {comments.length === 0 ? (
            <View style={styles.noComments}>
              <Ionicons name="chatbubble-outline" size={48} color="#ccc" />
              <Text style={styles.noCommentsText}>첫 번째 댓글을 작성해보세요!</Text>
            </View>
          ) : (
            <View style={styles.commentsList}>
              {comments.map((comment) => (
                <View key={comment.id} style={styles.commentItem}>
                  <View style={styles.commentAvatar}>
                    {comment.userImage ? (
                      <Image
                        source={{ uri: comment.userImage }}
                        style={styles.commentAvatarImage}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.commentAvatarText}>{comment.userName?.[0] || 'U'}</Text>
                    )}
                  </View>
                  <View style={styles.commentContent}>
                    <View style={styles.commentHeader}>
                      <Text style={styles.commentAuthor}>{comment.userName}</Text>
                      <View style={styles.commentHeaderRight}>
                        <Text style={styles.commentDate}>
                          {new Date(comment.createdAt).toLocaleDateString('ko-KR', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Text>
                        {currentUser && currentUser.id === comment.userId && (
                          <View style={styles.commentActions}>
                            <TouchableOpacity
                              onPress={() => handleEditComment(comment)}
                              style={styles.commentActionButton}
                            >
                              <Ionicons name="create-outline" size={16} color="#3b82f6" />
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => handleDeleteComment(comment.id, comment.userId)}
                              style={styles.commentActionButton}
                            >
                              <Ionicons name="trash-outline" size={16} color="#ef4444" />
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </View>
                    {editingCommentId === comment.id ? (
                      <View style={styles.editCommentContainer}>
                        <TextInput
                          style={styles.editCommentInput}
                          value={editingCommentText}
                          onChangeText={setEditingCommentText}
                          multiline
                          maxLength={500}
                          autoFocus
                        />
                        <View style={styles.editCommentActions}>
                          <TouchableOpacity
                            onPress={handleCancelEditComment}
                            style={styles.cancelButton}
                          >
                            <Text style={styles.cancelButtonText}>취소</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => handleSaveEditComment(comment.id)}
                            style={styles.saveButton}
                          >
                            <Text style={styles.saveButtonText}>저장</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <Text style={styles.commentText}>{comment.content}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Comment Input - 내부에 배치하여 스크롤과 함께 이동 */}
        <View style={styles.commentInputContainer}>
          <TextInput
            style={styles.commentInput}
            placeholder="댓글을 입력하세요..."
            value={commentText}
            onChangeText={setCommentText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !commentText.trim() && styles.sendButtonDisabled]}
            onPress={handleSubmitComment}
            disabled={!commentText.trim() || submittingComment}
          >
            {submittingComment ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="send" size={20} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
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
  categoryContainer: {
    padding: 16,
    paddingBottom: 8,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingHorizontal: 16,
    paddingVertical: 8,
    lineHeight: 32,
  },
  metaContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FF7A5C',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 48,
    height: 48,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  postDate: {
    fontSize: 14,
    color: '#999',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: '#666',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  contentText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 26,
  },
  imagesContainer: {
    marginTop: 16,
  },
  imagesScrollContent: {
    paddingHorizontal: 16,
  },
  imageWrapper: {
    width: IMAGE_WIDTH,
    marginRight: 12,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: IMAGE_WIDTH * 0.75, // 4:3 aspect ratio
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  imageCounter: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  imageCounterText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  actionButton: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 12,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    color: '#666',
  },
  likedText: {
    color: '#FF0000',
    fontWeight: 'bold',
  },
  commentsSection: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  commentsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  noComments: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noCommentsText: {
    fontSize: 14,
    color: '#999',
    marginTop: 12,
  },
  commentsList: {
    gap: 16,
  },
  commentItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  commentAvatarImage: {
    width: 36,
    height: 36,
  },
  commentAvatarText: {
    color: '#666',
    fontSize: 16,
    fontWeight: '600',
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  commentHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  commentAuthor: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  commentDate: {
    fontSize: 12,
    color: '#999',
  },
  commentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  commentActionButton: {
    padding: 4,
  },
  editCommentContainer: {
    marginTop: 8,
  },
  editCommentInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    maxHeight: 100,
    borderWidth: 1,
    borderColor: '#FF7A5C',
  },
  editCommentActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
  },
  cancelButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '600',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#FF7A5C',
  },
  saveButtonText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  commentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginRight: 8,
    maxHeight: 100,
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FF7A5C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});
