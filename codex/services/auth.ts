import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

WebBrowser.maybeCompleteAuthSession();

const BACKEND_URL = 'https://code-x-pawm-s49d.vercel.app';

export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

// Create redirect URI based on platform
export const getRedirectUri = () => {
  if (Platform.OS === 'web') {
    return `${window.location.origin}/auth/callback`;
  }
  
  // For mobile, use Expo's redirect URI
  return AuthSession.makeRedirectUri({
    scheme: 'codex',
    path: 'auth/callback',
  });
};

export const initiateGoogleLogin = async () => {
  const redirectUri = getRedirectUri();
  
  console.log('Redirect URI:', redirectUri);
  
  // Build Google OAuth URL with backend
  const authUrl = `${BACKEND_URL}/auth/google?redirect_uri=${encodeURIComponent(redirectUri)}`;
  
  // Open browser for authentication
  const result = await WebBrowser.openAuthSessionAsync(
    authUrl,
    redirectUri
  );
  
  if (result.type === 'success' && result.url) {
    // Extract token from callback URL
    const url = new URL(result.url);
    const token = url.searchParams.get('token');
    
    if (token) {
      await saveToken(token);
      return { success: true, token };
    }
  }
  
  return { success: false, error: 'Authentication failed' };
};

export const saveToken = async (token: string) => {
  try {
    await AsyncStorage.setItem('jwt', token);
    const userData = jwtDecode<User>(token);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    return userData;
  } catch (error) {
    console.error('Error saving token:', error);
    throw error;
  }
};

export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('jwt');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

export const getUser = async (): Promise<User | null> => {
  try {
    const userStr = await AsyncStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error getting user:', error);
    return null;
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('jwt');
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Error during logout:', error);
    throw error;
  }
};
