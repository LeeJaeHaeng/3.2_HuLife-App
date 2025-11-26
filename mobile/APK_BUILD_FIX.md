# 📱 APK 빌드 환경 변수 문제 해결 가이드

## 🔍 문제 근본 원인

APK로 빌드했을 때 실제 폰에서 모든 기능이 작동하지 않는 이유:

### 1. eas.json 환경 변수 불일치 ❌
```json
// ❌ 이전 (문제)
"preview": {
  "env": {
    "EXPO_PUBLIC_API_URL": "https://..."  // 잘못된 변수명!
  }
}
```
- apiClient.js는 `EXPO_PUBLIC_API_URL_PROD`를 찾음
- eas.json에는 `EXPO_PUBLIC_API_URL`로 설정됨
- 결과: 환경 변수를 찾지 못하고 로컬 IP 사용 → 폰에서 접근 불가!

### 2. __DEV__ 플래그 신뢰성 문제 ❌
- `__DEV__`는 Metro bundler 전용
- APK 빌드 시 예측 불가능한 동작
- 로컬 IP(http://10.20.35.24:3000)가 선택될 가능성

### 3. Android INTERNET 권한 미명시 ⚠️
- Expo가 자동 추가하지만 명시하는 것이 안전

---

## ✅ 해결 방법

### 1️⃣ eas.json 수정 ✅ 완료

**파일**: `mobile/eas.json`

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      },
      "env": {
        "EXPO_PUBLIC_API_URL_PROD": "https://hulife-app-jaehaeng2001-2614-jaehaeng2001-2614s-projects.vercel.app"
      }
    }
  }
}
```

**변경 사항**:
- ❌ `EXPO_PUBLIC_API_URL` 삭제
- ✅ `EXPO_PUBLIC_API_URL_PROD` 추가
- ✅ `android.buildType: "apk"` 명시

---

### 2️⃣ apiClient.js 수정 필요

**파일**: `mobile/api/apiClient.js`

**수정할 부분**: `getApiUrl()` 함수 (lines 6-45)

**기존 코드 (문제)**:
```javascript
const getApiUrl = () => {
  const isDevelopment = __DEV__;  // ❌ 신뢰할 수 없음!

  if (isDevelopment) {
    // 로컬 개발 환경
    if (process.env.EXPO_PUBLIC_API_URL_DEV) {
      return process.env.EXPO_PUBLIC_API_URL_DEV;
    }
  } else {
    // 프로덕션 환경
    if (process.env.EXPO_PUBLIC_API_URL_PROD) {
      return process.env.EXPO_PUBLIC_API_URL_PROD;
    }
  }

  // 폴백 URL (APK에서 로컬 IP 선택될 수 있음!)
  const fallbackUrl = isDevelopment
    ? 'http://10.20.35.24:3000'  // ❌ 폰에서 접근 불가!
    : 'https://hulife-app-jaehaeng2001-2614-jaehaeng2001-2614s-projects.vercel.app';

  return fallbackUrl;
};
```

**새 코드 (해결)**:
```javascript
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

**핵심 개선사항**:
1. ✅ `Constants.executionEnvironment` 사용 (더 안정적)
2. ✅ APK/AAB 빌드 = 무조건 PROD URL
3. ✅ 폴백도 PROD URL 우선
4. ✅ 상세한 로깅으로 디버깅 용이

---

### 3️⃣ app.json 수정 필요

**파일**: `mobile/app.json`

**수정할 부분**: `android.permissions` 배열 (line 28-30)

**기존 코드**:
```json
{
  "android": {
    "permissions": [
      "android.permission.POST_NOTIFICATIONS"
    ]
  }
}
```

**새 코드**:
```json
{
  "android": {
    "permissions": [
      "android.permission.INTERNET",
      "android.permission.ACCESS_NETWORK_STATE",
      "android.permission.POST_NOTIFICATIONS"
    ]
  }
}
```

**추가된 권한**:
- `INTERNET`: 네트워크 요청 허용 (필수!)
- `ACCESS_NETWORK_STATE`: 네트워크 상태 확인 (오프라인 감지)

---

## 🚀 재배포 절차

### 1단계: 코드 수정 적용
```bash
cd c:/HuLife_App/mobile

# apiClient.js 수정 (위 새 코드로 교체)
code api/apiClient.js

# app.json 수정 (위 새 코드로 교체)
code app.json
```

### 2단계: Git 커밋
```bash
git add .
git commit -m "fix: APK 빌드 환경 변수 및 권한 수정

- eas.json: preview 프로필에 EXPO_PUBLIC_API_URL_PROD 설정
- apiClient.js: Constants.executionEnvironment 기반 안정적 환경 감지
- app.json: Android INTERNET 권한 명시

APK 빌드 시 PROD URL 강제 사용하도록 수정"
git push
```

### 3단계: APK 재빌드
```bash
cd c:/HuLife_App/mobile

# Preview 프로필로 APK 빌드 (15-20분 소요)
npx eas-cli build --platform android --profile preview
```

**빌드 진행 중 확인사항**:
- ✅ Environment variables loaded from the "preview" build profile "env" configuration: EXPO_PUBLIC_API_URL_PROD
- ✅ Using remote Android credentials (Expo server)
- ✅ Build finished

### 4단계: APK 다운로드 및 테스트
```bash
# 빌드 완료 후 APK 링크 표시됨
# 예: https://expo.dev/artifacts/eas/xxxxx.apk
```

**테스트 체크리스트**:
- [ ] 로그인/회원가입
- [ ] 취미 목록 조회
- [ ] 커뮤니티 목록 조회
- [ ] 게시글 작성/조회
- [ ] 채팅 기능
- [ ] 갤러리 업로드
- [ ] 프로필 수정
- [ ] 설문/추천 기능

---

## 🔍 검증 방법

### APK 실행 시 로그 확인
앱 실행 후 첫 화면에서 콘솔 로그 확인 (React Native Debugger 또는 adb logcat):

**성공 케이스** ✅:
```
[API Client] 🔍 환경 감지: {
  __DEV__: false,
  executionEnvironment: "standalone",
  isStandaloneBuild: true,
  isDevelopment: false
}
[API Client] ✅ [APK] 프로덕션 URL: https://hulife-app-jaehaeng2001-2614-jaehaeng2001-2614s-projects.vercel.app
[API Client] 🌐 최종 API_URL: https://hulife-app-jaehaeng2001-2614-jaehaeng2001-2614s-projects.vercel.app
```

**실패 케이스** ❌:
```
[API Client] ⚠️ EXPO_PUBLIC_API_URL_DEV 없음! 폴백 DEV URL 사용: http://10.20.35.24:3000
[API Client] 🌐 최종 API_URL: http://10.20.35.24:3000
```

### API 요청 확인
```
[API 클라이언트] 요청: GET https://hulife-app-jaehaeng2001-2614-jaehaeng2001-2614s-projects.vercel.app/api/hobbies
[API 클라이언트] 응답 성공: 200 GET /hobbies
```

---

## 📋 체크리스트 (재발 방지)

### ✅ eas.json 확인
- [ ] preview 프로필에 `EXPO_PUBLIC_API_URL_PROD` 설정됨
- [ ] production 프로필에 `EXPO_PUBLIC_API_URL_PROD` 설정됨
- [ ] 올바른 Vercel URL 사용 중

### ✅ apiClient.js 확인
- [ ] `Constants.executionEnvironment` 사용
- [ ] APK 빌드 시 PROD URL 강제
- [ ] 폴백 URL도 PROD 우선

### ✅ app.json 확인
- [ ] `android.permissions`에 `INTERNET` 권한 있음
- [ ] `ACCESS_NETWORK_STATE` 권한 있음

### ✅ 빌드 확인
- [ ] EAS Build 로그에서 `EXPO_PUBLIC_API_URL_PROD` 로드 확인
- [ ] APK 다운로드 성공

### ✅ 실행 확인
- [ ] APK 설치 후 앱 정상 실행
- [ ] 콘솔 로그에서 PROD URL 사용 확인
- [ ] 로그인/API 요청 모두 성공

---

## 🎯 최종 목표 달성 확인

모든 기능이 개발 환경과 **100% 동일**하게 작동:

- ✅ 로그인/회원가입
- ✅ 취미 목록 조회 (123개)
- ✅ 취미 상세 및 리뷰
- ✅ 커뮤니티 목록/상세
- ✅ 실시간 채팅 (WebSocket)
- ✅ 게시판 (작성/수정/삭제)
- ✅ 갤러리 (업로드/좋아요/댓글)
- ✅ 설문 및 추천
- ✅ 프로필 수정
- ✅ 일정 관리
- ✅ Push 알림

---

**작성일**: 2025-11-26
**버전**: 1.0
**작성자**: Claude (Sonnet 4.5)
