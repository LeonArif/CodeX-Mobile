import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { saveToken } from '@/services/auth';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallbackScreen() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      if (token) {
        try {
          await saveToken(token as string);
          await checkAuth();
          // Navigate to home after successful login
          router.replace('/(tabs)');
        } catch (error) {
          console.error('Error handling auth callback:', error);
          router.replace('/(auth)/login');
        }
      } else {
        // No token, redirect to login
        router.replace('/(auth)/login');
      }
    };

    handleCallback();
  }, [token, checkAuth]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4285F4" />
      <Text style={styles.text}>Completing login...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 16,
    color: '#fff',
    fontSize: 16,
  },
});
