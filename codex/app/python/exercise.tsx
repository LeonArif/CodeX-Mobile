import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { storage } from '@/utils/storage';
import { updateProgress } from '@/services/api';
import PythonCodeChecker, { TestCase } from '@/components/code-runner/PythonCodeChecker';

export default function PyExerciseScreen() {
  const { isDark } = useTheme();
  const [solvedCount, setSolvedCount] = useState(0);
  const totalExercises = 4;

  useEffect(() => {
    checkSolvedStatus();
  }, []);

  const checkSolvedStatus = async () => {
    let count = 0;
    for (let i = 1; i <= totalExercises; i++) {
      const solved = await storage.getItem(`solved_exercise_${i}`);
      if (solved === 'true') count++;
    }
    setSolvedCount(count);
  };

  const handleExerciseSolved = async () => {
    await checkSolvedStatus();
    
    // Check if all exercises are solved
    let allSolved = true;
    for (let i = 1; i <= totalExercises; i++) {
      const solved = await storage.getItem(`solved_exercise_${i}`);
      if (solved !== 'true') {
        allSolved = false;
        break;
      }
    }

    if (allSolved) {
      try {
        const token = await storage.getItem('authToken');
        if (token) {
          await updateProgress(token, { pyExercise: true });
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }
  };

  // Exercise 1: Sum of two numbers
  const exercise1Tests: TestCase[] = [
    { input: '', expectedOutput: '15', description: 'Sum of 5 and 10' },
  ];

  // Exercise 2: Even or Odd
  const exercise2Tests: TestCase[] = [
    { input: '', expectedOutput: 'Even', description: 'Check if 4 is even' },
  ];

  // Exercise 3: Sum of list
  const exercise3Tests: TestCase[] = [
    { input: '', expectedOutput: '15', description: 'Sum of [1, 2, 3, 4, 5]' },
  ];

  // Exercise 4: Function to multiply
  const exercise4Tests: TestCase[] = [
    { input: '', expectedOutput: '20', description: 'Multiply 4 and 5' },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}
      contentContainerStyle={styles.content}>
      <Text style={[styles.title, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
        Python Exercises
      </Text>

      <Text style={[styles.text, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
        Test your Python knowledge with these exercises. Write code that passes all test cases.
      </Text>

      {/* Progress */}
      <View
        style={[
          styles.progressCard,
          { backgroundColor: isDark ? '#18181b' : '#f6f6f6' },
        ]}>
        <Text style={[styles.progressText, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
          Progress: {solvedCount} / {totalExercises} completed
        </Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(solvedCount / totalExercises) * 100}%`,
                backgroundColor: '#10b981',
              },
            ]}
          />
        </View>
      </View>

      {/* Exercise 1 */}
      <View style={styles.exerciseContainer}>
        <Text style={[styles.exerciseTitle, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
          Exercise 1: Sum of Two Numbers
        </Text>
        <Text style={[styles.exerciseDescription, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
          Write code that calculates and prints the sum of 5 and 10.
        </Text>

        <PythonCodeChecker
          initialCode={`# Write your code here
# Calculate sum of 5 and 10
# Print the result
`}
          label="Your Solution"
          testcases={exercise1Tests}
          storageKey="exercise_1"
          onSolved={handleExerciseSolved}
          height={150}
        />
      </View>

      {/* Exercise 2 */}
      <View style={styles.exerciseContainer}>
        <Text style={[styles.exerciseTitle, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
          Exercise 2: Even or Odd
        </Text>
        <Text style={[styles.exerciseDescription, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
          Write code that checks if the number 4 is even or odd. Print "Even" if it's even,
          otherwise print "Odd".
        </Text>

        <PythonCodeChecker
          initialCode={`# Write your code here
# Check if 4 is even or odd
# Print "Even" or "Odd"
`}
          label="Your Solution"
          testcases={exercise2Tests}
          storageKey="exercise_2"
          onSolved={handleExerciseSolved}
          height={150}
        />
      </View>

      {/* Exercise 3 */}
      <View style={styles.exerciseContainer}>
        <Text style={[styles.exerciseTitle, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
          Exercise 3: Sum of List
        </Text>
        <Text style={[styles.exerciseDescription, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
          Write code that calculates and prints the sum of all numbers in the list [1, 2, 3, 4, 5].
        </Text>

        <PythonCodeChecker
          initialCode={`# Write your code here
# Calculate sum of [1, 2, 3, 4, 5]
# Print the result
`}
          label="Your Solution"
          testcases={exercise3Tests}
          storageKey="exercise_3"
          onSolved={handleExerciseSolved}
          height={150}
        />
      </View>

      {/* Exercise 4 */}
      <View style={styles.exerciseContainer}>
        <Text style={[styles.exerciseTitle, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
          Exercise 4: Multiply Function
        </Text>
        <Text style={[styles.exerciseDescription, { color: isDark ? '#d4d4d8' : '#3f3f46' }]}>
          Write a function called multiply that takes two parameters and returns their product.
          Then call the function with 4 and 5, and print the result.
        </Text>

        <PythonCodeChecker
          initialCode={`# Write your function here
# Define multiply function
# Call it with 4 and 5
# Print the result
`}
          label="Your Solution"
          testcases={exercise4Tests}
          storageKey="exercise_4"
          onSolved={handleExerciseSolved}
          height={180}
        />
      </View>

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
  text: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  progressCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
  exerciseContainer: {
    marginBottom: 32,
  },
  exerciseTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  exerciseDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
});
