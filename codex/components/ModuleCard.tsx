import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export interface ModuleCardProps {
  title: string;
  description: string;
  icon: string;
  completed: boolean;
  locked: boolean;
  progress?: number;
  onPress: () => void;
}

export default function ModuleCard({
  title,
  description,
  icon,
  completed,
  locked,
  progress = 0,
  onPress,
}: ModuleCardProps) {
  const { isDark } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: isDark ? '#18181b' : '#f6f6f6' },
        locked && styles.cardLocked,
      ]}
      onPress={onPress}
      disabled={locked}
      activeOpacity={0.7}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
            {title}
          </Text>
          <Text style={[styles.cardDescription, { color: isDark ? '#a1a1aa' : '#52525b' }]}>
            {description}
          </Text>
        </View>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
          {completed && (
            <View style={styles.completedBadge}>
              <Text style={styles.completedIcon}>✓</Text>
            </View>
          )}
          {locked && (
            <View style={styles.lockedBadge}>
              <Text style={styles.lockedIcon}>🔒</Text>
            </View>
          )}
        </View>
      </View>

      {progress > 0 && !locked && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%`, backgroundColor: completed ? '#10b981' : '#3b82f6' },
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: isDark ? '#a1a1aa' : '#52525b' }]}>
            {progress}%
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  cardLocked: {
    opacity: 0.5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  iconContainer: {
    position: 'relative',
    marginLeft: 12,
  },
  icon: {
    fontSize: 40,
  },
  completedBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#10b981',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  completedIcon: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  lockedBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: '#6b7280',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockedIcon: {
    fontSize: 10,
  },
  progressContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5e5e5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
});
