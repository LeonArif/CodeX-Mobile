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

interface PythonRunnerProps {
  initialCode?: string;
  label?: string;
  height?: number;
  readOnly?: boolean;
}

export default function PythonRunner({
  initialCode = '',
  label = 'Python Code Editor',
  height = 200,
  readOnly = false,
}: PythonRunnerProps) {
  const { isDark } = useTheme();
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
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
      // For mobile, we'll need to use a WebView with Skulpt
      // For now, mark as ready (will be implemented in WebView wrapper)
      setIsReady(true);
    }
  }, []);

  const handleRun = async () => {
    if (!code.trim()) {
      setOutput('Please enter some code to run.');
      return;
    }

    setIsRunning(true);
    setOutput('Running...');

    try {
      const result = await executePythonCode(code);
      
      if (result.error) {
        setOutput(`Error:\n${result.error}`);
      } else {
        setOutput(result.output || 'Code executed successfully (no output).');
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message || 'Unknown error occurred'}`);
    } finally {
      setIsRunning(false);
    }
  };

  const handleClear = () => {
    setCode(initialCode);
    setOutput('');
  };

  return (
    <View style={styles.container}>
      {/* Label */}
      {label && (
        <Text style={[styles.label, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
          {label}
        </Text>
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
          onChangeText={setCode}
          multiline
          editable={!readOnly && !isRunning}
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
            styles.runButton,
            { backgroundColor: isReady ? '#10b981' : '#6b7280' },
            (isRunning || !isReady) && styles.buttonDisabled,
          ]}
          onPress={handleRun}
          disabled={isRunning || !isReady}>
          {isRunning ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isReady ? 'Run Code' : 'Loading...'}
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
          disabled={isRunning}>
          <Text style={[styles.buttonText, { color: isDark ? '#f6f6f6' : '#18181b' }]}>
            Clear
          </Text>
        </TouchableOpacity>
      </View>

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
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
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
  runButton: {
    backgroundColor: '#10b981',
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
  outputContainer: {
    marginTop: 16,
  },
  outputLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  outputScroll: {
    maxHeight: 200,
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
