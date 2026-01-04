import React, { useState, useEffect, useRef } from 'react';
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
import { WebView } from 'react-native-webview';
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
  const [webViewSource, setWebViewSource] = useState<{ html: string; baseUrl: string } | null>(null);
  const webViewRef = useRef<WebView>(null);

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
      // For mobile, WebView will handle Skulpt loading
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
      if (Platform.OS === 'web') {
        // Use web-based Skulpt execution
        const result = await executePythonCode(code);
        
        if (result.error) {
          setOutput(`Error:\n${result.error}`);
        } else {
          setOutput(result.output || 'Code executed successfully (no output).');
        }
      } else {
        // Use WebView for mobile execution
        runInWebView(code);
      }
    } catch (error: any) {
      setOutput(`Error: ${error.message || 'Unknown error occurred'}`);
      setIsRunning(false);
    } finally {
      if (Platform.OS === 'web') {
        setIsRunning(false);
      }
    }
  };

  const runInWebView = (pythonCode: string) => {
    // Note: pythonCode is safely escaped via JSON.stringify to prevent XSS
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/skulpt@1.2.0/dist/skulpt-stdlib.js"></script>
      </head>
      <body>
        <script>
          (function() {
            let outputBuffer = '';
            
            Sk.configure({
              output: function(text) {
                outputBuffer += text;
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'output', text: outputBuffer }));
              },
              read: function(x) {
                if (Sk.builtinFiles && Sk.builtinFiles.files[x]) {
                  return Sk.builtinFiles.files[x];
                }
                throw "File not found: '" + x + "'";
              }
            });

            // Code is safely escaped via JSON.stringify
            const code = ${JSON.stringify(pythonCode)};
            
            Sk.misceval.asyncToPromise(function() {
              return Sk.importMainWithBody("<stdin>", false, code, true);
            }).then(function() {
              window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'done' }));
            }).catch(function(err) {
              window.ReactNativeWebView.postMessage(JSON.stringify({ 
                type: 'error', 
                message: err.toString() 
              }));
            });
          })();
        </script>
      </body>
      </html>
    `;

    // Use reloadWithSource to safely load HTML content
    if (webViewRef.current) {
      setWebViewSource({ html, baseUrl: 'about:blank' });
    }
  };

  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'output') {
        setOutput(data.text);
      } else if (data.type === 'done') {
        setIsRunning(false);
      } else if (data.type === 'error') {
        setOutput(prev => prev + '\nError: ' + data.message);
        setIsRunning(false);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
      setOutput('Error: Failed to process Python output');
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

      {/* Hidden WebView for Python execution on mobile */}
      {Platform.OS !== 'web' && (
        <WebView
          ref={webViewRef}
          style={{ height: 0, width: 0, opacity: 0 }}
          onMessage={handleWebViewMessage}
          originWhitelist={['*']}
          javaScriptEnabled={true}
          source={webViewSource || { html: '<html><body></body></html>' }}
        />
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
