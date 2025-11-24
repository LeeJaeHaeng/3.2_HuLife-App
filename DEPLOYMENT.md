# 🚀 HuLife 배포 가이드 (상세 버전)

## 📋 목차

1. [사전 준비](#1-사전-준비)
2. [데이터베이스 설정 (Turso)](#2-데이터베이스-설정-turso)
3. [OAuth 클라이언트 ID 발급](#3-oauth-클라이언트-id-발급)
4. [백엔드 서버 배포](#4-백엔드-서버-배포)
5. [Expo 계정 및 프로젝트 설정](#5-expo-계정-및-프로젝트-설정)
6. [모바일 앱 빌드 및 배포](#6-모바일-앱-빌드-및-배포)
7. [앱스토어 등록](#7-앱스토어-등록)
8. [배포 후 테스트](#8-배포-후-테스트)

---

## 1. 사전 준비

### ✅ 필수 준비물
- [ ] GitHub 계정
- [ ] Expo 계정
- [ ] Google 계정 (Google Cloud Console용)
- [ ] 카카오 계정 (선택)
- [ ] 네이버 계정 (선택)
- [ ] 신용카드 (앱스토어 등록 시 필요)
- [ ] 도메인 (프로덕션 배포 시 권장)

### 💰 예상 비용
| 항목 | 비용 | 필수 여부 |
|-----|------|----------|
| Turso 데이터베이스 | **무료** (Hobby Plan) | ✅ 필수 |
| Expo EAS Build | **무료** (월 30분) | ✅ 필수 |
| Google Play Console 등록 | $25 (평생) | 선택 |
| Apple Developer Program | $99/년 | 선택 |
| 서버 호스팅 | 무료~$5/월 | ✅ 필수 |

---

## 2. 데이터베이스 설정 (Turso)

### 2.1. Turso 계정 생성 및 로그인

**1단계: Turso 웹사이트 접속**
```
https://turso.tech/
```

**2단계: 회원가입**
- 우측 상단 "Sign Up" 클릭
- GitHub 계정으로 로그인 (권장)
- 또는 이메일로 회원가입

**3단계: Turso CLI 설치 (선택사항)**
```bash
# Windows (PowerShell)
irm get.turso.tech/install.ps1 | iex

# Mac/Linux
curl -sSfL https://get.turso.tech/install.sh | bash

# 로그인
turso auth login
```

### 2.2. 데이터베이스 생성

**웹 콘솔 방식 (권장)**:

1. Turso 대시보드 접속: https://turso.tech/app
2. 좌측 메뉴에서 "Databases" 클릭
3. 우측 상단 "Create Database" 버튼 클릭
4. 데이터베이스 설정:
   ```
   Database Name: hulife-db
   Region: Seoul, South Korea (가장 가까운 지역 선택)
   Plan: Hobby (무료) 선택
   ```
5. "Create Database" 클릭

**CLI 방식**:
```bash
turso db create hulife-db --location nrt
```

### 2.3. 데이터베이스 URL 및 토큰 발급

**웹 콘솔 방식**:

1. 생성한 데이터베이스(hulife-db) 클릭
2. "Connect" 탭 클릭
3. 다음 정보 복사:
   ```
   Database URL: libsql://hulife-db-[your-org].turso.io
   Auth Token: eyJhbGciOiJFZERTQS... (긴 문자열)
   ```

**CLI 방식**:
```bash
# 데이터베이스 URL 확인
turso db show hulife-db --url

# 토큰 생성
turso db tokens create hulife-db
```

### 2.4. .env 파일 설정

프로젝트 루트에 `.env` 파일 생성:

```bash
cp .env.example .env
```

`.env` 파일에 Turso 정보 입력:

```env
# Turso Database
DATABASE_URL="libsql://hulife-db-[your-org].turso.io"
TURSO_AUTH_TOKEN="eyJhbGciOiJFZERTQS..."

# Session Secret (32자 이상 랜덤 문자열)
SESSION_SECRET="your-random-secret-key-at-least-32-characters-long"
```

**SESSION_SECRET 생성 방법**:
```bash
# Node.js로 생성
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# 또는 온라인 도구 사용
https://generate-secret.vercel.app/32
```
#####!!!!!여기부터 다시 시작!!!!!!#####
### 2.5. 데이터베이스 스키마 적용

```bash
# Drizzle Kit으로 스키마 푸시
npx drizzle-kit push

# 시드 데이터 입력 (취미 123개)
npm run seed
```

---

## 3. OAuth 클라이언트 ID 발급

### 3.1. 카카오 로그인 (선택)

**1단계: 카카오 Developers 접속**
```
https://developers.kakao.com/
```

**2단계: 애플리케이션 추가**
1. 우측 상단 "로그인" → 카카오 계정으로 로그인
2. 상단 메뉴 "내 애플리케이션" 클릭
3. "애플리케이션 추가하기" 클릭
4. 앱 정보 입력:
   ```
   앱 이름: HuLife
   사업자명: (개인 또는 회사명)
   ```
5. "저장" 클릭

**3단계: 앱 키 확인**
1. 생성한 앱(HuLife) 클릭
2. 좌측 메뉴 "앱 설정" → "요약 정보"
3. "앱 키" 섹션에서 다음 복사:
   ```
   REST API 키: de424c0a4add19... (이것이 CLIENT_ID)
   ```

**4단계: 카카오 로그인 활성화**
1. 좌측 메뉴 "제품 설정" → "카카오 로그인"
2. "카카오 로그인 활성화" ON
3. "Redirect URI" 등록:
   ```
   개발: http://localhost:3000/api/auth/kakao/callback
   프로덕션: https://yourdomain.com/api/auth/kakao/callback
   ```
4. "동의 항목" 설정:
   - 닉네임: 필수 동의
   - 프로필 사진: 선택 동의
   - 카카오계정(이메일): 필수 동의

**5단계: Client Secret 발급 (보안 강화)**
1. 좌측 메뉴 "제품 설정" → "카카오 로그인" → "보안"
2. "Client Secret" → "코드 생성" 클릭
3. "활성화" 상태로 변경
4. Secret 키 복사

**.env에 추가**:
```env
KAKAO_CLIENT_ID="de424c0a4add19..."
KAKAO_CLIENT_SECRET="your-secret-key"
```

---

### 3.2. 네이버 로그인 (선택)

**1단계: 네이버 Developers 접속**
```
https://developers.naver.com/
```

**2단계: 애플리케이션 등록**
1. 우측 상단 "로그인" → 네이버 계정으로 로그인
2. 상단 메뉴 "Application" → "애플리케이션 등록" 클릭
3. 애플리케이션 정보 입력:
   ```
   애플리케이션 이름: HuLife
   사용 API: 네이버 로그인 (체크)
   제공 정보: 이메일, 닉네임, 프로필 사진 (선택)
   환경 추가:
     - PC 웹: http://localhost:3000/api/auth/naver/callback
     - PC 웹: https://yourdomain.com/api/auth/naver/callback
   ```
4. "등록하기" 클릭

**3단계: Client ID/Secret 확인**
1. 등록한 애플리케이션(HuLife) 클릭
2. "API 설정" 탭에서 확인:
   ```
   Client ID: JhDatPR2iI0Z...
   Client Secret: aBc123DeF...
   ```

**.env에 추가**:
```env
NAVER_CLIENT_ID="JhDatPR2iI0Z..."
NAVER_CLIENT_SECRET="aBc123DeF..."
```

---

### 3.3. 구글 로그인 (선택)

**1단계: Google Cloud Console 접속**
```
https://console.cloud.google.com/
```

**2단계: 프로젝트 생성**
1. 상단 프로젝트 선택 드롭다운 클릭
2. "새 프로젝트" 클릭
3. 프로젝트 정보 입력:
   ```
   프로젝트 이름: HuLife
   위치: 조직 없음 (개인의 경우)
   ```
4. "만들기" 클릭

**3단계: OAuth 동의 화면 구성**
1. 좌측 메뉴 "API 및 서비스" → "OAuth 동의 화면"
2. 사용자 유형: "외부" 선택 → "만들기"
3. 앱 정보 입력:
   ```
   앱 이름: HuLife
   사용자 지원 이메일: your-email@gmail.com
   개발자 연락처 정보: your-email@gmail.com
   ```
4. "저장 후 계속"
5. 범위 추가:
   - ".../auth/userinfo.email" (이메일)
   - ".../auth/userinfo.profile" (프로필)
6. "저장 후 계속"
7. 테스트 사용자 추가 (본인 이메일)
8. "저장 후 계속"

**4단계: OAuth 2.0 클라이언트 ID 만들기**
1. 좌측 메뉴 "사용자 인증 정보" 클릭
2. 상단 "+ 사용자 인증 정보 만들기" → "OAuth 클라이언트 ID"
3. 애플리케이션 유형: "웹 애플리케이션"
4. 이름: HuLife Web
5. 승인된 리디렉션 URI:
   ```
   http://localhost:3000/api/auth/google/callback
   https://yourdomain.com/api/auth/google/callback
   ```
6. "만들기" 클릭
7. 클라이언트 ID와 Secret 복사

**.env에 추가**:
```env
GOOGLE_CLIENT_ID="216701679575-komtl1g5qfmeue98bk93h8mho8m5nq9f.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-..."
```

---

## 4. 백엔드 서버 배포

### 4.1. Vercel 배포 (권장)

**1단계: Vercel 계정 생성**
```
https://vercel.com/signup
```
- GitHub 계정으로 연결 (권장)

**2단계: GitHub Repository 연결**
1. Vercel 대시보드에서 "Add New" → "Project"
2. GitHub Repository 선택 (HuLife_App)
3. "Import" 클릭

**3단계: 환경 변수 설정**
1. "Environment Variables" 섹션에서 `.env` 내용 입력:
   ```
   DATABASE_URL: libsql://...
   TURSO_AUTH_TOKEN: eyJhbGc...
   SESSION_SECRET: your-secret...
   KAKAO_CLIENT_ID: ...
   KAKAO_CLIENT_SECRET: ...
   (나머지 OAuth 변수들)
   ```
2. "Deploy" 클릭

**4단계: 배포 완료**
- 배포 URL 확인: `https://hulife-app.vercel.app`
- 이 URL을 모바일 앱의 `API_URL`로 사용

---

### 4.2. 직접 서버 배포 (VPS/클라우드)

**1단계: 서버 준비**
```bash
# Ubuntu 20.04 LTS 기준

# Node.js 18 설치
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 설치
sudo npm install -g pm2
```

**2단계: 프로젝트 클론 및 설정**
```bash
# 프로젝트 클론
git clone https://github.com/yourusername/HuLife_App.git
cd HuLife_App

# 의존성 설치
npm install

# 환경 변수 설정
nano .env
# (위에서 설정한 내용 입력)

# 데이터베이스 스키마 푸시
npx drizzle-kit push

# 시드 데이터 입력
npm run seed
```

**3단계: PM2로 서버 실행**
```bash
# Socket.IO 서버 실행
pm2 start server.js --name "hulife-socket"

# 자동 재시작 설정
pm2 startup
pm2 save

# 로그 확인
pm2 logs hulife-socket
```

**4단계: Nginx 설치 및 설정**
```bash
# Nginx 설치
sudo apt-get update
sudo apt-get install -y nginx

# Nginx 설정 파일 생성
sudo nano /etc/nginx/sites-available/hulife
```

**Nginx 설정 내용**:
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # WebSocket 지원 (Socket.IO)
    location /api/socketio {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

**Nginx 활성화**:
```bash
# 심볼릭 링크 생성
sudo ln -s /etc/nginx/sites-available/hulife /etc/nginx/sites-enabled/

# Nginx 설정 테스트
sudo nginx -t

# Nginx 재시작
sudo systemctl restart nginx
```

**5단계: SSL 인증서 설치 (Let's Encrypt)**
```bash
# Certbot 설치
sudo apt-get install -y certbot python3-certbot-nginx

# SSL 인증서 발급
sudo certbot --nginx -d api.yourdomain.com

# 자동 갱신 설정 (crontab)
sudo crontab -e
# 다음 줄 추가:
0 0 1 * * certbot renew --quiet
```

**6단계: 방화벽 설정**
```bash
# UFW 방화벽 설정
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

---

## 5. Expo 계정 및 프로젝트 설정

### 5.1. Expo 계정 생성

**1단계: Expo 웹사이트 접속**
```
https://expo.dev/signup
```

**2단계: 회원가입**
- GitHub 계정으로 연결 (권장)
- 또는 이메일로 가입

**3단계: 조직(Organization) 생성 (선택)**
1. 대시보드에서 "Create Organization" 클릭
2. 조직 이름: hulife (또는 원하는 이름)
3. 플랜: Free 선택

### 5.2. EAS CLI 설치 및 로그인

```bash
# EAS CLI 전역 설치
npm install -g eas-cli

# Expo 로그인
eas login

# 로그인 확인
eas whoami
```

### 5.3. 프로젝트 설정

**1단계: mobile 폴더로 이동**
```bash
cd mobile
```

**2단계: app.json 확인 및 수정**

`mobile/app.json` 파일 열기:
```json
{
  "expo": {
    "name": "HuLife",
    "slug": "hulife-app",
    "version": "1.0.0",
    "owner": "your-expo-username",  // Expo 계정명으로 변경
    "ios": {
      "bundleIdentifier": "com.hulife.app",
      "buildNumber": "1"
    },
    "android": {
      "package": "com.hulife.app",
      "versionCode": 1
    },
    "extra": {
      "eas": {
        "projectId": ""  // 다음 단계에서 자동 입력됨
      }
    }
  }
}
```

**3단계: EAS Build 설정**
```bash
eas build:configure
```

질문에 답변:
```
? Would you like to automatically create an EAS project for @your-username/hulife-app?
  → Yes

? Select a platform
  → All (iOS and Android)
```

자동으로 `eas.json` 파일 생성됨:
```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

**4단계: Expo Project ID 확인**

```bash
# Project ID 확인
eas project:info

# 또는 app.json에서 확인
# "extra.eas.projectId"에 자동으로 추가됨
```

### 5.4. 모바일 환경 변수 설정

**1단계: mobile/.env 파일 생성**
```bash
cp .env.example .env
```

**2단계: .env 파일 수정**
```env
# 프로덕션 API URL (Vercel 또는 직접 서버)
API_URL=https://hulife-app.vercel.app

# Expo Project ID (app.json에서 확인)
EXPO_PROJECT_ID=your-project-id

# OAuth (선택)
KAKAO_CLIENT_ID=de424c0a4add19...
NAVER_CLIENT_ID=JhDatPR2iI0Z...
GOOGLE_CLIENT_ID=216701679575-...
```

---

## 6. 모바일 앱 빌드 및 배포

### 6.1. 테스트 빌드 (APK)

**1단계: Android APK 빌드**
```bash
cd mobile

# Preview 프로필로 APK 빌드
eas build --platform android --profile preview
```

빌드 과정:
```
✔ Select a build profile: preview
✔ Build for Android
✔ Credentials: Generate new keystore
✔ Push notifications: Set up notifications (권장)
```

**2단계: 빌드 진행 확인**
- 빌드 URL이 표시됨: `https://expo.dev/accounts/...`
- 웹 브라우저에서 빌드 진행 상황 확인
- 빌드 완료까지 약 10-15분 소요

**3단계: APK 다운로드 및 설치**
1. 빌드 완료 후 "Download" 버튼 클릭
2. APK 파일을 Android 기기로 전송
3. 기기에서 APK 설치

---

### 6.2. 프로덕션 빌드

#### Android (Google Play Store용)

**1단계: Production 빌드**
```bash
eas build --platform android --profile production
```

질문에 답변:
```
? Generate a new Android Keystore?
  → Yes (처음 빌드하는 경우)

? Would you like to upload a Keystore or have us generate one for you?
  → Generate new keystore
```

**2단계: 빌드 완료 확인**
- 빌드 완료 후 AAB 파일 다운로드 링크 확인
- 또는 자동으로 제출 가능 (eas submit)

---

#### iOS (App Store용)

**필수 사항**:
- Apple Developer Program 가입 ($99/년)
- Mac 컴퓨터 (필수)

**1단계: Apple Developer 가입**
```
https://developer.apple.com/programs/enroll/
```

**2단계: App Store Connect에서 앱 생성**
1. https://appstoreconnect.apple.com/ 접속
2. "My Apps" → "+" → "New App"
3. 앱 정보 입력:
   ```
   Platform: iOS
   Name: HuLife
   Primary Language: Korean
   Bundle ID: com.hulife.app (Xcode에서 생성 필요)
   SKU: HULIFE001 (고유 식별자)
   ```

**3단계: iOS 빌드**
```bash
eas build --platform ios --profile production
```

질문에 답변:
```
? Provide your Apple ID:
  → your-apple-id@icloud.com

? Provide your Apple ID password:
  → (비밀번호 입력)

? Provide your Apple Team ID:
  → (자동으로 선택됨 또는 입력)
```

**4단계: 빌드 완료 확인**
- 빌드 완료 후 IPA 파일 생성
- TestFlight 또는 App Store 제출 가능

---

## 7. 앱스토어 등록

### 7.1. Google Play Console

**1단계: Google Play Console 등록**
```
https://play.google.com/console/signup
```
- Google 계정으로 로그인
- 개발자 등록비 $25 결제 (평생)
- 신원 확인 완료 (약 48시간 소요)

**2단계: 앱 만들기**
1. "모든 앱" → "앱 만들기"
2. 앱 세부정보:
   ```
   앱 이름: HuLife
   기본 언어: 한국어
   앱 또는 게임: 앱
   무료 또는 유료: 무료
   ```
3. 선언 체크박스 모두 체크 → "앱 만들기"

**3단계: 앱 번들 업로드**
1. 좌측 메뉴 "프로덕션" → "새 버전 만들기"
2. "앱 번들 업로드" 클릭
3. EAS Build에서 다운로드한 AAB 파일 업로드

또는 EAS Submit 사용:
```bash
cd mobile
eas submit --platform android
```

**4단계: 스토어 등록정보 작성**

필수 항목:
- **앱 아이콘**: 512x512 PNG
- **기능 그래픽**: 1024x500 PNG
- **스크린샷**: 최소 2개 (휴대전화용)
- **짧은 설명**: 80자 이내
  ```
  은퇴자를 위한 AI 기반 취미 추천 및 커뮤니티 플랫폼
  ```
- **전체 설명**: 4000자 이내
- **카테고리**: 라이프스타일

**5단계: 콘텐츠 등급 설정**
1. "콘텐츠 등급" → "설문지 시작"
2. 모든 질문에 "아니요" 답변 (일반적인 앱의 경우)
3. "등급 받기"

**6단계: 가격 및 배포**
1. "가격 및 배포"
2. 국가/지역: "모든 국가" 선택
3. 가격: 무료

**7단계: 검토 및 게시**
1. 모든 항목 완료 확인 (녹색 체크)
2. "프로덕션으로 게시" 클릭
3. 검토 대기 (보통 1-3일 소요)

---

### 7.2. Apple App Store

**1단계: App Store Connect 접속**
```
https://appstoreconnect.apple.com/
```

**2단계: 앱 정보 작성**
1. 앱 선택 (HuLife)
2. "앱 정보" 탭:
   ```
   이름: HuLife
   부제: 은퇴자를 위한 취미 생활 플랫폼
   카테고리: 라이프스타일
   ```

**3단계: 스크린샷 및 미리보기**
- iPhone 6.5": 필수 (iPhone 14 Pro Max 크기)
- iPhone 5.5": 필수 (iPhone 8 Plus 크기)
- 각각 최소 3개, 최대 10개

**4단계: 앱 설명**
```
설명 (4000자 이내):
HuLife는 은퇴 후 새로운 삶을 시작하는 분들을 위한 종합 취미 생활 플랫폼입니다.

주요 기능:
• AI 기반 맞춤형 취미 추천
• 123개 이상의 다양한 취미 정보
• 같은 관심사를 가진 사람들과의 커뮤니티
• 실시간 채팅 및 게시판
• Instagram Reels 스타일 작품 갤러리
• 일정 관리 및 학습 진행도 추적

...
```

**5단계: 빌드 업로드**
```bash
cd mobile
eas submit --platform ios
```

또는:
1. Xcode에서 직접 업로드
2. "Archive" → "Validate App" → "Distribute App"

**6단계: TestFlight 테스트 (선택)**
1. "TestFlight" 탭
2. "외부 테스터" 그룹 생성
3. 테스터 초대 (이메일)
4. 베타 테스트 진행

**7단계: 앱 스토어 심사 제출**
1. "버전" 탭에서 빌드 선택
2. 모든 항목 완료 확인
3. "심사용으로 제출" 클릭
4. 심사 대기 (보통 1-3일 소요)

---

## 8. 배포 후 테스트

### 8.1. 백엔드 API 테스트

```bash
# 서버 Health Check
curl https://hulife-app.vercel.app/api/hobbies

# 로그인 테스트
curl -X POST https://hulife-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# WebSocket 연결 테스트 (wscat 사용)
npm install -g wscat
wscat -c wss://hulife-app.vercel.app/api/socketio
```

### 8.2. 모바일 앱 테스트 체크리스트

**인증**:
- [ ] 이메일/비밀번호 로그인
- [ ] 회원가입
- [ ] 카카오 로그인
- [ ] 네이버 로그인
- [ ] 구글 로그인
- [ ] 로그아웃

**취미**:
- [ ] 취미 목록 조회
- [ ] 취미 검색 및 필터
- [ ] 취미 상세 보기
- [ ] 관심 취미 추가/제거
- [ ] 리뷰 작성/수정/삭제

**설문 및 추천**:
- [ ] 설문 작성
- [ ] 추천 결과 조회
- [ ] 관심 추가

**커뮤니티**:
- [ ] 커뮤니티 목록 조회
- [ ] 커뮤니티 검색 및 필터
- [ ] 모임 생성
- [ ] 가입 신청
- [ ] 가입 승인/거절 (리더)
- [ ] 모임 탈퇴

**실시간 채팅**:
- [ ] 채팅방 입장
- [ ] 메시지 전송
- [ ] 실시간 메시지 수신
- [ ] 날짜 구분선 표시

**게시판**:
- [ ] 게시글 목록 조회
- [ ] 게시글 작성
- [ ] 게시글 수정/삭제
- [ ] 댓글 작성/수정/삭제

**갤러리**:
- [ ] 갤러리 목록 조회
- [ ] 작품 업로드 (이미지)
- [ ] 작품 상세 보기 (Reels 스타일)
- [ ] 좋아요/댓글
- [ ] 작품 수정/삭제

**일정**:
- [ ] 일정 추가
- [ ] 캘린더 표시
- [ ] 일정 수정/삭제

**마이페이지**:
- [ ] 프로필 조회
- [ ] 프로필 수정
- [ ] 관심 취미 목록
- [ ] 참여 모임 목록
- [ ] 일정 목록

**Push 알림**:
- [ ] 알림 권한 요청
- [ ] 새 메시지 알림
- [ ] 댓글 알림

**오프라인 모드**:
- [ ] Wi-Fi 끄기 → 캐시된 데이터 표시
- [ ] 오프라인 인디케이터 표시

---

## 9. 배포 체크리스트 (최종)

### ✅ 백엔드
- [ ] Turso 데이터베이스 생성 및 연결
- [ ] 환경 변수 (.env) 설정 완료
- [ ] 데이터베이스 스키마 푸시 완료
- [ ] 시드 데이터 입력 완료
- [ ] OAuth 클라이언트 ID 발급 (카카오, 네이버, 구글)
- [ ] Vercel 배포 또는 VPS 서버 설정
- [ ] HTTPS 인증서 설치 (프로덕션)
- [ ] Nginx 설정 (WebSocket 포함)
- [ ] PM2 프로세스 관리 설정
- [ ] 방화벽 설정 완료
- [ ] API 테스트 통과

### ✅ 모바일
- [ ] Expo 계정 생성 및 로그인
- [ ] EAS CLI 설치 및 설정
- [ ] mobile/.env 파일 설정 (프로덕션 API URL)
- [ ] app.json 버전 업데이트
- [ ] 앱 아이콘 및 스플래시 최적화
- [ ] EAS Build 성공 (Android/iOS)
- [ ] 테스트 기기에서 APK/IPA 검증
- [ ] 스크린샷 준비 (Play Store, App Store)
- [ ] 앱 설명 작성 (한글, 영문)
- [ ] Google Play Console 등록 (Android)
- [ ] App Store Connect 등록 (iOS)
- [ ] 스토어 제출 완료

### ✅ 보안 및 성능
- [ ] CORS 설정 (프로덕션 도메인만 허용)
- [ ] Rate Limiting 설정
- [ ] Helmet 보안 헤더
- [ ] 이미지 최적화 (WebP)
- [ ] API 응답 캐싱
- [ ] 프로덕션 빌드 시 console.log 제거

### ✅ 모니터링
- [ ] Sentry 오류 추적 설정 (선택)
- [ ] Google Analytics 설정 (선택)
- [ ] PM2 모니터링 (서버)

---

## 10. 예상 소요 시간

| 작업 | 소요 시간 |
|-----|----------|
| Turso 데이터베이스 설정 | 10분 |
| OAuth 클라이언트 ID 발급 | 30분 (3개 제공자) |
| 백엔드 Vercel 배포 | 15분 |
| 백엔드 VPS 배포 | 1-2시간 |
| Expo 계정 및 프로젝트 설정 | 15분 |
| 모바일 앱 빌드 (Android) | 20분 (대기 시간 포함) |
| 모바일 앱 빌드 (iOS) | 30분 (대기 시간 포함) |
| Google Play Console 등록 | 1-2시간 (처음 등록 시) |
| App Store Connect 등록 | 2-3시간 (처음 등록 시) |
| 스토어 심사 대기 | 1-3일 |
| **전체 (처음 배포)** | **약 1-2일** |

---

## 11. 트러블슈팅

### Q1: EAS Build 실패 - "Credentials: Keystore not found"

**해결**:
```bash
# 새 Keystore 생성
eas credentials --platform android

# 또는 빌드 시 자동 생성 선택
eas build --platform android --profile production
→ Generate new keystore 선택
```

---

### Q2: OAuth 로그인 실패 - "Redirect URI mismatch"

**원인**: Redirect URI가 일치하지 않음

**해결**:
1. 각 OAuth 제공자 설정에서 Redirect URI 확인
2. 다음 형식으로 정확히 입력:
   ```
   개발: http://localhost:3000/api/auth/[provider]/callback
   프로덕션: https://yourdomain.com/api/auth/[provider]/callback
   ```
3. [provider]는 `kakao`, `naver`, `google` 중 하나

---

### Q3: 앱 빌드 시 "Unable to resolve module"

**원인**: 패키지 설치 누락

**해결**:
```bash
cd mobile
rm -rf node_modules
npm install
eas build --platform android --clear-cache
```

---

### Q4: Play Store 거부 - "앱이 충돌함"

**원인**: 프로덕션 환경 변수 누락

**해결**:
1. `mobile/.env`에 프로덕션 API URL 확인
2. 빌드 시 환경 변수 포함:
   ```bash
   # .env 파일을 Git에 커밋하지 말고 EAS Secrets 사용
   eas secret:create --scope project --name API_URL --value https://your-api.com
   ```

---

### Q5: iOS 빌드 실패 - "Apple Developer Team not found"

**해결**:
1. Apple Developer Program 가입 확인 ($99/년)
2. Team ID 확인: https://developer.apple.com/account
3. EAS 빌드 시 Team ID 입력

---

## 12. 참고 자료

### 공식 문서
- **Expo Docs**: https://docs.expo.dev/
- **EAS Build**: https://docs.expo.dev/build/introduction/
- **EAS Submit**: https://docs.expo.dev/submit/introduction/
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Turso Docs**: https://docs.turso.tech/

### OAuth 개발자 센터
- **Kakao Developers**: https://developers.kakao.com/
- **Naver Developers**: https://developers.naver.com/
- **Google Cloud Console**: https://console.cloud.google.com/

### 앱스토어
- **Google Play Console**: https://play.google.com/console/
- **App Store Connect**: https://appstoreconnect.apple.com/

---

**작성일**: 2025-11-19
**버전**: 2.0 (상세 버전)
**작성자**: Claude (Sonnet 4.5)
