import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Feather } from '@expo/vector-icons';
import cacheService from '../api/cacheService';

/**
 * OfflineIndicator Component
 * - 네트워크 오프라인 시 화면 상단에 배너 표시
 * - 온라인 복귀 시 자동으로 숨김
 * - 부드러운 애니메이션
 */
export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const slideAnim = useState(new Animated.Value(-60))[0]; // 초기 위치: 화면 밖 (위)

  useEffect(() => {
    // 초기 네트워크 상태 확인
    checkInitialStatus();

    // 네트워크 상태 변경 리스너 등록
    cacheService.addOnlineStatusListener(handleOnlineStatusChange);

    return () => {
      // 리스너 정리는 cacheService에서 관리됨
    };
  }, []);

  const checkInitialStatus = async () => {
    const status = await cacheService.checkNetworkStatus();
    setIsOnline(status);
    if (!status) {
      showBanner();
    }
  };

  const handleOnlineStatusChange = (status) => {
    setIsOnline(status);
    if (status) {
      hideBanner();
    } else {
      showBanner();
    }
  };

  const showBanner = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const hideBanner = () => {
    Animated.timing(slideAnim, {
      toValue: -60,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.banner}>
        <Feather name="wifi-off" size={18} color="#fff" />
        <Text style={styles.text}>오프라인 모드</Text>
        <Text style={styles.subtext}>캐시된 데이터를 표시합니다</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  banner: {
    backgroundColor: '#dc2626', // 빨간색 (오프라인 경고)
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  text: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  subtext: {
    color: '#fed7d7',
    fontSize: 12,
    marginLeft: 'auto',
  },
});
