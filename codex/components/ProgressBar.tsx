import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export interface ProgressBarProps {
  percent: number;
  showLabel?: boolean;
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export default function ProgressBar({
  percent,
  showLabel = true,
  color = '#3b82f6',
  height = 8,
  style,
}: ProgressBarProps) {
  const { isDark } = useTheme();
  const clampedPercent = Math.min(Math.max(percent, 0), 100);

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: isDark ? '#a1a1aa' : '#52525b' }]}>
            Progress
          </Text>
          <Text style={[styles.percentage, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
            {clampedPercent}%
          </Text>
        </View>
      )}
      <View style={[styles.progressBar, { height, backgroundColor: isDark ? '#27272a' : '#e5e5e5' }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${clampedPercent}%`,
              backgroundColor: color,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
  },
  percentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
});
