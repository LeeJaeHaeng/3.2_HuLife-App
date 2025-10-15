import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

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
  Recommendations: {surveyResults: {[key: string]: string}};
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
          title: 'HuLife',
          headerShown: true,
        }}
      />

      {/* 인증 화면 */}
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          title: '로그인',
          headerShown: true,
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
    </Stack.Navigator>
  );
}
