import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_CONFIG } from '../config/api.config';

const API_URL = API_CONFIG.API_URL;
const TOKEN_KEY = 'userToken';

// ========== 갤러리 목록 조회 ==========

/**
 * 갤러리 목록 조회 (전체 또는 특정 취미)
 * @param {string} hobbyId - 선택적: 특정 취미의 작품만 조회
 * @returns {Promise<Array>} 갤러리 아이템 배열
 */
export const getAllGalleryItems = async (hobbyId = null) => {
  const url = hobbyId
    ? `${API_URL}/gallery?hobbyId=${hobbyId}`
    : `${API_URL}/gallery`;

  console.log(`[갤러리 서비스] 📞 갤러리 목록 요청: ${url}`);

  try {
    const response = await axios.get(url);
    console.log(`[갤러리 서비스] ✅ 갤러리 목록 응답: ${response.data.galleryItems?.length || 0}개`);
    return response.data.galleryItems || [];
  } catch (error) {
    console.error("[갤러리 서비스] ❌ 갤러리 목록 요청 실패:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '갤러리 목록을 불러오는데 실패했습니다.');
  }
};

// ========== 갤러리 작품 상세 조회 ==========

/**
 * 갤러리 작품 상세 조회 (조회수 자동 증가)
 * @param {string} id - 갤러리 아이템 ID
 * @returns {Promise<Object>} 갤러리 아이템
 */
export const getGalleryItemById = async (id) => {
  const url = `${API_URL}/gallery/${id}`;
  console.log(`[갤러리 서비스] 📞 작품 상세 요청: ${url}`);

  try {
    const response = await axios.get(url);
    console.log(`[갤러리 서비스] ✅ 작품 상세 응답 받음`);
    return response.data.galleryItem;
  } catch (error) {
    console.error("[갤러리 서비스] ❌ 작품 상세 요청 실패:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '작품을 불러오는데 실패했습니다.');
  }
};

// ========== 갤러리 작품 업로드 ==========

/**
 * 새로운 작품 업로드 (이미지 또는 동영상)
 * @param {Object} galleryData - { hobbyId, hobbyName, title, description, image, videoUrl }
 * @returns {Promise<Object>} 생성된 갤러리 아이템
 */
export const createGalleryItem = async (galleryData) => {
  const url = `${API_URL}/gallery`;
  console.log(`[갤러리 서비스] 📞 작품 업로드 요청:`, {
    hobbyId: galleryData.hobbyId,
    title: galleryData.title,
    mediaType: galleryData.videoUrl ? '동영상' : '이미지',
    imageSize: galleryData.image?.length || 0,
    videoUrl: galleryData.videoUrl || null
  });

  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await axios.post(url, galleryData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`[갤러리 서비스] ✅ 작품 업로드 성공`);
    return response.data.galleryItem;
  } catch (error) {
    console.error("[갤러리 서비스] ❌ 작품 업로드 실패:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '작품 업로드에 실패했습니다.');
  }
};

// ========== 갤러리 작품 수정 ==========

/**
 * 작품 정보 수정 (본인 작품만 가능)
 * @param {string} id - 갤러리 아이템 ID
 * @param {Object} updateData - { title, description, image (선택) }
 * @returns {Promise<Object>} 수정된 갤러리 아이템
 */
export const updateGalleryItem = async (id, updateData) => {
  const url = `${API_URL}/gallery/${id}`;
  console.log(`[갤러리 서비스] 📞 작품 수정 요청: ${url}`, updateData);

  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await axios.put(url, updateData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`[갤러리 서비스] ✅ 작품 수정 성공`);
    return response.data.galleryItem;
  } catch (error) {
    console.error("[갤러리 서비스] ❌ 작품 수정 실패:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '작품 수정에 실패했습니다.');
  }
};

// ========== 갤러리 작품 삭제 ==========

/**
 * 작품 삭제 (본인 작품만 가능)
 * @param {string} id - 갤러리 아이템 ID
 * @returns {Promise<Object>} 성공 메시지
 */
export const deleteGalleryItem = async (id) => {
  const url = `${API_URL}/gallery/${id}`;
  console.log(`[갤러리 서비스] 📞 작품 삭제 요청: ${url}`);

  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await axios.delete(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`[갤러리 서비스] ✅ 작품 삭제 성공`);
    return response.data;
  } catch (error) {
    console.error("[갤러리 서비스] ❌ 작품 삭제 실패:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '작품 삭제에 실패했습니다.');
  }
};

// ========== 좋아요 토글 ==========

/**
 * 작품 좋아요/좋아요 취소 토글
 * @param {string} id - 갤러리 아이템 ID
 * @returns {Promise<Object>} { isLiked, likes, message }
 */
export const toggleGalleryLike = async (id) => {
  const url = `${API_URL}/gallery/${id}/like`;
  console.log(`[갤러리 서비스] 📞 좋아요 토글 요청: ${url}`);

  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await axios.post(url, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log(`[갤러리 서비스] ✅ 좋아요 토글 성공: ${response.data.isLiked ? '추가' : '취소'}`);
    return response.data;
  } catch (error) {
    console.error("[갤러리 서비스] ❌ 좋아요 토글 실패:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '좋아요 처리에 실패했습니다.');
  }
};

// ========== 댓글 관련 ==========

/**
 * 작품 댓글 목록 조회
 * @param {string} galleryItemId - 갤러리 아이템 ID
 * @returns {Promise<Array>} 댓글 배열
 */
export const getGalleryComments = async (galleryItemId) => {
  const url = `${API_URL}/gallery/${galleryItemId}/comments`;
  console.log(`[갤러리 서비스] 📞 댓글 목록 요청: ${url}`);

  try {
    const response = await axios.get(url);
    console.log(`[갤러리 서비스] ✅ 댓글 목록 응답: ${response.data.length}개`);
    return response.data;
  } catch (error) {
    console.error("[갤러리 서비스] ❌ 댓글 목록 요청 실패:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '댓글을 불러오는데 실패했습니다.');
  }
};

/**
 * 작품 댓글 작성
 * @param {string} galleryItemId - 갤러리 아이템 ID
 * @param {string} content - 댓글 내용
 * @returns {Promise<Object>} 생성된 댓글
 */
export const createGalleryComment = async (galleryItemId, content) => {
  const url = `${API_URL}/gallery/${galleryItemId}/comments`;
  console.log(`[갤러리 서비스] 📞 댓글 작성 요청: ${url}`);

  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    if (!token) throw new Error("로그인이 필요합니다.");

    const response = await axios.post(url, { content }, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    console.log(`[갤러리 서비스] ✅ 댓글 작성 성공`);
    return response.data.comment;
  } catch (error) {
    console.error("[갤러리 서비스] ❌ 댓글 작성 실패:", error.response?.data?.error || error.message);
    throw new Error(error.response?.data?.error || '댓글 작성에 실패했습니다.');
  }
};
