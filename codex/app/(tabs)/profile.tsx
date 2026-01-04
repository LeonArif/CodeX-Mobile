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
import ProgressBar from '@/components/ProgressBar';

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

  const getCompletedCount = () => {
    const modules = ['python', 'pyIfElse', 'pyLoops', 'pyArrays', 'pyFunctions', 'pyExercise'];
    return modules.filter((m) => progress[m]).length;
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
        <View style={styles.avatarContainer}>
          {user.picture && (
            <Image
              source={{ uri: user.picture }}
              style={styles.avatar}
            />
          )}
        </View>
        <Text style={[styles.name, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
          {user.name}
        </Text>
        <Text style={[styles.email, { color: isDark ? '#a1a1aa' : '#52525b' }]}>
          {user.email}
        </Text>
      </View>

      {/* Progress Statistics Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? '#18181b' : '#f6f6f6' },
        ]}>
        <View style={styles.statsHeader}>
          <Text style={[styles.cardTitle, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
            📊 Learning Statistics
          </Text>
        </View>
        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
                  {getCompletedCount()}
                </Text>
                <Text style={[styles.statLabel, { color: isDark ? '#a1a1aa' : '#52525b' }]}>
                  Completed
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
                  6
                </Text>
                <Text style={[styles.statLabel, { color: isDark ? '#a1a1aa' : '#52525b' }]}>
                  Total Modules
                </Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
                  {calculateTotalProgress()}%
                </Text>
                <Text style={[styles.statLabel, { color: isDark ? '#a1a1aa' : '#52525b' }]}>
                  Progress
                </Text>
              </View>
            </View>
            <ProgressBar
              percent={calculateTotalProgress()}
              showLabel={false}
              color={calculateTotalProgress() === 100 ? '#10b981' : '#3b82f6'}
              style={{ marginTop: 16 }}
            />
          </>
        )}
      </View>

      {/* Python Course Progress Card */}
      <View
        style={[
          styles.card,
          { backgroundColor: isDark ? '#18181b' : '#f6f6f6' },
        ]}>
        <Text style={[styles.cardTitle, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
          🐍 Python Course Progress
        </Text>
        {isLoading ? (
          <ActivityIndicator size="small" />
        ) : (
          <View style={styles.modulesList}>
            <ModuleItem
              title="Introduction"
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
              title="Arrays (Lists)"
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
        )}
      </View>

      {/* Theme Toggle Button */}
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isDark ? '#2563eb' : '#3b82f6' },
        ]}
        onPress={toggleTheme}
        activeOpacity={0.7}>
        <Text style={styles.buttonText}>
          {isDark ? '☀️' : '🌙'} Switch to {isDark ? 'Light' : 'Dark'} Mode
        </Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={handleLogout}
        activeOpacity={0.7}>
        <Text style={styles.buttonText}>🚪 Logout</Text>
      </TouchableOpacity>

      <View style={{ height: 20 }} />
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
      <View style={styles.moduleLeft}>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: completed ? '#10b981' : isDark ? '#3f3f46' : '#d4d4d8' },
          ]}
        />
        <Text style={[styles.moduleTitle, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
          {title}
        </Text>
      </View>
      <Text style={[styles.moduleStatus, { color: completed ? '#10b981' : '#71717a' }]}>
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
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#3b82f6',
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
  statsHeader: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#3f3f46',
  },
  modulesList: {
    marginTop: 12,
  },
  moduleItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
  },
  moduleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  moduleTitle: {
    fontSize: 15,
  },
  moduleStatus: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
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
