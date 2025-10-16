import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  showSubtext?: boolean;
}

export default function Logo({size = 'medium', showSubtext = true}: LogoProps) {
  const sizeStyles = {
    small: {
      logoText: {fontSize: 18},
      logoSubtext: {fontSize: 11},
    },
    medium: {
      logoText: {fontSize: 22},
      logoSubtext: {fontSize: 13},
    },
    large: {
      logoText: {fontSize: 26},
      logoSubtext: {fontSize: 14},
    },
  };

  return (
    <View style={styles.logoContainer}>
      <Text style={[styles.logoText, sizeStyles[size].logoText]}>HuLife</Text>
      {showSubtext && (
        <Text style={[styles.logoSubtext, sizeStyles[size].logoSubtext]}>휴라이프</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  logoText: {
    fontWeight: 'bold',
    color: '#FF7A5C',
    letterSpacing: -0.5,
  },
  logoSubtext: {
    fontWeight: '600',
    color: '#FF7A5C',
    opacity: 0.8,
  },
});
