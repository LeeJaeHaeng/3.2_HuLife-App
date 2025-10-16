import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Logo from '../components/Logo';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HobbyListScreen from '../screens/HobbyListScreen';
import HobbyDetailScreen from '../screens/HobbyDetailScreen';
import CommunityListScreen from '../screens/CommunityListScreen';
import CommunityDetailScreen from '../screens/CommunityDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SurveyScreen from '../screens/SurveyScreen';
import RecommendationsScreen from '../screens/RecommendationsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AboutScreen from '../screens/AboutScreen';
import FAQScreen from '../screens/FAQScreen';
import ContactScreen from '../screens/ContactScreen';
import CommunityChatScreen from '../screens/CommunityChatScreen';
import CommunityPostListScreen from '../screens/CommunityPostListScreen';
import PostDetailScreen from '../screens/PostDetailScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import JoinRequestsScreen from '../screens/JoinRequestsScreen';

// Type definitions for navigation
export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  HobbyList: undefined;
  HobbyDetail: {hobbyId: string};
  CommunityList: undefined;
  CommunityDetail: {communityId: string};
  Profile: undefined;
  Survey: undefined;
  Recommendations: undefined;
  Dashboard: undefined;
  About: undefined;
  FAQ: undefined;
  Contact: undefined;
  CommunityChat: {communityId: string; chatRoomId?: string};
  CommunityPostList: undefined;
  PostDetail: {postId: string};
  CreatePost: undefined;
  JoinRequests: {communityId: string};
};

const Stack = createNativeStackNavigator<RootStackParamList>();

// Root Stack Navigator - 웹과 동일하게 로그인 없이 메인 페이지부터 시작
export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerTintColor: '#1F2937',
      }}>
      {/* 메인 페이지 - 로그인 없이 접근 가능 (웹과 동일) */}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false, // HomeScreen has its own custom header with logo
        }}
      />

      {/* 인증 화면 */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: '로그인',
          headerShown: true,
          headerTitle: () => <Logo size="small" showSubtext={false} />,
        }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{title: '회원가입'}}
      />

      {/* 취미 화면 */}
      <Stack.Screen
        name="HobbyList"
        component={HobbyListScreen}
        options={{title: '취미 둘러보기'}}
      />
      <Stack.Screen
        name="HobbyDetail"
        component={HobbyDetailScreen}
        options={{title: '취미 상세'}}
      />

      {/* 모임 화면 */}
      <Stack.Screen
        name="CommunityList"
        component={CommunityListScreen}
        options={{title: '모임 찾기'}}
      />
      <Stack.Screen
        name="CommunityDetail"
        component={CommunityDetailScreen}
        options={{title: '모임 상세'}}
      />

      {/* 프로필 */}
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{title: '내 정보'}}
      />

      {/* 설문 및 추천 */}
      <Stack.Screen
        name="Survey"
        component={SurveyScreen}
        options={{title: '취미 추천 설문'}}
      />
      <Stack.Screen
        name="Recommendations"
        component={RecommendationsScreen}
        options={{title: '추천 결과', headerBackVisible: false}}
      />

      {/* 대시보드 */}
      <Stack.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{title: '대시보드'}}
      />

      {/* 정보 페이지 */}
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{title: '회사 소개'}}
      />
      <Stack.Screen
        name="FAQ"
        component={FAQScreen}
        options={{title: '자주 묻는 질문'}}
      />
      <Stack.Screen
        name="Contact"
        component={ContactScreen}
        options={{title: '문의하기'}}
      />

      {/* 채팅 */}
      <Stack.Screen
        name="CommunityChat"
        component={CommunityChatScreen}
        options={{title: '모임 채팅'}}
      />

      {/* 게시판 */}
      <Stack.Screen
        name="CommunityPostList"
        component={CommunityPostListScreen}
        options={{title: '게시판'}}
      />
      <Stack.Screen
        name="PostDetail"
        component={PostDetailScreen}
        options={{title: '게시글'}}
      />
      <Stack.Screen
        name="CreatePost"
        component={CreatePostScreen}
        options={{title: '글쓰기'}}
      />

      {/* 가입 신청 관리 */}
      <Stack.Screen
        name="JoinRequests"
        component={JoinRequestsScreen}
        options={{title: '가입 신청 관리'}}
      />
    </Stack.Navigator>
  );
}
