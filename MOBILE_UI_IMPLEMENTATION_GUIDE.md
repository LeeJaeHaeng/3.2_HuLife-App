# 모바일 UI 구현 가이드

## 📋 개요
이 문서는 백엔드 API와 모바일 API 서비스가 완성된 후, UI 구현을 위한 상세 가이드입니다.

---

## ✅ 완성된 작업

### 1. 백엔드 API (100% 완성)
- ✅ 댓글 수정/삭제: `PUT/DELETE /api/posts/comments/[commentId]`
- ✅ 게시글 수정/삭제: `PUT/DELETE /api/posts/[id]`
- ✅ 일정 수정/삭제: `PUT/DELETE /api/user/schedules/[scheduleId]`
- ✅ 리뷰 수정/삭제: `PUT/DELETE /api/hobbies/reviews/[reviewId]`
- ✅ 모임 수정/삭제: `PUT/DELETE /api/communities/[id]`
- ✅ 학습 진행도 업데이트: `PUT /api/user/hobbies/[hobbyId]`
- ✅ 커리큘럼 진행: `POST/GET /api/user/hobbies/[hobbyId]/curriculum`
- ✅ 학습 통계: `GET /api/user/learning-stats`

### 2. 모바일 API 서비스 (100% 완성)
**파일: `mobile/api/communityService.js`**
- `updatePostAPI(postId, postData)` - 게시글 수정
- `deletePostAPI(postId)` - 게시글 삭제
- `updateCommentAPI(commentId, content)` - 댓글 수정
- `deleteCommentAPI(commentId)` - 댓글 삭제
- `updateCommunityAPI(communityId, data)` - 모임 수정
- `deleteCommunityAPI(communityId)` - 모임 삭제

**파일: `mobile/api/userService.js`**
- `updateScheduleAPI(scheduleId, data)` - 일정 수정
- `deleteScheduleAPI(scheduleId)` - 일정 삭제
- `updateHobbyProgressAPI(hobbyId, progress, status)` - 학습 진행도 업데이트
- `updateCurriculumProgressAPI(hobbyId, week, action)` - 커리큘럼 주차 완료/취소
- `getCurriculumProgressAPI(hobbyId)` - 커리큘럼 진행 상황 조회
- `getLearningStatsAPI()` - 학습 통계 조회

**파일: `mobile/api/hobbyService.js`**
- `updateHobbyReview(reviewId, data)` - 리뷰 수정
- `deleteHobbyReview(reviewId)` - 리뷰 삭제

---

## 🎨 UI 구현 패턴

### 패턴 1: 게시글/댓글 수정/삭제 버튼

#### 1.1 게시글 상세 화면 (`mobile/app/community/posts/[id].js`)

**추가할 State:**
```javascript
const [currentUser, setCurrentUser] = useState(null);
const [isAuthor, setIsAuthor] = useState(false);
```

**사용자 확인:**
```javascript
useEffect(() => {
  const checkUser = async () => {
    const user = await getCurrentUser();
    setCurrentUser(user);
    setIsAuthor(post?.userId === user?.id);
  };
  if (post) checkUser();
}, [post]);
```

**수정 버튼 (게시글 작성자만 표시):**
```javascript
{isAuthor && (
  <View style={styles.authorActions}>
    <TouchableOpacity
      style={styles.editButton}
      onPress={() => router.push(`/community/posts/edit/${id}`)}
    >
      <Ionicons name="create-outline" size={20} color="#FF7A5C" />
      <Text style={styles.editButtonText}>수정</Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={styles.deleteButton}
      onPress={handleDeletePost}
    >
      <Ionicons name="trash-outline" size={20} color="#FF3B30" />
      <Text style={styles.deleteButtonText}>삭제</Text>
    </TouchableOpacity>
  </View>
)}
```

**삭제 핸들러:**
```javascript
const handleDeletePost = () => {
  Alert.alert(
    '게시글 삭제',
    '정말 삭제하시겠습니까?',
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
            Alert.alert('오류', error.message);
          }
        },
      },
    ]
  );
};
```

#### 1.2 댓글에 수정/삭제 버튼 추가

**댓글 렌더링 수정:**
```javascript
const renderComment = ({ item }) => {
  const isCommentAuthor = currentUser?.id === item.userId;

  return (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <Text style={styles.commentAuthor}>{item.userName}</Text>
        <Text style={styles.commentDate}>
          {new Date(item.createdAt).toLocaleDateString('ko-KR')}
        </Text>
      </View>

      {editingCommentId === item.id ? (
        // 수정 모드
        <View style={styles.editCommentContainer}>
          <TextInput
            style={styles.editCommentInput}
            value={editCommentText}
            onChangeText={setEditCommentText}
            multiline
          />
          <View style={styles.editCommentActions}>
            <TouchableOpacity onPress={() => handleSaveComment(item.id)}>
              <Text style={styles.saveButton}>저장</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setEditingCommentId(null)}>
              <Text style={styles.cancelButton}>취소</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // 일반 모드
        <>
          <Text style={styles.commentText}>{item.content}</Text>
          {isCommentAuthor && (
            <View style={styles.commentActions}>
              <TouchableOpacity onPress={() => handleEditComment(item)}>
                <Ionicons name="create-outline" size={16} color="#666" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteComment(item.id)}>
                <Ionicons name="trash-outline" size={16} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
    </View>
  );
};
```

**댓글 수정/삭제 핸들러:**
```javascript
const [editingCommentId, setEditingCommentId] = useState(null);
const [editCommentText, setEditCommentText] = useState('');

const handleEditComment = (comment) => {
  setEditingCommentId(comment.id);
  setEditCommentText(comment.content);
};

const handleSaveComment = async (commentId) => {
  try {
    await updateCommentAPI(commentId, editCommentText);
    await loadComments(); // 댓글 목록 새로고침
    setEditingCommentId(null);
    Alert.alert('성공', '댓글이 수정되었습니다.');
  } catch (error) {
    Alert.alert('오류', error.message);
  }
};

const handleDeleteComment = (commentId) => {
  Alert.alert(
    '댓글 삭제',
    '정말 삭제하시겠습니까?',
    [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteCommentAPI(commentId);
            await loadComments();
            Alert.alert('성공', '댓글이 삭제되었습니다.');
          } catch (error) {
            Alert.alert('오류', error.message);
          }
        },
      },
    ]
  );
};
```

---

### 패턴 2: 학습 진행도 슬라이더

#### 2.1 학습 진행도 컴포넌트 (`mobile/components/ProgressSlider.js`)

**새 파일 생성:**
```javascript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';

export default function ProgressSlider({ value, onValueChange, disabled = false }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>학습 진행도</Text>
        <Text style={styles.value}>{value}%</Text>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={100}
        step={5}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor="#FF7A5C"
        maximumTrackTintColor="#E5E5E5"
        thumbTintColor="#FF7A5C"
        disabled={disabled}
      />

      <View style={styles.labels}>
        <Text style={styles.labelText}>시작</Text>
        <Text style={styles.labelText}>완료</Text>
      </View>

      {value === 100 && (
        <View style={styles.completeBadge}>
          <Text style={styles.completeText}>🎉 완료!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF7A5C',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  labelText: {
    fontSize: 12,
    color: '#999',
  },
  completeBadge: {
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    alignItems: 'center',
  },
  completeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
  },
});
```

#### 2.2 취미 상세 화면에서 사용 (`mobile/app/hobbies/[id].js`)

**State 추가:**
```javascript
const [progress, setProgress] = useState(0);
const [isLearning, setIsLearning] = useState(false);
```

**데이터 로드:**
```javascript
useEffect(() => {
  const loadProgress = async () => {
    try {
      const userHobbies = await getUserHobbiesAPI();
      const userHobby = userHobbies.find(h => h.hobbyId === id);
      if (userHobby) {
        setProgress(userHobby.progress || 0);
        setIsLearning(userHobby.status === 'learning');
      }
    } catch (error) {
      console.error('진행도 로드 실패:', error);
    }
  };
  loadProgress();
}, [id]);
```

**진행도 업데이트 핸들러:**
```javascript
const handleProgressChange = async (newProgress) => {
  setProgress(newProgress);

  try {
    await updateHobbyProgressAPI(id, newProgress);

    if (newProgress === 100) {
      Alert.alert('축하합니다!', '취미 학습을 완료했습니다! 🎉');
    }
  } catch (error) {
    Alert.alert('오류', error.message);
    // 실패 시 이전 값으로 복원
    setProgress(progress);
  }
};
```

**UI 표시:**
```javascript
{isLearning && (
  <ProgressSlider
    value={progress}
    onValueChange={handleProgressChange}
  />
)}
```

---

### 패턴 3: 커리큘럼 체크리스트

#### 3.1 커리큘럼 화면 (`mobile/app/hobbies/curriculum/[id].js`)

**새 화면 생성:**
```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getCurriculumProgressAPI, updateCurriculumProgressAPI } from '../../../api/userService';

export default function CurriculumScreen() {
  const { id } = useLocalSearchParams();
  const [curriculum, setCurriculum] = useState([]);
  const [completedWeeks, setCompletedWeeks] = useState(0);
  const [totalWeeks, setTotalWeeks] = useState(0);
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCurriculum();
  }, [id]);

  const loadCurriculum = async () => {
    try {
      const data = await getCurriculumProgressAPI(id);
      setCurriculum(data.curriculum);
      setCompletedWeeks(data.completedWeeks);
      setTotalWeeks(data.totalWeeks);
      setProgress(data.progress);
    } catch (error) {
      Alert.alert('오류', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWeek = async (week, isCompleted) => {
    try {
      const action = isCompleted ? 'uncomplete' : 'complete';
      const result = await updateCurriculumProgressAPI(id, week, action);

      setCompletedWeeks(result.completedWeeks);
      setProgress(result.userHobby.progress);

      Alert.alert(
        '성공',
        isCompleted ? '주차 완료가 취소되었습니다.' : '주차를 완료했습니다!'
      );
    } catch (error) {
      Alert.alert('오류', error.message);
    }
  };

  const renderWeek = (item) => {
    const isCompleted = item.week <= completedWeeks;

    return (
      <TouchableOpacity
        key={item.week}
        style={[styles.weekCard, isCompleted && styles.weekCardCompleted]}
        onPress={() => handleToggleWeek(item.week, isCompleted)}
      >
        <View style={styles.weekHeader}>
          <View style={styles.weekInfo}>
            <Ionicons
              name={isCompleted ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={isCompleted ? '#4CAF50' : '#999'}
            />
            <Text style={[styles.weekNumber, isCompleted && styles.weekNumberCompleted]}>
              {item.week}주차
            </Text>
          </View>
          {isCompleted && (
            <View style={styles.completeBadge}>
              <Text style={styles.completeText}>완료</Text>
            </View>
          )}
        </View>

        <Text style={styles.weekTitle}>{item.title}</Text>
        <Text style={styles.weekContent} numberOfLines={2}>
          {item.content}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* 진행도 헤더 */}
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>학습 진행도</Text>
        <Text style={styles.progressValue}>{progress}%</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressSubtext}>
          {completedWeeks}/{totalWeeks} 주차 완료
        </Text>
      </View>

      {/* 커리큘럼 목록 */}
      <View style={styles.weeksList}>
        {curriculum.map(renderWeek)}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  progressHeader: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF7A5C',
    marginBottom: 12,
  },
  progressBar: {
    height: 10,
    backgroundColor: '#E5E5E5',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FF7A5C',
  },
  progressSubtext: {
    fontSize: 14,
    color: '#666',
  },
  weeksList: {
    padding: 16,
  },
  weekCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E5E5E5',
  },
  weekCardCompleted: {
    borderColor: '#4CAF50',
    backgroundColor: '#F1F8F4',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  weekInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  weekNumber: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    color: '#333',
  },
  weekNumberCompleted: {
    color: '#4CAF50',
  },
  completeBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  completeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  weekContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
```

---

### 패턴 4: 일정 수정/삭제

#### 4.1 My-Page 화면 일정 탭 (`mobile/app/my-page.js`)

**일정 아이템에 롱프레스 추가:**
```javascript
const renderScheduleItem = (item) => (
  <TouchableOpacity
    style={styles.scheduleItem}
    onPress={() => router.push(`/schedule/${item.id}`)}
    onLongPress={() => handleScheduleLongPress(item)}
  >
    <View style={styles.scheduleHeader}>
      <Ionicons name="calendar-outline" size={20} color="#FF7A5C" />
      <Text style={styles.scheduleTitle}>{item.title}</Text>
    </View>
    <Text style={styles.scheduleDate}>
      {new Date(item.date).toLocaleDateString('ko-KR')} {item.time}
    </Text>
  </TouchableOpacity>
);

const handleScheduleLongPress = (schedule) => {
  Alert.alert(
    schedule.title,
    '작업을 선택하세요',
    [
      {
        text: '수정',
        onPress: () => router.push(`/schedule/edit/${schedule.id}`),
      },
      {
        text: '삭제',
        style: 'destructive',
        onPress: () => handleDeleteSchedule(schedule.id),
      },
      { text: '취소', style: 'cancel' },
    ]
  );
};

const handleDeleteSchedule = async (scheduleId) => {
  try {
    await deleteScheduleAPI(scheduleId);
    await loadSchedules(); // 일정 새로고침
    Alert.alert('성공', '일정이 삭제되었습니다.');
  } catch (error) {
    Alert.alert('오류', error.message);
  }
};
```

---

## 📝 구현 체크리스트

### 필수 화면 수정

- [ ] **게시글 상세** (`mobile/app/community/posts/[id].js`)
  - [ ] 수정/삭제 버튼 추가 (작성자만)
  - [ ] 댓글 수정/삭제 기능

- [ ] **취미 상세** (`mobile/app/hobbies/[id].js`)
  - [ ] 학습 진행도 슬라이더 추가
  - [ ] 커리큘럼 보기 버튼
  - [ ] 리뷰 수정/삭제 (작성자만)

- [ ] **마이페이지** (`mobile/app/my-page.js`)
  - [ ] 일정 롱프레스로 수정/삭제

- [ ] **대시보드** (`mobile/app/dashboard.js`)
  - [ ] 학습 통계 표시
  - [ ] 학습 진행도 시각화

- [ ] **모임 상세** (`mobile/app/community/[id].js`)
  - [ ] 모임 수정/삭제 (리더만)

### 추가 필요 패키지

```bash
npm install @react-native-community/slider
```

---

## 🎯 사용 예시

### 게시글 삭제
```javascript
import { deletePostAPI } from '../../../api/communityService';

const handleDelete = async (postId) => {
  try {
    await deletePostAPI(postId);
    Alert.alert('성공', '게시글이 삭제되었습니다.');
    router.back();
  } catch (error) {
    Alert.alert('오류', error.message);
  }
};
```

### 학습 진행도 업데이트
```javascript
import { updateHobbyProgressAPI } from '../../../api/userService';

const handleProgressUpdate = async (hobbyId, progress) => {
  try {
    const result = await updateHobbyProgressAPI(hobbyId, progress);
    console.log('업데이트 결과:', result);

    if (result.userHobby.status === 'completed') {
      Alert.alert('축하합니다!', '취미를 완료했습니다! 🎉');
    }
  } catch (error) {
    Alert.alert('오류', error.message);
  }
};
```

### 커리큘럼 주차 완료
```javascript
import { updateCurriculumProgressAPI } from '../../../api/userService';

const handleCompleteWeek = async (hobbyId, week) => {
  try {
    const result = await updateCurriculumProgressAPI(hobbyId, week, 'complete');
    console.log(`${week}주차 완료! 진행도: ${result.userHobby.progress}%`);
  } catch (error) {
    Alert.alert('오류', error.message);
  }
};
```

---

## 🔗 관련 파일

### API 서비스
- `mobile/api/communityService.js` - 게시글, 댓글, 모임
- `mobile/api/userService.js` - 일정, 학습 진행도
- `mobile/api/hobbyService.js` - 리뷰

### 화면
- `mobile/app/community/posts/[id].js` - 게시글 상세
- `mobile/app/hobbies/[id].js` - 취미 상세
- `mobile/app/my-page.js` - 마이페이지
- `mobile/app/dashboard.js` - 대시보드
- `mobile/app/community/[id].js` - 모임 상세

---

**작성일**: 2025-11-03
**작성자**: Claude (Sonnet 4.5)
