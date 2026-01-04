import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getToken } from '@/services/auth';
import { getProgress, ProgressData } from '@/services/api';

export default function HomeScreen() {
  const { user } = useAuth();
  const { isDark } = useTheme();
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

  const calculatePythonProgress = () => {
    const modules = ['python', 'pyIfElse', 'pyLoops', 'pyArrays', 'pyFunctions', 'pyExercise'];
    const completed = modules.filter((m) => progress[m]).length;
    return Math.round((completed / modules.length) * 100);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
      contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
          Welcome to CodeX
        </Text>
        {user && (
          <Text style={[styles.subtitle, { color: isDark ? '#a1a1aa' : '#52525b' }]}>
            Hi, {user.name}!
          </Text>
        )}
      </View>

      {/* Description */}
      <Text style={[styles.description, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        Start your programming journey with interactive tutorials and hands-on exercises.
      </Text>

      {/* Languages Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
          Programming Languages
        </Text>

        {/* Python Card */}
        <TouchableOpacity
          style={[
            styles.languageCard,
            { backgroundColor: isDark ? '#18181b' : '#f6f6f6' },
          ]}
          onPress={() => router.push('/python')}
          activeOpacity={0.7}>
          <View style={styles.languageHeader}>
            <View>
              <Text style={[styles.languageName, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
                Python
              </Text>
              <Text style={[styles.languageDescription, { color: isDark ? '#a1a1aa' : '#52525b' }]}>
                Learn Python programming fundamentals
              </Text>
            </View>
            <Text style={styles.languageIcon}>🐍</Text>
          </View>

          {/* Progress Bar */}
          {isLoading ? (
            <ActivityIndicator size="small" style={styles.loader} />
          ) : (
            <>
              <View style={styles.progressInfo}>
                <Text style={[styles.progressLabel, { color: isDark ? '#a1a1aa' : '#52525b' }]}>
                  Progress
                </Text>
                <Text style={[styles.progressPercentage, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
                  {calculatePythonProgress()}%
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${calculatePythonProgress()}%`,
                      backgroundColor: '#3b82f6',
                    },
                  ]}
                />
              </View>
            </>
          )}
        </TouchableOpacity>

        {/* Coming Soon Cards */}
        <View
          style={[
            styles.languageCard,
            styles.disabledCard,
            { backgroundColor: isDark ? '#18181b' : '#f6f6f6', opacity: 0.5 },
          ]}>
          <View style={styles.languageHeader}>
            <View>
              <Text style={[styles.languageName, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
                JavaScript
              </Text>
              <Text style={[styles.languageDescription, { color: isDark ? '#a1a1aa' : '#52525b' }]}>
                Coming Soon
              </Text>
            </View>
            <Text style={styles.languageIcon}>📜</Text>
          </View>
        </View>

        <View
          style={[
            styles.languageCard,
            styles.disabledCard,
            { backgroundColor: isDark ? '#18181b' : '#f6f6f6', opacity: 0.5 },
          ]}>
          <View style={styles.languageHeader}>
            <View>
              <Text style={[styles.languageName, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
                Java
              </Text>
              <Text style={[styles.languageDescription, { color: isDark ? '#a1a1aa' : '#52525b' }]}>
                Coming Soon
              </Text>
            </View>
            <Text style={styles.languageIcon}>☕</Text>
          </View>
        </View>
      </View>
    </ScrollView>
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
    marginBottom: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 18,
  },
  description: {
    fontSize: 16,
    marginBottom: 24,
    lineHeight: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  languageCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  disabledCard: {
    opacity: 0.6,
  },
  languageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  languageName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  languageDescription: {
    fontSize: 14,
  },
  languageIcon: {
    fontSize: 40,
  },
  loader: {
    marginVertical: 8,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});

