import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  StyleSheet,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { getGoogleAuthUrl } from '@/services/api';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const { login } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (Platform.OS === 'web') {
        // For web, use window redirect
        window.location.href = getGoogleAuthUrl();
      } else {
        // For mobile, use WebBrowser
        const result = await WebBrowser.openAuthSessionAsync(
          getGoogleAuthUrl(),
          'codex://auth/callback'
        );

        if (result.type === 'success' && result.url) {
          // Parse the callback URL to get the token
          const url = new URL(result.url);
          const token = url.searchParams.get('token');

          if (token) {
            await login(token);
            router.replace('/(tabs)');
          } else {
            setError('Authentication failed. No token received.');
          }
        } else if (result.type === 'cancel') {
          setError('Authentication was cancelled.');
        }
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    // For web, check if we're coming back from OAuth callback
    if (Platform.OS === 'web') {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (token) {
        login(token).then(() => {
          // Clean up URL
          window.history.replaceState({}, document.title, window.location.pathname);
          router.replace('/(tabs)');
        });
      }
    }
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#000' : '#fff' },
      ]}
      className={isDark ? 'bg-dark-bg' : 'bg-light-bg'}>
      <View style={styles.content}>
        {/* Logo/Title */}
        <View style={styles.header}>
          <Text
            style={[
              styles.title,
              { color: isDark ? '#f6f6f6' : '#18181b' },
            ]}
            className={isDark ? 'text-dark-text' : 'text-light-text'}>
            CodeX
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: isDark ? '#a1a1aa' : '#52525b' },
            ]}>
            Virtual Lab for Learning Programming
          </Text>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: isDark ? '#2563eb' : '#3b82f6' },
            isLoading && styles.buttonDisabled,
          ]}
          onPress={handleGoogleLogin}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Sign in with Google</Text>
          )}
        </TouchableOpacity>

        {/* Error Message */}
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {/* Info Text */}
        <Text
          style={[
            styles.infoText,
            { color: isDark ? '#71717a' : '#71717a' },
          ]}>
          Sign in to access Python tutorials and track your progress
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 60,
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
  },
});
