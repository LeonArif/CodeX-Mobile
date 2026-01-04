import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, NativeScrollEvent } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getToken } from '@/services/auth';
import { updateProgress } from '@/services/api';
import PythonRunner from '@/components/code-runner/PythonRunner';
import NextModuleButton from '@/components/NextModuleButton';

export default function PyArraysScreen() {
  const { isDark } = useTheme();
  const hasTrackedProgress = useRef(false);

  const handleScroll = async (event: NativeScrollEvent) => {
    const { layoutMeasurement, contentOffset, contentSize } = event;
    const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isBottom && !hasTrackedProgress.current) {
      hasTrackedProgress.current = true;
      try {
        const token = await getToken();
        if (token) {
          await updateProgress(token, { pyArrays: true });
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
      contentContainerStyle={styles.content}
      onScroll={({ nativeEvent }) => handleScroll(nativeEvent)}
      scrollEventThrottle={400}>
      <Text style={[styles.title, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Lists (Arrays) in Python
      </Text>

      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        Lists are used to store multiple items in a single variable. They are ordered,
        changeable, and allow duplicate values.
      </Text>

      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Creating Lists
      </Text>

      <PythonRunner
        initialCode={`# Create a list
fruits = ["apple", "banana", "cherry"]
print(fruits)

# Access elements by index
print("First fruit:", fruits[0])
print("Last fruit:", fruits[-1])`}
        label="Example: Creating and Accessing Lists"
        height={200}
      />

      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Modifying Lists
      </Text>

      <PythonRunner
        initialCode={`numbers = [1, 2, 3, 4, 5]

# Add item
numbers.append(6)
print("After append:", numbers)

# Remove item
numbers.remove(3)
print("After remove:", numbers)

# Change item
numbers[0] = 10
print("After change:", numbers)`}
        label="Example: Modifying Lists"
        height={250}
      />

      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        List Operations
      </Text>

      <PythonRunner
        initialCode={`numbers = [1, 2, 3, 4, 5]

# Length
print("Length:", len(numbers))

# Sum
print("Sum:", sum(numbers))

# Max and Min
print("Max:", max(numbers))
print("Min:", min(numbers))

# Slicing
print("First 3:", numbers[0:3])
print("Last 2:", numbers[-2:])`}
        label="Example: List Operations"
        height={280}
      />

      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Summary
      </Text>
      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        In this lesson, you learned:
        {'\n'}• How to create and access lists
        {'\n'}• How to modify lists (append, remove, change)
        {'\n'}• Common list operations (len, sum, max, min)
        {'\n'}• How to use list slicing
      </Text>

      <NextModuleButton
        nextModule="/python/functions"
        nextModuleTitle="Functions"
      />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 16 },
  heading: { fontSize: 22, fontWeight: '600', marginTop: 24, marginBottom: 12 },
  text: { fontSize: 16, lineHeight: 24, marginBottom: 16 },
});
