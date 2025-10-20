import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'http://10.20.35.102:3000/api';
const TOKEN_KEY = 'userToken';

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
  const requestUrl = `${API_URL}/posts`;
  console.log(`[API 서비스] 📞 게시글 작성 요청: ${requestUrl}`, postData);

  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await axios.post(requestUrl, postData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`[API 서비스] ✅ 게시글 작성 성공!`);
    return response.data;
  } catch (error) {
    console.error("[API 서비스] ❌ 게시글 작성 실패!:", error.response?.data?.error || error.message);
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
