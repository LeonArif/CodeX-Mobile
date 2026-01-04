import { Platform } from 'react-native';

/**
 * Python code execution result
 */
export interface PythonExecutionResult {
  output: string;
  error: string | null;
}

/**
 * Execute Python code using Skulpt
 */
export async function executePythonCode(code: string): Promise<PythonExecutionResult> {
  return new Promise((resolve) => {
    let output = '';
    let error: string | null = null;

    try {
      // Check if Skulpt is available (should be loaded in HTML for web or WebView for mobile)
      if (typeof (window as any).Sk === 'undefined') {
        resolve({
          output: '',
          error: 'Python runtime not initialized. Please reload the app.',
        });
        return;
      }

      const Sk = (window as any).Sk;

      // Configure Skulpt
      Sk.configure({
        output: (text: string) => {
          output += text;
        },
        read: (filename: string) => {
          if (Sk.builtinFiles === undefined || Sk.builtinFiles.files[filename] === undefined) {
            throw new Error(`File not found: '${filename}'`);
          }
          return Sk.builtinFiles.files[filename];
        },
      });

      // Execute the code
      Sk.misceval
        .asyncToPromise(() => {
          return Sk.importMainWithBody('<stdin>', false, code, true);
        })
        .then(() => {
          resolve({ output, error: null });
        })
        .catch((err: any) => {
          error = err.toString();
          resolve({ output, error });
        });
    } catch (err: any) {
      error = err.toString();
      resolve({ output, error });
    }
  });
}

/**
 * Load Skulpt library dynamically for web
 */
export function loadSkulpt(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (Platform.OS !== 'web') {
      // For mobile, Skulpt should be loaded in WebView
      resolve();
      return;
    }

    // Check if already loaded
    if (typeof (window as any).Sk !== 'undefined') {
      resolve();
      return;
    }

    // Load Skulpt from CDN
    const script1 = document.createElement('script');
    script1.src = 'https://skulpt.org/js/skulpt.min.js';
    script1.onload = () => {
      const script2 = document.createElement('script');
      script2.src = 'https://skulpt.org/js/skulpt-stdlib.js';
      script2.onload = () => resolve();
      script2.onerror = () => reject(new Error('Failed to load Skulpt stdlib'));
      document.head.appendChild(script2);
    };
    script1.onerror = () => reject(new Error('Failed to load Skulpt'));
    document.head.appendChild(script1);
  });
}
