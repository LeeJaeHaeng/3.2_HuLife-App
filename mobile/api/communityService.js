import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/api.config';

const API_URL = API_CONFIG.API_URL;
const TOKEN_KEY = 'userToken';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 - 오류 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('[API 서비스] 상세 오류 정보:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
        headers: error.config?.headers,
      },
    });
    return Promise.reject(error);
  }
);

// Get all communities (optionally filter by hobbyId)
export const getAllCommunitiesAPI = async (hobbyId = null) => {
  const requestUrl = hobbyId
    ? `${API_URL}/communities?hobbyId=${hobbyId}`
    : `${API_URL}/communities`;

  console.log(`[API 서비스] 📞 커뮤니티 목록 요청: ${requestUrl}`);

  try {
    const response = await axios.get(requestUrl);
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
  const requestUrl = `${API_URL}/communities/${id}`;
  console.log(`[API 서비스] 📞 커뮤니티 상세 정보 요청: ${requestUrl}`);

  try {
    const response = await axios.get(requestUrl);
    console.log(`[API 서비스] ✅ 커뮤니티 상세 정보 응답 받음`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 커뮤니티 상세 정보 요청 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '커뮤니티 정보를 불러오는 중 오류가 발생했습니다.');
  }
};

// Request to join a community
export const requestJoinCommunityAPI = async (communityId) => {
  const requestUrl = `${API_URL}/communities/join`;
  console.log(`[API 서비스] 📞 커뮤니티 가입 신청: ${requestUrl}`, { communityId });

  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await axios.post(requestUrl, { communityId }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`[API 서비스] ✅ 커뮤니티 가입 신청 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 커뮤니티 가입 신청 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '커뮤니티 가입 신청 중 오류가 발생했습니다.');
  }
};

// Get all posts (optionally filter by category)
export const getAllPostsAPI = async (category = null) => {
  const requestUrl = category && category !== '전체'
    ? `${API_URL}/posts?category=${category}`
    : `${API_URL}/posts`;

  console.log(`[API 서비스] 📞 게시글 목록 요청: ${requestUrl}`);

  try {
    const response = await axios.get(requestUrl);
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
  const requestUrl = `${API_URL}/posts/${id}`;
  console.log(`[API 서비스] 📞 게시글 상세 정보 요청: ${requestUrl}`);

  try {
    const response = await axios.get(requestUrl);
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

  // 기본적인 데이터 검증
  if (!postData.title?.trim()) {
    throw new Error('제목을 입력해주세요.');
  }

  if (!postData.content?.trim()) {
    throw new Error('내용을 입력해주세요.');
  }

  try {
    // 서버가 기대하는 형식으로만 데이터 전송 (title, content, category, images)
    const sanitizedData = {
      title: postData.title.trim(),
      content: postData.content.trim(),
      category: postData.category || '자유',
    };

    // images 필드는 배열 형식으로만 추가 (서버가 기대하는 형식)
    if (postData.images && Array.isArray(postData.images) && postData.images.length > 0) {
      sanitizedData.images = postData.images;
    }

    console.log('[API 서비스] 정제된 요청 데이터:', {
      title: sanitizedData.title,
      content: sanitizedData.content.substring(0, 50) + '...',
      category: sanitizedData.category,
      imagesCount: sanitizedData.images?.length || 0
    });

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
  const requestUrl = `${API_URL}/communities`;
  console.log(`[API 서비스] 📞 커뮤니티 생성 요청: ${requestUrl}`, communityData);

  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await axios.post(requestUrl, communityData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`[API 서비스] ✅ 커뮤니티 생성 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 커뮤니티 생성 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '커뮤니티 생성 중 오류가 발생했습니다.');
  }
};

// Get comments for a post
export const getPostCommentsAPI = async (postId) => {
  const requestUrl = `${API_URL}/posts/${postId}/comments`;
  console.log(`[API 서비스] 📞 댓글 목록 요청: ${requestUrl}`);

  try {
    const response = await axios.get(requestUrl);
    console.log(`[API 서비스] ✅ 댓글 목록 응답 받음:`, response.data.length, '개');
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 댓글 목록 요청 실패!:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '댓글을 불러오는 중 오류가 발생했습니다.');
  }
};

// Create a new comment
export const createCommentAPI = async (postId, content) => {
  const requestUrl = `${API_URL}/posts/${postId}/comments`;
  console.log(`[API 서비스] 📞 댓글 작성 요청: ${requestUrl}`);

  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await axios.post(requestUrl, { content }, {
      headers: { Authorization: `Bearer ${token}` }
    });

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
