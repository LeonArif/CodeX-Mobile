import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, NativeScrollEvent } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getToken } from '@/services/auth';
import { updateProgress } from '@/services/api';
import PythonRunner from '@/components/code-runner/PythonRunner';

export default function PyLoopsScreen() {
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
          await updateProgress(token, { pyLoops: true });
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
        Loops in Python
      </Text>

      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        Loops allow you to execute a block of code repeatedly. Python has two types of loops:
        for loops and while loops.
      </Text>

      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        For Loop
      </Text>
      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        A for loop is used to iterate over a sequence (like a list, tuple, or range).
      </Text>

      <PythonRunner
        initialCode={`# Loop through a range
for i in range(5):
    print("Count:", i)

# Loop through a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)`}
        label="Example: For Loop"
        height={220}
      />

      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        While Loop
      </Text>
      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        A while loop executes as long as a condition is true.
      </Text>

      <PythonRunner
        initialCode={`count = 0
while count < 5:
    print("Count:", count)
    count = count + 1

print("Loop finished!")`}
        label="Example: While Loop"
        height={200}
      />

      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Break and Continue
      </Text>
      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        The break statement exits the loop, and continue skips to the next iteration.
      </Text>

      <PythonRunner
        initialCode={`# Break example
for i in range(10):
    if i == 5:
        break
    print(i)

print("---")

# Continue example
for i in range(5):
    if i == 2:
        continue
    print(i)`}
        label="Example: Break and Continue"
        height={250}
      />

      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Summary
      </Text>
      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        In this lesson, you learned:
        {'\n'}• How to use for loops to iterate over sequences
        {'\n'}• How to use while loops for conditional repetition
        {'\n'}• How to use break to exit loops
        {'\n'}• How to use continue to skip iterations
      </Text>

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
