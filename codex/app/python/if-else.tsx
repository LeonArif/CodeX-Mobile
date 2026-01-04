import React, { useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, NativeScrollEvent } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { getToken } from '@/services/auth';
import { updateProgress } from '@/services/api';
import PythonRunner from '@/components/code-runner/PythonRunner';

export default function PyIfElseScreen() {
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
          await updateProgress(token, { pyIfElse: true });
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
        If-Else Statements
      </Text>

      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        Conditional statements allow you to execute different code blocks based on certain
        conditions. The if-else statement is the most basic form of conditional logic in Python.
      </Text>

      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Basic If Statement
      </Text>
      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        The if statement executes a block of code only if a specified condition is true.
      </Text>

      <PythonRunner
        initialCode={`age = 18

if age >= 18:
    print("You are an adult")
    print("You can vote")`}
        label="Example: If Statement"
      />

      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        If-Else Statement
      </Text>
      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        The else clause executes a block of code when the if condition is false.
      </Text>

      <PythonRunner
        initialCode={`temperature = 15

if temperature > 20:
    print("It's warm outside")
else:
    print("It's cold outside")
    print("Wear a jacket")`}
        label="Example: If-Else"
        height={200}
      />

      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        If-Elif-Else Statement
      </Text>
      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        The elif (else if) clause allows you to check multiple conditions. Python evaluates each
        condition in order and executes the first true block.
      </Text>

      <PythonRunner
        initialCode={`score = 75

if score >= 90:
    print("Grade: A")
elif score >= 80:
    print("Grade: B")
elif score >= 70:
    print("Grade: C")
elif score >= 60:
    print("Grade: D")
else:
    print("Grade: F")`}
        label="Example: If-Elif-Else"
        height={250}
      />

      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Comparison Operators
      </Text>
      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        Python supports various comparison operators: == (equal), != (not equal), {'>'} (greater
        than), {'<'} (less than), {'>='} (greater than or equal), {'<='} (less than or equal).
      </Text>

      <PythonRunner
        initialCode={`x = 10
y = 5

print("x == y:", x == y)
print("x != y:", x != y)
print("x > y:", x > y)
print("x < y:", x < y)
print("x >= y:", x >= y)
print("x <= y:", x <= y)`}
        label="Example: Comparison Operators"
        height={220}
      />

      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Logical Operators
      </Text>
      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        Logical operators (and, or, not) allow you to combine multiple conditions.
      </Text>

      <PythonRunner
        initialCode={`age = 25
has_license = True

# AND operator
if age >= 18 and has_license:
    print("You can drive")

# OR operator
is_weekend = True
is_holiday = False

if is_weekend or is_holiday:
    print("Time to relax!")

# NOT operator
is_raining = False

if not is_raining:
    print("Let's go for a walk")`}
        label="Example: Logical Operators"
        height={280}
      />

      <Text style={[styles.heading, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Summary
      </Text>
      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        In this lesson, you learned:
        {'\n'}• How to use if statements for conditional execution
        {'\n'}• How to use if-else for two-way decisions
        {'\n'}• How to use if-elif-else for multiple conditions
        {'\n'}• Comparison operators (==, !=, {'>'}, {'<'}, {'>='}, {'<='})
        {'\n'}• Logical operators (and, or, not)
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
