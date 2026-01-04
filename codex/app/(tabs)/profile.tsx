import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getToken } from '@/services/auth';
import { getProgress, ProgressData } from '@/services/api';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const token = await getToken();
      if (token) {
        const data = await getProgress(token);
        setProgress(data);
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotalProgress = () => {
    const modules = ['python', 'pyIfElse', 'pyLoops', 'pyArrays', 'pyFunctions', 'pyExercise'];
    const completed = modules.filter((m) => progress[m]).length;
    return Math.round((completed / modules.length) * 100);
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
      contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
          Profile
        </Text>
      </View>

      {/* User Info Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? '#18181b' : '#f6f6f6' },
        ]}>
        {user.picture && (
          <Image
            source={{ uri: user.picture }}
            style={styles.avatar}
          />
        )}
        <Text style={[styles.name, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
          {user.name}
        </Text>
        <Text style={[styles.email, { color: isDark ? '#a1a1aa' : '#52525b' }]}>
          {user.email}
        </Text>
      </View>

      {/* Progress Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? '#18181b' : '#f6f6f6' },
        ]}>
        <Text style={[styles.cardTitle, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
          Learning Progress
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <>
            <View style={styles.progressContainer}>
              <Text style={[styles.progressText, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
                {calculateTotalProgress()}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${calculateTotalProgress()}%`, backgroundColor: '#3b82f6' },
                ]}
              />
            </View>
            <View style={styles.modulesList}>
              <ModuleItem
                title="Python Introduction"
                completed={progress.python || false}
                isDark={isDark}
              />
              <ModuleItem
                title="If-Else Statements"
                completed={progress.pyIfElse || false}
                isDark={isDark}
              />
              <ModuleItem
                title="Loops"
                completed={progress.pyLoops || false}
                isDark={isDark}
              />
              <ModuleItem
                title="Arrays"
                completed={progress.pyArrays || false}
                isDark={isDark}
              />
              <ModuleItem
                title="Functions"
                completed={progress.pyFunctions || false}
                isDark={isDark}
              />
              <ModuleItem
                title="Exercises"
                completed={progress.pyExercise || false}
                isDark={isDark}
              />
            </View>
          </>
        )}
      </View>

      {/* Theme Toggle Button */}
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isDark ? '#2563eb' : '#3b82f6' },
        ]}
        onPress={toggleTheme}>
        <Text style={styles.buttonText}>
          Switch to {isDark ? 'Light' : 'Dark'} Mode
        </Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

interface ModuleItemProps {
  title: string;
  completed: boolean;
  isDark: boolean;
}

function ModuleItem({ title, completed, isDark }: ModuleItemProps) {
  return (
    <View style={styles.moduleItem}>
      <Text style={[styles.moduleTitle, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        {title}
      </Text>
      <Text style={styles.moduleStatus}>
        {completed ? '✓' : '○'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignSelf: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  progressText: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 20,
  },
  progressFill: {
    height: '100%',
  },
  modulesList: {
    gap: 8,
  },
  moduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  moduleTitle: {
    fontSize: 14,
  },
  moduleStatus: {
    fontSize: 18,
    color: '#3b82f6',
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  logoutButton: {
    backgroundColor: '#ef4444',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
