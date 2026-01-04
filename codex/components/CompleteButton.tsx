import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export interface CompleteButtonProps {
  module: string;
  completed: boolean;
  onComplete: (module: string) => Promise<void>;
}

export default function CompleteButton({
  module,
  completed,
  onComplete,
}: CompleteButtonProps) {
  const { isDark } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  const handlePress = async () => {
    if (completed) return;

    setIsLoading(true);
    try {
      await onComplete(module);
    } catch (error) {
      console.error('Error completing module:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        completed
          ? { backgroundColor: '#10b981' }
          : { backgroundColor: isDark ? '#2563eb' : '#3b82f6' },
        (isLoading || completed) && styles.buttonDisabled,
      ]}
      onPress={handlePress}
      disabled={isLoading || completed}
      activeOpacity={0.7}>
      {isLoading ? (
        <ActivityIndicator color="#fff" size="small" />
      ) : (
        <Text style={styles.buttonText}>
          {completed ? '✓ Completed' : 'Mark as Complete'}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    marginVertical: 16,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
