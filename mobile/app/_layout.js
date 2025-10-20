import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      {/* 기본 화면들 */}
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ title: '회원가입' }} />
      <Stack.Screen name="dashboard" options={{ headerShown: false }} />

      {/* 취미 관련 화면들 */}
      <Stack.Screen name="hobbies" options={{ headerShown: false }} />
      <Stack.Screen name="hobbies/[id]" options={{ headerShown: false }} />

      {/* 커뮤니티 관련 화면들 */}
      <Stack.Screen name="community" options={{ headerShown: false }} />
      <Stack.Screen name="community/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="community/posts/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="community/posts/create" options={{ headerShown: false }} />

      {/* 마이페이지 */}
      <Stack.Screen name="my-page" options={{ headerShown: false }} />

      {/* 설문조사 */}
      <Stack.Screen name="survey" options={{ headerShown: false }} />

      {/* 추천 결과 */}
      <Stack.Screen name="recommendations" options={{ headerShown: false }} />
    </Stack>
  );
}