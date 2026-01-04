import { Stack } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';

export default function PythonLayout() {
  const { isDark } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: isDark ? '#18181b' : '#fff',
        },
        headerTintColor: isDark ? '#f6f6f6' : '#18181b',
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'Python Introduction',
        }}
      />
      <Stack.Screen
        name="if-else"
        options={{
          title: 'Python If-Else',
        }}
      />
      <Stack.Screen
        name="loops"
        options={{
          title: 'Python Loops',
        }}
      />
      <Stack.Screen
        name="arrays"
        options={{
          title: 'Python Arrays',
        }}
      />
      <Stack.Screen
        name="functions"
        options={{
          title: 'Python Functions',
        }}
      />
      <Stack.Screen
        name="exercise"
        options={{
          title: 'Python Exercises',
        }}
      />
    </Stack>
  );
}
