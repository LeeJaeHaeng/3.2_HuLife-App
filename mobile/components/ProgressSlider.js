import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import { updateHobbyProgressAPI } from '../api/userService';

export default function ProgressSlider({ hobbyId, initialProgress = 0, initialStatus = 'interested', onProgressChange }) {
  const [progress, setProgress] = useState(initialProgress);
  const [status, setStatus] = useState(initialStatus);
  const [saving, setSaving] = useState(false);
  const [lastSavedProgress, setLastSavedProgress] = useState(initialProgress);

  // Update local state when props change
  useEffect(() => {
    setProgress(initialProgress);
    setLastSavedProgress(initialProgress);
    setStatus(initialStatus);
  }, [initialProgress, initialStatus]);

  const handleProgressChange = async (value) => {
    const roundedValue = Math.round(value);
    setProgress(roundedValue);

    // Auto-save after user stops sliding (debounce)
    if (Math.abs(roundedValue - lastSavedProgress) >= 5) {
      try {
        setSaving(true);
        const response = await updateHobbyProgressAPI(hobbyId, roundedValue);

        if (response && response.userHobby) {
          setStatus(response.userHobby.status);
          setLastSavedProgress(roundedValue);

          // Notify parent component
          if (onProgressChange) {
            onProgressChange(response.userHobby);
          }

          // Show celebration for completion
          if (roundedValue === 100 && lastSavedProgress < 100) {
            // Parent component should handle celebration
            console.log('🎉 취미 완료!');
          }
        }
      } catch (error) {
        console.error('[진행도 업데이트 실패]', error);
        // Revert on error
        setProgress(lastSavedProgress);
      } finally {
        setSaving(false);
      }
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'interested': return '관심있음';
      case 'learning': return '학습중';
      case 'completed': return '완료';
      default: return status;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'interested': return '#6b7280'; // gray
      case 'learning': return '#3b82f6'; // blue
      case 'completed': return '#10b981'; // green
      default: return '#6b7280';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>학습 진행도</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={[styles.statusText, { color: getStatusColor() }]}>
            {getStatusText()}
          </Text>
          {saving && (
            <ActivityIndicator size="small" color="#FF7A5C" style={styles.savingIndicator} />
          )}
        </View>
      </View>

      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={5}
          value={progress}
          onValueChange={setProgress}
          onSlidingComplete={handleProgressChange}
          minimumTrackTintColor="#FF7A5C"
          maximumTrackTintColor="#d1d5db"
          thumbTintColor="#FF7A5C"
        />
        <Text style={styles.progressText}>{progress}%</Text>
      </View>

      {progress === 100 && (
        <View style={styles.completionBadge}>
          <Text style={styles.completionText}>🎉 완료되었습니다!</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  savingIndicator: {
    marginLeft: 4,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  progressText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF7A5C',
    minWidth: 50,
    textAlign: 'right',
  },
  completionBadge: {
    backgroundColor: '#d1fae5',
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
    alignItems: 'center',
  },
  completionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065f46',
  },
});
