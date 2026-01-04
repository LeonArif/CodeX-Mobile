import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

interface NextModuleButtonProps {
  nextModule: string;
  nextModuleTitle: string;
}

export default function NextModuleButton({
  nextModule,
  nextModuleTitle,
}: NextModuleButtonProps) {
  const { isDark } = useTheme();
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: isDark ? '#2563eb' : '#3b82f6' }]}
      onPress={() => router.push(nextModule as any)}
      activeOpacity={0.7}>
      <Text style={styles.buttonText}>
        Continue to {nextModuleTitle} →
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
