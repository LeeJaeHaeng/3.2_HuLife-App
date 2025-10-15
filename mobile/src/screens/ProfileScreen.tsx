import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {authService} from '../services/api';

export default function ProfileScreen() {
  const handleLogout = () => {
    Alert.alert('로그아웃', '정말로 로그아웃 하시겠습니까?', [
      {text: '취소', style: 'cancel'},
      {
        text: '로그아웃',
        style: 'destructive',
        onPress: async () => {
          await authService.logout();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>프로필</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>로그아웃</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#FFFFFF', padding: 24},
  title: {fontSize: 24, fontWeight: 'bold', color: '#1F2937', marginBottom: 24},
  logoutButton: {height: 56, backgroundColor: '#FFFFFF', borderRadius: 12, borderWidth: 1, borderColor: '#EF4444', justifyContent: 'center', alignItems: 'center'},
  logoutText: {fontSize: 16, fontWeight: '600', color: '#EF4444'},
});
