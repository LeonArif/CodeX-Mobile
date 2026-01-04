import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { executePythonCode, loadSkulpt } from '@/services/pythonRunner';
import { storage } from '@/utils/storage';

export interface TestCase {
  input: string;
  expectedOutput: string;
  description?: string;
}

interface PythonCodeCheckerProps {
  initialCode?: string;
  label?: string;
  height?: number;
  testcases: TestCase[];
  onSolved?: () => void;
  storageKey: string;
}

export default function PythonCodeChecker({
  initialCode = '',
  label = 'Python Code Editor',
  height = 200,
  testcases,
  onSolved,
  storageKey,
}: PythonCodeCheckerProps) {
  const { isDark } = useTheme();
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [testResults, setTestResults] = useState<{ passed: boolean; message: string }[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Load Skulpt for web platform
    if (Platform.OS === 'web') {
      loadSkulpt()
        .then(() => setIsReady(true))
        .catch((error) => {
          console.error('Failed to load Skulpt:', error);
          setOutput('Error: Failed to load Python runtime');
        });
    } else {
      setIsReady(true);
    }

    // Load saved code and solved status
    loadSavedData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  const loadSavedData = async () => {
    try {
      const savedCode = await storage.getItem(`code_${storageKey}`);
      const solvedStatus = await storage.getItem(`solved_${storageKey}`);
      
      if (savedCode) {
        setCode(savedCode);
      }
      
      if (solvedStatus === 'true') {
        setIsSolved(true);
      }
    } catch (error) {
      console.error('Error loading saved data:', error);
    }
  };

  const saveCode = async (newCode: string) => {
    try {
      await storage.setItem(`code_${storageKey}`, newCode);
    } catch (error) {
      console.error('Error saving code:', error);
    }
  };

  const handleCodeChange = (newCode: string) => {
    setCode(newCode);
    saveCode(newCode);
  };

  const normalizeOutput = (output: string): string => {
    return output.trim().replace(/\r\n/g, '\n');
  };

  const handleCheckCode = async () => {
    if (!code.trim()) {
      setOutput('Please enter some code to check.');
      return;
    }

    setIsChecking(true);
    setOutput('Checking code...');
    setTestResults([]);

    try {
      const results: { passed: boolean; message: string }[] = [];
      let allPassed = true;

      for (let i = 0; i < testcases.length; i++) {
        const testCase = testcases[i];
        
        // For code that needs input, we'll prepend input simulation
        let modifiedCode = code;
        if (testCase.input) {
          // Simple input simulation by replacing input() calls with values
          const inputs = testCase.input.split('\n');
          
          // This is a simplified approach - in production, you'd want a more robust solution
          modifiedCode = `
_inputs = ${JSON.stringify(inputs)}
_input_index = 0

def input(prompt=''):
    global _input_index
    if _input_index < len(_inputs):
        value = _inputs[_input_index]
        _input_index += 1
        return value
    return ''

${code}
`;
        }

        const result = await executePythonCode(modifiedCode);
        
        if (result.error) {
          results.push({
            passed: false,
            message: `Test ${i + 1} failed: ${result.error}`,
          });
          allPassed = false;
        } else {
          const actualOutput = normalizeOutput(result.output);
          const expectedOutput = normalizeOutput(testCase.expectedOutput);
          
          if (actualOutput === expectedOutput) {
            results.push({
              passed: true,
              message: `Test ${i + 1} passed${testCase.description ? ': ' + testCase.description : ''}`,
            });
          } else {
            results.push({
              passed: false,
              message: `Test ${i + 1} failed${testCase.description ? ': ' + testCase.description : ''}\nExpected: ${expectedOutput}\nActual: ${actualOutput}`,
            });
            allPassed = false;
          }
        }
      }

      setTestResults(results);

      if (allPassed) {
        setIsSolved(true);
        await storage.setItem(`solved_${storageKey}`, 'true');
        setOutput('🎉 All tests passed! Great job!');
        if (onSolved) {
          onSolved();
        }
      } else {
        setOutput('Some tests failed. Please review and try again.');
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsChecking(false);
    }
  };

  const handleClear = () => {
    setCode(initialCode);
    setOutput('');
    setTestResults([]);
    saveCode(initialCode);
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
            {label}
          </Text>
          {isSolved && (
            <Text style={styles.solvedBadge}>✓ Solved</Text>
          )}
        </View>
      )}

      {/* Code Editor */}
      <View
        style={[
          styles.editorContainer,
          { backgroundColor: isDark ? '#23232799' : '#e1e1e7ff' },
        ]}>
        <TextInput
          style={[
            styles.codeInput,
            { 
              color: isDark ? '#f6f6f6' : '#18181b',
              height: height,
            },
          ]}
          value={code}
          onChangeText={handleCodeChange}
          multiline
          editable={!isChecking}
          placeholder="# Write your Python code here..."
          placeholderTextColor={isDark ? '#71717a' : '#a1a1aa'}
          textAlignVertical="top"
        />
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            styles.checkButton,
            { backgroundColor: isReady ? '#3b82f6' : '#6b7280' },
            (isChecking || !isReady) && styles.buttonDisabled,
          ]}
          onPress={handleCheckCode}
          disabled={isChecking || !isReady}>
          {isChecking ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isReady ? 'Check Code' : 'Loading...'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.clearButton,
            { backgroundColor: isDark ? '#3f3f46' : '#d4d4d8' },
          ]}
          onPress={handleClear}
          disabled={isChecking}>
          <Text style={[styles.buttonText, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
            Reset
          </Text>
        </TouchableOpacity>
      </View>

      {/* Test Results */}
      {testResults.length > 0 && (
        <View style={styles.resultsContainer}>
          <Text style={[styles.resultsLabel, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
            Test Results:
          </Text>
          {testResults.map((result, index) => (
            <View
              key={index}
              style={[
                styles.resultItem,
                {
                  backgroundColor: result.passed
                    ? isDark ? '#065f46' : '#d1fae5'
                    : isDark ? '#7f1d1d' : '#fee2e2',
                },
              ]}>
              <Text
                style={[
                  styles.resultText,
                  { color: result.passed ? (isDark ? '#d1fae5' : '#065f46') : (isDark ? '#fee2e2' : '#7f1d1d') },
                ]}>
                {result.passed ? '✓' : '✗'} {result.message}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Output Display */}
      {output && (
        <View style={styles.outputContainer}>
          <Text style={[styles.outputLabel, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
            Output:
          </Text>
          <ScrollView
            style={[
              styles.outputScroll,
              { backgroundColor: isDark ? '#18181b' : '#f6f6f6' },
            ]}>
            <Text
              style={[
                styles.outputText,
                { color: isDark ? '#d4d4d8' : '#3f3f46' },
              ]}>
              {output}
            </Text>
          </ScrollView>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  solvedBadge: {
    backgroundColor: '#10b981',
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  editorContainer: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  codeInput: {
    padding: 12,
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
      web: 'monospace',
    }),
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  checkButton: {
    backgroundColor: '#3b82f6',
  },
  clearButton: {
    backgroundColor: '#6b7280',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  resultsContainer: {
    marginTop: 16,
  },
  resultsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  resultItem: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  resultText: {
    fontSize: 13,
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
      web: 'monospace',
    }),
  },
  outputContainer: {
    marginTop: 16,
  },
  outputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  outputScroll: {
    maxHeight: 150,
    borderRadius: 8,
    padding: 12,
  },
  outputText: {
    fontFamily: Platform.select({
      ios: 'Menlo',
      android: 'monospace',
      default: 'monospace',
      web: 'monospace',
    }),
    fontSize: 13,
    lineHeight: 20,
  },
});
