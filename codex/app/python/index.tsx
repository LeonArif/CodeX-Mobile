import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, NativeScrollEvent } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { storage } from '@/utils/storage';
import { updateProgress } from '@/services/api';
import PythonRunner from '@/components/code-runner/PythonRunner';

export default function PythonIntroScreen() {
  const { isDark } = useTheme();
  const hasTrackedProgress = useRef(false);

  const handleScroll = async (event: NativeScrollEvent) => {
    const { layoutMeasurement, contentOffset, contentSize } = event;
    const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isBottom && !hasTrackedProgress.current) {
      hasTrackedProgress.current = true;
      try {
        const token = await storage.getItem('authToken');
        if (token) {
          await updateProgress(token, { python: true });
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
      {/* Title */}
      <Text style={[styles.title, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Introduction to Python
      </Text>

      {/* Introduction */}
      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        Python is a high-level, interpreted programming language known for its simplicity and
        readability. It&apos;s an excellent language for beginners and is widely used in various
        domains including web development, data science, artificial intelligence, and more.
      </Text>

      {/* Section: Hello World */}
      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Your First Python Program
      </Text>
      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        Let&apos;s start with the classic &ldquo;Hello, World!&rdquo; program. In Python, you can print text to
        the console using the print() function.
      </Text>

      <PythonRunner
        initialCode={`print("Hello, World!")
print("Welcome to CodeX!")`}
        label="Example: Hello World"
      />

      {/* Section: Variables */}
      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Variables and Data Types
      </Text>
      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        Variables are containers for storing data values. In Python, you don&apos;t need to declare
        the type of a variable explicitly. Python automatically determines the type based on the
        value assigned.
      </Text>

      <PythonRunner
        initialCode={`# Integer
age = 25
print("Age:", age)

# Float
height = 5.9
print("Height:", height)

# String
name = "John"
print("Name:", name)

# Boolean
is_student = True
print("Is student:", is_student)`}
        label="Example: Variables"
        height={250}
      />

      {/* Section: Basic Operations */}
      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Basic Operations
      </Text>
      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        Python supports various arithmetic operations like addition, subtraction, multiplication,
        division, and more.
      </Text>

      <PythonRunner
        initialCode={`# Arithmetic operations
a = 10
b = 3

print("Addition:", a + b)
print("Subtraction:", a - b)
print("Multiplication:", a * b)
print("Division:", a / b)
print("Integer Division:", a // b)
print("Modulus:", a % b)
print("Exponentiation:", a ** b)`}
        label="Example: Arithmetic Operations"
        height={250}
      />

      {/* Section: User Input */}
      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Comments
      </Text>
      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        Comments are used to explain code and make it more readable. In Python, comments start
        with the # symbol. Python ignores comments when executing the code.
      </Text>

      <PythonRunner
        initialCode={`# This is a single-line comment

# Variables
name = "Alice"  # inline comment
age = 30

print(name)  # Print the name
print(age)   # Print the age`}
        label="Example: Comments"
        height={200}
      />

      {/* Summary */}
      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Summary
      </Text>
      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        In this introduction, you learned:
        {'\n'}• How to print output using print()
        {'\n'}• How to create and use variables
        {'\n'}• Different data types (int, float, string, boolean)
        {'\n'}• Basic arithmetic operations
        {'\n'}• How to write comments
        {'\n\n'}Ready to learn more? Continue to the next topic to learn about if-else statements!
      </Text>

      <View style={{ height: 40 }} />
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 12,
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
});
