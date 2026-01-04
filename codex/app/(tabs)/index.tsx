import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Image,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getToken } from '@/services/auth';
import { getProgress, ProgressData } from '@/services/api';
import ModuleCard from '@/components/ModuleCard';

export default function HomeScreen() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();
  const [progress, setProgress] = useState<ProgressData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    loadProgress();
    
    // Fade-in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
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

  const languages = [
    {
      id: 'python',
      name: 'Python',
      description: 'Learn Python programming fundamentals',
      icon: '🐍',
      progress: calculatePythonProgress(),
      available: true,
    },
    {
      id: 'javascript',
      name: 'JavaScript',
      description: 'Coming Soon',
      icon: '📜',
      progress: 0,
      available: false,
    },
    {
      id: 'java',
      name: 'Java',
      description: 'Coming Soon',
      icon: '☕',
      progress: 0,
      available: false,
    },
  ];

  const filteredLanguages = languages.filter((lang) =>
    lang.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
      contentContainerStyle={styles.content}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        }}>
        {/* Header with Profile Button */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
              CodeX
            </Text>
            {user && (
              <Text style={[styles.subtitle, { color: isDark ? '#a1a1aa' : '#52525b' }]}>
                Hi, {user.name}!
              </Text>
            )}
          </View>
          {user?.picture && (
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/profile')}
              activeOpacity={0.7}>
              <Image
                source={{ uri: user.picture }}
                style={styles.profilePicture}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={[styles.heroTitle, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
            Learn to Code
          </Text>
          <Text style={[styles.heroSubtitle, { color: isDark ? '#a1a1aa' : '#52525b' }]}>
            Not sure where to begin?
          </Text>
        </View>

        {/* Search Bar */}
        <View style={[styles.searchContainer, { backgroundColor: isDark ? '#18181b' : '#f6f6f6' }]}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={[styles.searchInput, { color: isDark ? '#f6f6f6' : '#18181b' }]}
            placeholder="Search programming languages..."
            placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
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

          {isLoading ? (
            <ActivityIndicator size="large" style={styles.loader} />
          ) : (
            <>
              {filteredLanguages.map((lang) => (
                <ModuleCard
                  key={lang.id}
                  title={lang.name}
                  description={lang.description}
                  icon={lang.icon}
                  completed={lang.progress === 100}
                  locked={!lang.available}
                  progress={lang.progress}
                  onPress={() => lang.available && router.push(`/${lang.id}`)}
                />
              ))}
              {filteredLanguages.length === 0 && (
                <Text style={[styles.noResults, { color: isDark ? '#a1a1aa' : '#52525b' }]}>
                  No languages found matching &quot;{searchQuery}&quot;
                </Text>
              )}
            </>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: isDark ? '#71717a' : '#a1a1aa' }]}>
            © 2024 CodeX. All rights reserved.
          </Text>
          <Text style={[styles.footerSubtext, { color: isDark ? '#52525b' : '#d4d4d8' }]}>
            Learn. Code. Succeed.
          </Text>
        </View>
      </Animated.View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerLeft: {
    flex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  profilePicture: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  heroSection: {
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  clearIcon: {
    fontSize: 18,
    color: '#71717a',
    paddingHorizontal: 8,
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
  loader: {
    marginVertical: 20,
  },
  noResults: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 32,
  },
  footer: {
    marginTop: 32,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#27272a',
  },
  footerText: {
    fontSize: 14,
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
  },
});

