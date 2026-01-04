import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, NativeScrollEvent } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getToken } from '@/services/auth';
import { updateProgress } from '@/services/api';
import PythonRunner from '@/components/code-runner/PythonRunner';

export default function PyFunctionsScreen() {
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
          await updateProgress(token, { pyFunctions: true });
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
        Functions in Python
      </Text>

      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        Functions are reusable blocks of code that perform a specific task. They help organize
        code and avoid repetition.
      </Text>

      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Defining Functions
      </Text>

      <PythonRunner
        initialCode={`# Define a function
def greet():
    print("Hello!")
    print("Welcome to Python")

# Call the function
greet()
greet()`}
        label="Example: Basic Function"
        height={200}
      />

      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Functions with Parameters
      </Text>

      <PythonRunner
        initialCode={`def greet_person(name):
    print("Hello, " + name + "!")

greet_person("Alice")
greet_person("Bob")

# Multiple parameters
def add_numbers(a, b):
    result = a + b
    print(result)

add_numbers(5, 3)
add_numbers(10, 20)`}
        label="Example: Functions with Parameters"
        height={250}
      />

      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Return Values
      </Text>

      <PythonRunner
        initialCode={`def multiply(a, b):
    return a * b

result = multiply(4, 5)
print("Result:", result)

# Function with multiple returns
def calculate(a, b):
    sum_val = a + b
    diff = a - b
    return sum_val, diff

s, d = calculate(10, 3)
print("Sum:", s)
print("Difference:", d)`}
        label="Example: Return Values"
        height={280}
      />

      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Default Parameters
      </Text>

      <PythonRunner
        initialCode={`def greet(name, greeting="Hello"):
    print(greeting + ", " + name + "!")

greet("Alice")
greet("Bob", "Hi")
greet("Charlie", "Good morning")`}
        label="Example: Default Parameters"
        height={200}
      />

      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Summary
      </Text>
      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        In this lesson, you learned:
        {'\n'}• How to define and call functions
        {'\n'}• How to use parameters in functions
        {'\n'}• How to return values from functions
        {'\n'}• How to use default parameters
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
