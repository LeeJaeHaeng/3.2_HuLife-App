# HuLife Mobile - Expo 앱

시니어를 위한 취미 추천 플랫폼 모바일 앱

## 🚀 5분 만에 실행하기!

### 1단계: 스마트폰에 Expo Go 앱 설치

- **Android**: [Google Play에서 Expo Go 다운로드](https://play.google.com/store/apps/details?id=host.exp.exponent)
- **iOS**: [App Store에서 Expo Go 다운로드](https://apps.apple.com/app/expo-go/id982107779)

### 2단계: Next.js 백엔드 실행

프로젝트 루트에서:
```bash
pnpm dev
```

### 3단계: Expo 앱 실행

새 터미널에서:
```bash
cd mobile
npx expo start
```

### 4단계: QR 코드 스캔

- **Android**: Expo Go 앱에서 QR 코드 스캔
- **iOS**: 카메라로 QR 코드 스캔 후 Expo Go로 열기

**완료! 🎉**

---

## 💻 개발 환경 실행

### 웹 브라우저
```bash
npx expo start
# 'w' 키 눌러 웹 브라우저에서 열기
```

### Android 에뮬레이터
```bash
npx expo start
# 'a' 키 눌러 Android에서 열기
```

### iOS 시뮬레이터 (Mac만)
```bash
npx expo start
# 'i' 키 눌러 iOS에서 열기
```

---

## 📱 주요 기능

- ✅ 로그인/회원가입 (소셜 로그인 준비)
- ✅ 취미 둘러보기 및 검색
- ✅ 모임 찾기 및 가입
- ✅ 취미 추천 설문
- ✅ 프로필 관리

## 📂 프로젝트 구조

```
mobile/
├── App.tsx                    # 앱 진입점
├── app.json                   # Expo 설정
└── src/
    ├── navigation/
    │   └── AppNavigator.tsx   # 네비게이션
    ├── screens/              # 10개 화면
    ├── services/
    │   └── api.ts            # API 서비스
    └── types/
        └── index.ts          # TypeScript 타입
```

---

## 🔧 문제 해결

### 캐시 초기화
```bash
npx expo start --clear
```

### 의존성 재설치
```bash
rm -rf node_modules
npm install
```

### QR 코드 작동 안함
- 컴퓨터와 스마트폰이 같은 Wi-Fi에 연결되어 있는지 확인
- 터널 모드 사용: `npx expo start --tunnel`

---

## 📚 더 알아보기

- [Expo 공식 문서](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
