import api from './apiClient';

// Get all communities (optionally filter by hobbyId)
export const getAllCommunitiesAPI = async (hobbyId = null) => {
  const requestUrl = hobbyId ? `/communities?hobbyId=${hobbyId}` : '/communities';
  console.log(`[API 서비스] 📞 커뮤니티 목록 요청: ${requestUrl}`);
  try {
    const response = await api.get(requestUrl);
    console.log(`[API 서비스] ✅ 커뮤니티 목록 응답 받음`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("[API 서비스] ❌ 커뮤니티 목록 요청 실패!:", error.response?.data?.error || error.message);
    console.warn("[API 서비스] ⚠️ 경고: 커뮤니티 목록 요청 실패. 빈 배열을 반환합니다.");
    return [];
  }
};

// Get community by ID
export const getCommunityByIdAPI = async (id) => {
  const requestUrl = `/communities/${id}`;
  console.log(`[API 서비스] 📞 커뮤니티 상세 정보 요청: ${requestUrl}`);
  try {
    const response = await api.get(requestUrl);
    console.log(`[API 서비스] ✅ 커뮤니티 상세 정보 응답 받음`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 커뮤니티 상세 정보 요청 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '커뮤니티 정보를 불러오는 중 오류가 발생했습니다.');
  }
};

// Request to join a community
export const requestJoinCommunityAPI = async (communityId) => {
  const requestUrl = `/communities/join`;
  console.log(`[API 서비스] 📞 커뮤니티 가입 신청: ${requestUrl}`, { communityId });
  try {
    const response = await api.post(requestUrl, { communityId });
    console.log(`[API 서비스] ✅ 커뮤니티 가입 신청 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 커뮤니티 가입 신청 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '커뮤니티 가입 신청 중 오류가 발생했습니다.');
  }
};

// Get all posts (optionally filter by category)
export const getAllPostsAPI = async (category = null) => {
  const requestUrl = category && category !== '전체' ? `/posts?category=${category}` : '/posts';
  console.log(`[API 서비스] 📞 게시글 목록 요청: ${requestUrl}`);
  try {
    const response = await api.get(requestUrl);
    console.log(`[API 서비스] ✅ 게시글 목록 응답 받음`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("[API 서비스] ❌ 게시글 목록 요청 실패!:", error.response?.data?.error || error.message);
    console.warn("[API 서비스] ⚠️ 경고: 게시글 목록 요청 실패. 빈 배열을 반환합니다.");
    return [];
  }
};

// Get post by ID
export const getPostByIdAPI = async (id) => {
  const requestUrl = `/posts/${id}`;
  console.log(`[API 서비스] 📞 게시글 상세 정보 요청: ${requestUrl}`);
  try {
    const response = await api.get(requestUrl);
    console.log(`[API 서비스] ✅ 게시글 상세 정보 응답 받음`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 게시글 상세 정보 요청 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '게시글 정보를 불러오는 중 오류가 발생했습니다.');
  }
};

// Create a new post
export const createPostAPI = async (postData) => {
  console.log(`[API 서비스] 📞 게시글 작성 시작`);
  if (!postData.title?.trim()) {
    throw new Error('제목을 입력해주세요.');
  }
  if (!postData.content?.trim()) {
    throw new Error('내용을 입력해주세요.');
  }
  try {
    const sanitizedData = {
      title: postData.title.trim(),
      content: postData.content.trim(),
      category: postData.category || '자유',
    };
    if (postData.images && Array.isArray(postData.images) && postData.images.length > 0) {
      sanitizedData.images = postData.images;
    }
    const response = await api.post('/posts', sanitizedData);
    console.log(`[API 서비스] ✅ 게시글 작성 성공! ID: ${response.data?.post?.id || 'unknown'}`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 게시글 작성 실패!");
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    }
    throw new Error(error.response?.data?.error || '게시글 작성 중 오류가 발생했습니다.');
  }
};

// Create a new community
export const createCommunityAPI = async (communityData) => {
  const requestUrl = `/communities`;
  console.log(`[API 서비스] 📞 커뮤니티 생성 요청: ${requestUrl}`, communityData);
  try {
    const response = await api.post(requestUrl, communityData);
    console.log(`[API 서비스] ✅ 커뮤니티 생성 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 커뮤니티 생성 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '커뮤니티 생성 중 오류가 발생했습니다.');
  }
};

// Get comments for a post
export const getPostCommentsAPI = async (postId) => {
  const requestUrl = `/posts/${postId}/comments`;
  console.log(`[API 서비스] 📞 댓글 목록 요청: ${requestUrl}`);
  try {
    const response = await api.get(requestUrl);
    console.log(`[API 서비스] ✅ 댓글 목록 응답 받음:`, response.data.length, '개');
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 댓글 목록 요청 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '댓글을 불러오는 중 오류가 발생했습니다.');
  }
};

// Create a new comment
export const createCommentAPI = async (postId, content) => {
  const requestUrl = `/posts/${postId}/comments`;
  console.log(`[API 서비스] 📞 댓글 작성 요청: ${requestUrl}`);
  try {
    const response = await api.post(requestUrl, { content });
    console.log(`[API 서비스] ✅ 댓글 작성 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 댓글 작성 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '댓글 작성 중 오류가 발생했습니다.');
  }
};

// Toggle like on a post
export const togglePostLikeAPI = async (postId) => {
  console.log(`[API 서비스] 📞 게시글 좋아요 토글 요청: ${postId}`);
  try {
    const response = await api.post(`/posts/${postId}/like`);
    console.log(`[API 서비스] ✅ 좋아요 토글 성공! liked: ${response.data.liked}`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 좋아요 토글 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '좋아요 처리 중 오류가 발생했습니다.');
  }
};

// Check if user liked a post
export const checkPostLikeAPI = async (postId) => {
  try {
    const response = await api.get(`/posts/${postId}/like`);
    return response.data.liked;
  } catch (error) {
    console.error("[API 서비스] ❌ 좋아요 확인 실패!:", error);
    return false;
  }
};

// Get or create chat room for a community
export const getCommunityChatRoomAPI = async (communityId) => {
  console.log(`[API 서비스] 📞 채팅방 조회/생성 요청: communityId=${communityId}`);
  try {
    const response = await api.get(`/communities/${communityId}/chat-room`);
    console.log(`[API 서비스] ✅ 채팅방 조회 성공! chatRoomId: ${response.data.id}`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 채팅방 조회 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '채팅방 조회에 실패했습니다.');
  }
};

// ==================== 수정/삭제 API ====================

// Update post
export const updatePostAPI = async (postId, postData) => {
  console.log(`[API 서비스] 📞 게시글 수정 요청: ${postId}`);
  try {
    const sanitizedData = {
      title: postData.title.trim(),
      content: postData.content.trim(),
      category: postData.category || '자유',
    };
    if (postData.images && Array.isArray(postData.images)) {
      sanitizedData.images = postData.images;
    }
    const response = await api.put(`/posts/${postId}`, sanitizedData);
    console.log(`[API 서비스] ✅ 게시글 수정 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 게시글 수정 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '게시글 수정 중 오류가 발생했습니다.');
  }
};

// Delete post
export const deletePostAPI = async (postId) => {
  console.log(`[API 서비스] 📞 게시글 삭제 요청: ${postId}`);
  try {
    const response = await api.delete(`/posts/${postId}`);
    console.log(`[API 서비스] ✅ 게시글 삭제 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 게시글 삭제 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '게시글 삭제 중 오류가 발생했습니다.');
  }
};

// Update comment
export const updateCommentAPI = async (commentId, content) => {
  console.log(`[API 서비스] 📞 댓글 수정 요청: ${commentId}`);
  try {
    const response = await api.put(`/posts/comments/${commentId}`, { content });
    console.log(`[API 서비스] ✅ 댓글 수정 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 댓글 수정 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '댓글 수정 중 오류가 발생했습니다.');
  }
};

// Delete comment
export const deleteCommentAPI = async (commentId) => {
  console.log(`[API 서비스] 📞 댓글 삭제 요청: ${commentId}`);
  try {
    const response = await api.delete(`/posts/comments/${commentId}`);
    console.log(`[API 서비스] ✅ 댓글 삭제 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 댓글 삭제 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '댓글 삭제 중 오류가 발생했습니다.');
  }
};

// Update community
export const updateCommunityAPI = async (communityId, communityData) => {
  console.log(`[API 서비스] 📞 모임 수정 요청: ${communityId}`);
  try {
    const response = await api.put(`/communities/${communityId}`, communityData);
    console.log(`[API 서비스] ✅ 모임 수정 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 모임 수정 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '모임 수정 중 오류가 발생했습니다.');
  }
};

// Delete community
export const deleteCommunityAPI = async (communityId) => {
  console.log(`[API 서비스] 📞 모임 삭제 요청: ${communityId}`);
  try {
    const response = await api.delete(`/communities/${communityId}`);
    console.log(`[API 서비스] ✅ 모임 삭제 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 모임 삭제 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '모임 삭제 중 오류가 발생했습니다.');
  }
};