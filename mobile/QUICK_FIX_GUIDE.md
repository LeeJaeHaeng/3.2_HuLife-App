# ⚡ APK 빌드 수정 빠른 가이드

## 🎯 목표
APK로 실제 폰에서 테스트 시 모든 기능이 개발 환경과 **100% 동일**하게 작동하도록 수정

---

## ✅ 수정 완료된 파일

### 1. eas.json ✅
**파일**: `c:/HuLife_App/mobile/eas.json`

```json
"preview": {
  "distribution": "internal",
  "android": {
    "buildType": "apk"
  },
  "env": {
    "EXPO_PUBLIC_API_URL_PROD": "https://hulife-app-jaehaeng2001-2614-jaehaeng2001-2614s-projects.vercel.app"
  }
}
```

**변경 사항**:
- ❌ 삭제: `"EXPO_PUBLIC_API_URL": "https://hulife-project.vercel.app"`
- ✅ 추가: `"EXPO_PUBLIC_API_URL_PROD": "https://hulife-app..."`
- ✅ 추가: `"android": { "buildType": "apk" }`

---

## 🔧 수정 필요한 파일 (2개)

### 2. apiClient.js - getApiUrl() 함수 수정
**파일**: `c:/HuLife_App/mobile/api/apiClient.js`

**수정할 줄**: 6-45번째 줄 (getApiUrl 함수 전체)

**변경 방법**:
1. VS Code에서 `apiClient.js` 열기
2. 6번째 줄부터 45번째 줄까지 선택 (getApiUrl 함수 전체)
3. 아래 코드로 교체:

```javascript
// API URL - 환경별 자동 전환 (개발/프로덕션)
const getApiUrl = () => {
  // 🔍 빌드 환경 감지 (더 안정적인 방법)
  const isStandaloneBuild = Constants.executionEnvironment === 'standalone' ||
                             Constants.executionEnvironment === 'storeClient';
  const isDevelopment = __DEV__ && !isStandaloneBuild;

  console.log('[API Client] 🔍 환경 감지:', {
    __DEV__,
    executionEnvironment: Constants.executionEnvironment,
    isStandaloneBuild,
    isDevelopment
  });

  // 🎯 우선순위 1: APK/AAB 빌드는 무조건 PROD URL 사용
  if (isStandaloneBuild) {
    if (process.env.EXPO_PUBLIC_API_URL_PROD) {
      console.log('[API Client] ✅ [APK] 프로덕션 URL:', process.env.EXPO_PUBLIC_API_URL_PROD);
      return process.env.EXPO_PUBLIC_API_URL_PROD;
    }
    // APK 빌드인데 PROD URL이 없으면 에러!
    const prodUrl = 'https://hulife-app-jaehaeng2001-2614-jaehaeng2001-2614s-projects.vercel.app';
    console.error('[API Client] ❌ EXPO_PUBLIC_API_URL_PROD 없음! 하드코딩된 PROD URL 사용:', prodUrl);
    return prodUrl;
  }

  // 🎯 우선순위 2: 개발 환경 (Expo Go, npx expo start)
  if (isDevelopment) {
    if (process.env.EXPO_PUBLIC_API_URL_DEV) {
      console.log('[API Client] ✅ [DEV] 개발 URL:', process.env.EXPO_PUBLIC_API_URL_DEV);
      return process.env.EXPO_PUBLIC_API_URL_DEV;
    }
    // 개발 환경인데 DEV URL이 없으면 경고
    const devUrl = 'http://10.20.35.24:3000';
    console.warn('[API Client] ⚠️ EXPO_PUBLIC_API_URL_DEV 없음! 폴백 DEV URL 사용:', devUrl);
    return devUrl;
  }

  // 🎯 우선순위 3: 알 수 없는 환경 (PROD URL 사용)
  const fallbackUrl = process.env.EXPO_PUBLIC_API_URL_PROD ||
                      'https://hulife-app-jaehaeng2001-2614-jaehaeng2001-2614s-projects.vercel.app';
  console.warn('[API Client] ⚠️ 알 수 없는 환경. PROD URL 사용:', fallbackUrl);
  return fallbackUrl;
};
```

---

### 3. app.json - Android 권한 추가
**파일**: `c:/HuLife_App/mobile/app.json`

**수정할 줄**: 28-30번째 줄 (permissions 배열)

**변경 방법**:
1. VS Code에서 `app.json` 열기
2. 28번째 줄의 `"permissions"` 배열 찾기
3. 아래 코드로 교체:

```json
"permissions": [
  "android.permission.INTERNET",
  "android.permission.ACCESS_NETWORK_STATE",
  "android.permission.POST_NOTIFICATIONS"
],
```

**Before** ❌:
```json
"permissions": [
  "android.permission.POST_NOTIFICATIONS"
],
```

**After** ✅:
```json
"permissions": [
  "android.permission.INTERNET",
  "android.permission.ACCESS_NETWORK_STATE",
  "android.permission.POST_NOTIFICATIONS"
],
```

---

## 🚀 재배포 절차

### 1단계: 코드 수정 확인
```bash
# 터미널 열기
cd c:/HuLife_App/mobile

# 수정된 파일 확인
git status

# 예상 출력:
# modified:   eas.json
# modified:   api/apiClient.js
# modified:   app.json
```

### 2단계: Git 커밋 & 푸시
```bash
git add .
git commit -m "fix: APK 빌드 환경 변수 및 권한 수정

- eas.json: preview 프로필에 EXPO_PUBLIC_API_URL_PROD 설정
- apiClient.js: Constants.executionEnvironment 기반 안정적 환경 감지
- app.json: Android INTERNET 권한 명시

APK 빌드 시 PROD URL 강제 사용하도록 수정"

git push
```

### 3단계: APK 재빌드 (15-20분 소요)
```bash
npx eas-cli build --platform android --profile preview
```

**빌드 진행 중 확인사항**:
```
✔ Environment variables loaded from the "preview" build profile "env" configuration: EXPO_PUBLIC_API_URL_PROD.
```
→ 이 메시지가 보이면 성공!

### 4단계: APK 다운로드
```bash
# 빌드 완료 후 터미널에 APK 링크 표시
# 예: 🤖 Android app: https://expo.dev/artifacts/eas/xxxxx.apk

# 브라우저에서 해당 링크로 APK 다운로드
```

### 5단계: 실제 폰에서 테스트
1. APK 파일을 안드로이드 폰으로 전송
2. "출처를 알 수 없는 앱 설치" 허용
3. 앱 설치 및 실행
4. 아래 테스트 체크리스트 확인

---

## ✅ 테스트 체크리스트

### 필수 기능 테스트
- [ ] **로그인/회원가입** - 이메일/소셜 로그인
- [ ] **취미 목록** - 123개 취미 표시
- [ ] **취미 상세** - 이미지, 설명, 리뷰
- [ ] **커뮤니티 목록** - 모임 검색 및 필터
- [ ] **커뮤니티 상세** - 정보, 가입 신청
- [ ] **실시간 채팅** - WebSocket 연결 및 메시지 전송
- [ ] **게시판** - 글 작성/수정/삭제
- [ ] **갤러리** - 이미지 업로드 및 댓글
- [ ] **설문** - 8개 질문 응답
- [ ] **추천** - 매칭도 기반 추천 결과
- [ ] **프로필 수정** - 정보 업데이트
- [ ] **일정 관리** - 일정 추가/수정/삭제

### API 연결 확인
콘솔 로그 확인 (React Native Debugger 또는 adb logcat):

**성공** ✅:
```
[API Client] 🔍 환경 감지: { isStandaloneBuild: true, isDevelopment: false }
[API Client] ✅ [APK] 프로덕션 URL: https://hulife-app-jaehaeng2001-2614...
[API 클라이언트] 요청: GET https://hulife-app-jaehaeng2001-2614.../api/hobbies
[API 클라이언트] 응답 성공: 200 GET /hobbies
```

**실패** ❌:
```
[API Client] ⚠️ 폴백 DEV URL 사용: http://10.20.35.24:3000
[API 클라이언트] 요청: GET http://10.20.35.24:3000/api/hobbies
Network Error
```

---

## 🔍 문제 해결

### Q1: 여전히 로컬 IP(10.20.35.24)를 사용한다면?
**원인**: apiClient.js 수정이 적용되지 않음

**해결**:
```bash
# Metro bundler 캐시 클리어
cd c:/HuLife_App/mobile
rm -rf .expo node_modules/.cache

# 재빌드
npx eas-cli build --platform android --profile preview
```

### Q2: "EXPO_PUBLIC_API_URL_PROD가 undefined"라면?
**원인**: eas.json 수정이 적용되지 않음

**해결**:
```bash
# eas.json 확인
cat eas.json | grep EXPO_PUBLIC_API_URL_PROD

# 예상 출력:
# "EXPO_PUBLIC_API_URL_PROD": "https://hulife-app..."

# 없으면 다시 수정 후 재빌드
```

### Q3: "Network Error" 또는 "Request failed"
**원인**: Vercel 서버 문제 또는 CORS 설정

**확인**:
```bash
# Vercel 서버 정상 작동 확인
curl https://hulife-app-jaehaeng2001-2614-jaehaeng2001-2614s-projects.vercel.app/api/hobbies

# 200 OK 응답이 오면 정상
```

---

## 📋 최종 체크리스트

### 코드 수정 완료
- [x] eas.json - EXPO_PUBLIC_API_URL_PROD 설정
- [ ] apiClient.js - getApiUrl() 함수 수정
- [ ] app.json - Android 권한 추가

### 빌드 확인
- [ ] EAS Build 로그에서 EXPO_PUBLIC_API_URL_PROD 로드 확인
- [ ] APK 다운로드 성공

### 실행 확인
- [ ] APK 설치 성공
- [ ] 앱 실행 성공
- [ ] 콘솔 로그에서 PROD URL 사용 확인
- [ ] 모든 기능 정상 작동

---

## 🎯 결과

수정 후 APK를 실제 폰에서 실행하면:
- ✅ 로그인/회원가입 정상 작동
- ✅ 모든 API 요청 성공 (HTTPS://hulife-app...)
- ✅ 채팅, 게시판, 갤러리 모두 작동
- ✅ 개발 환경과 100% 동일한 기능

---

**작성일**: 2025-11-26
**버전**: 1.0
**다음 단계**: APK 재빌드 → 테스트 → Google Play Store 배포
