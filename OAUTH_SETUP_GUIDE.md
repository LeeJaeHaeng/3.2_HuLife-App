# 🔐 OAuth 로컬 개발 환경 설정 가이드

## 문제 상황
구글 OAuth는 로컬 IP 주소(예: `192.168.219.204`)를 Redirect URI로 허용하지 않습니다.

## ✅ 해결 방법

### 방법 1: ngrok 사용 (권장) 🌟

#### 1. ngrok 실행
```bash
# 터미널 1: Next.js 서버 실행
npm run dev

# 터미널 2: ngrok으로 터널링
ngrok http 3000
```

#### 2. ngrok 출력 확인
```
ngrok

Session Status                online
Account                       your-email@example.com (Plan: Free)
Version                       3.x.x
Region                        Asia Pacific (ap)
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123.ngrok-free.app -> http://localhost:3000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

**중요**: `https://abc123.ngrok-free.app` ← 이 URL을 사용하세요!

#### 3. 구글 OAuth 콘솔 설정

**승인된 자바스크립트 원본**:
```
https://abc123.ngrok-free.app
```

**승인된 리디렉션 URI**:
```
https://abc123.ngrok-free.app/api/auth/google/callback
```

#### 4. .env 파일 업데이트
```env
# .env
NEXT_PUBLIC_BASE_URL=https://abc123.ngrok-free.app
```

#### 5. 모바일 앱에서 접근
```javascript
// mobile/api/authService.js 또는 관련 파일
const API_URL = 'https://abc123.ngrok-free.app';
```

**장점**:
- ✅ HTTPS 자동 지원
- ✅ 외부에서도 접근 가능 (모바일 테스트 가능)
- ✅ 구글 OAuth 정책 준수

**단점**:
- ⚠️ ngrok 재시작 시 URL이 변경됨 (유료 플랜은 고정 URL 제공)
- ⚠️ 무료 플랜은 세션 제한 있음

---

### 방법 2: localhost만 사용 (웹 전용)

#### 구글 OAuth 콘솔 설정

**승인된 자바스크립트 원본**:
```
http://localhost:3000
```

**승인된 리디렉션 URI**:
```
http://localhost:3000/api/auth/google/callback
```

**사용 시나리오**:
- 웹 브라우저에서만 구글 로그인 테스트
- 모바일 앱에서는 카카오/네이버 로그인 사용

**장점**:
- ✅ 설정 간단
- ✅ URL 변경 없음

**단점**:
- ❌ 모바일 기기에서 테스트 불가

---

### 방법 3: 로컬 도메인 설정 (고급)

#### 1. hosts 파일 수정

**Windows**: `C:\Windows\System32\drivers\etc\hosts`
```
192.168.219.204   hulife.local
```

**Mac/Linux**: `/etc/hosts`
```
192.168.219.204   hulife.local
```

#### 2. 구글 OAuth 콘솔 설정

**승인된 자바스크립트 원본**:
```
http://hulife.local:3000
```

**승인된 리디렉션 URI**:
```
http://hulife.local:3000/api/auth/google/callback
```

**문제**: 구글은 `.local` TLD도 거부할 수 있음

---

### 방법 4: 개발 단계별 접근 (실용적) 💡

#### 단계별 로그인 지원

1. **로컬 개발 (PC 웹)**:
   - 구글 로그인: `localhost:3000` 사용 ✅
   - 카카오/네이버: IP 주소 사용 ✅

2. **모바일 테스트**:
   - 구글 로그인: ngrok 사용 또는 제외 ⚠️
   - 카카오/네이버: IP 주소 사용 ✅

3. **프로덕션**:
   - 모든 OAuth: 실제 도메인 사용 ✅

---

## 🎯 권장 설정 (현재 프로젝트)

### 카카오 로그인 (모바일 지원)
```
Redirect URI:
http://192.168.219.204:3000/api/auth/kakao/callback
http://localhost:3000/api/auth/kakao/callback
```

### 네이버 로그인 (모바일 지원)
```
Callback URL:
http://192.168.219.204:3000/api/auth/naver/callback
http://localhost:3000/api/auth/naver/callback
```

### 구글 로그인 (선택 1 또는 2)

**옵션 1: ngrok 사용 (모바일 + 웹)**
```
Redirect URI:
https://your-ngrok-url.ngrok-free.app/api/auth/google/callback
```

**옵션 2: localhost만 (웹 전용)**
```
Redirect URI:
http://localhost:3000/api/auth/google/callback
```

---

## 🚀 빠른 시작 (ngrok)

### 1단계: ngrok 실행
```bash
# 서버가 이미 실행 중이라면
ngrok http 3000
```

### 2단계: ngrok URL 복사
```
Forwarding: https://abc123.ngrok-free.app
```

### 3단계: 환경 변수 설정
```bash
# .env.local 파일 생성 또는 수정
NEXT_PUBLIC_BASE_URL=https://abc123.ngrok-free.app
```

### 4단계: 구글 OAuth 콘솔에 URL 등록
- 승인된 자바스크립트 원본: `https://abc123.ngrok-free.app`
- 승인된 리디렉션 URI: `https://abc123.ngrok-free.app/api/auth/google/callback`

### 5단계: 서버 재시작
```bash
npm run dev
```

### 6단계: 모바일 앱 설정
```javascript
// mobile/api/authService.js
const API_URL = 'https://abc123.ngrok-free.app/api';
```

---

## 📱 모바일 앱에서 OAuth 테스트

### ngrok URL 사용 시
```javascript
// 모바일 앱에서 로그인
import { Linking } from 'react-native';

const handleGoogleLogin = async () => {
  const ngrokUrl = 'https://abc123.ngrok-free.app';
  await Linking.openURL(`${ngrokUrl}/api/auth/google`);
};
```

---

## ⚠️ 주의사항

1. **ngrok 무료 플랜**:
   - URL이 재시작 시 변경됨
   - 매번 구글 OAuth 콘솔과 앱 설정을 업데이트해야 함

2. **ngrok 유료 플랜** (추천):
   - 고정 도메인 제공: `https://your-subdomain.ngrok.io`
   - URL 변경 걱정 없음

3. **프로덕션 배포 시**:
   - 실제 도메인(예: `https://hulife.com`) 사용
   - 모든 OAuth 콘솔에 프로덕션 URL 등록

---

## 🔍 디버깅

### ngrok이 작동하지 않을 때
```bash
# ngrok 프로세스 확인
tasklist | findstr ngrok

# ngrok 웹 인터페이스 확인
# 브라우저에서: http://localhost:4040
```

### OAuth 리디렉션 실패 시
1. 구글 콘솔에서 URL이 정확히 일치하는지 확인
2. HTTPS vs HTTP 확인 (ngrok은 HTTPS 사용)
3. 포트 번호 확인 (ngrok은 포트 없이 사용)

---

## 📚 참고 자료

- [ngrok 공식 문서](https://ngrok.com/docs)
- [구글 OAuth 설정 가이드](https://developers.google.com/identity/protocols/oauth2)
- [카카오 Redirect URI 설정](https://developers.kakao.com/docs/latest/ko/kakaologin/common)
- [네이버 Callback URL 설정](https://developers.naver.com/docs/login/devguide/devguide.md)
