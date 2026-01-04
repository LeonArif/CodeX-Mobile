# CodeX - Universal Python Learning App

CodeX is a cross-platform mobile and web application for learning Python programming. Built with Expo and React Native, it provides an interactive virtual lab environment with tutorials, code execution, and progress tracking.

## Features

✨ **Core Features:**
- 🔐 Google OAuth Authentication
- 📚 Interactive Python Tutorials (Introduction, If-Else, Loops, Arrays, Functions, Exercises)
- 💻 Enhanced Python Code Runner with advanced controls:
  - 🔠 Font size controls (A-, A+)
  - 📋 Copy code to clipboard
  - ↺ Reset code button
  - 🗑️ Clear output button
  - Real-time code execution with Skulpt
- ✅ Code Checker with automated test cases
- 📊 Progress Tracking synchronized with backend
- 🌓 Dark Mode / Light Mode support with smooth animations
- 👤 User Profile with learning statistics dashboard
- 🔍 Search functionality for programming languages
- 📱 Responsive design for mobile and web
- 🎨 Modern UI with animations and transitions
- 📦 Production-ready APK/IPA builds

## Tech Stack

- **Framework:** Expo SDK 54 with React Native 0.81
- **Language:** TypeScript
- **Navigation:** Expo Router (file-based routing)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **Python Execution:** Skulpt (web) / WebView wrapper (mobile)
- **Backend API:** https://code-x-pawm-s49d.vercel.app
- **Storage:** AsyncStorage (mobile) / localStorage (web)

## Prerequisites

- Node.js 18+ and npm
- For iOS development: macOS with Xcode
- For Android development: Android Studio and Android SDK
- For web: Modern web browser

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/LeonArif/CodeX-Mobile.git
   cd CodeX-Mobile/codex
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npx expo start
   ```

## Running the App

### Web
```bash
npx expo start --web
```
Or press `w` in the Expo CLI after running `npx expo start`.

The app will open in your default browser at `http://localhost:8081`.

### Android
```bash
npx expo start --android
```
Or press `a` in the Expo CLI. Requires Android emulator or connected device with USB debugging enabled.

### iOS
```bash
npx expo start --ios
```
Or press `i` in the Expo CLI. Requires macOS with Xcode and iOS Simulator.

### Expo Go (Limited)
Scan the QR code with Expo Go app on your mobile device. Note: Some features may not work in Expo Go due to custom native code requirements.

## Project Structure

```
codex/
├── app/                          # File-based routing
│   ├── (auth)/                   # Authentication screens
│   │   ├── _layout.tsx          # Auth layout with redirect logic
│   │   └── login.tsx            # Google OAuth login
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── _layout.tsx          # Tab layout with auth guard
│   │   ├── index.tsx            # Home screen with search & animations
│   │   └── profile.tsx          # User profile with statistics
│   ├── python/                   # Python tutorial screens
│   │   ├── _layout.tsx          # Python stack layout
│   │   ├── index.tsx            # Python Introduction
│   │   ├── if-else.tsx          # If-Else tutorial
│   │   ├── loops.tsx            # Loops tutorial
│   │   ├── arrays.tsx           # Arrays tutorial
│   │   ├── functions.tsx        # Functions tutorial
│   │   └── exercise.tsx         # Practice exercises
│   └── _layout.tsx              # Root layout with providers
├── components/
│   ├── code-runner/
│   │   ├── PythonRunner.tsx     # Enhanced code editor & runner
│   │   └── PythonCodeChecker.tsx # Exercise validation
│   ├── ModuleCard.tsx           # Reusable module card component
│   ├── ProgressBar.tsx          # Progress visualization component
│   ├── CompleteButton.tsx       # Module completion button
│   ├── NextModuleButton.tsx     # Tutorial navigation button
│   └── ... (other UI components)
├── contexts/
│   ├── AuthContext.tsx          # Authentication state management
│   └── ThemeContext.tsx         # Theme (dark/light mode) state
├── services/
│   ├── api.ts                   # Backend API integration
│   ├── auth.ts                  # Authentication service
│   └── pythonRunner.ts          # Python execution service
├── utils/
│   └── storage.ts               # Cross-platform storage utility
└── constants/
    └── theme.ts                 # Enhanced theme colors, fonts & global styles
```

## API Endpoints

Base URL: `https://code-x-pawm-s49d.vercel.app`

- **GET /auth/google** - Initiate Google OAuth flow
- **GET /auth/google/callback** - OAuth callback (returns JWT token)
- **GET /api/progress** - Get user's learning progress
  - Headers: `Authorization: Bearer <token>`
- **POST /api/progress** - Update user's progress
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ modules: { python: true, pyIfElse: true, ... } }`

## Features Guide

### Authentication
- Sign in with Google OAuth
- JWT token stored securely (AsyncStorage for mobile, localStorage for web)
- Automatic token validation and expiry handling
- Protected routes with automatic redirect

### Python Tutorials
Each tutorial includes:
- Theory and explanations
- Interactive code examples
- Live code execution
- Progress tracking (auto-saved on scroll to bottom)

**Available Tutorials:**
1. **Introduction** - Variables, data types, basic operations
2. **If-Else** - Conditional statements, comparison & logical operators
3. **Loops** - For loops, while loops, break & continue
4. **Arrays** - Lists, indexing, operations, slicing
5. **Functions** - Function definition, parameters, return values

### Code Runner
- **PythonRunner Component:**
  - Multi-line code editor with monospace font
  - Adjustable font size (10-24px)
  - Run button to execute code
  - Copy code to clipboard
  - Reset code to initial state
  - Clear output button
  - Output display showing results or errors
  - Dark/Light theme support
  - Mobile-optimized keyboard

- **PythonCodeChecker Component:**
  - Exercise-based code validation
  - Automated test cases
  - Visual feedback (pass/fail per test)
  - Code persistence (auto-saved to storage)
  - Solved status tracking

### UI/UX Enhancements
- **Home Screen:**
  - Animated hero section with fade-in effects
  - Search bar for filtering programming languages
  - Profile picture navigation button
  - Module cards with progress indicators
  - Footer with copyright information

- **Profile Screen:**
  - Statistics dashboard (completed/total/percentage)
  - Detailed course progress list with status dots
  - Larger profile avatar with blue border
  - Theme toggle with sun/moon icons
  - Smooth animations and transitions

- **Tutorial Navigation:**
  - Sequential learning path with "Continue to..." buttons
  - Module progression tracking
  - Smooth page transitions

### Progress Tracking
- Real-time synchronization with backend
- Visual progress bars on Home and Profile screens
- Module completion tracking
- Exercise solve status

### Theme Support
- Toggle between Light and Dark modes
- System theme detection
- Preference persistence
- Smooth theme transitions

## Development

### Adding New Tutorial
1. Create new screen in `app/python/your-topic.tsx`
2. Add route in `app/python/_layout.tsx`
3. Implement scroll-based progress tracking
4. Include PythonRunner components with examples

### Adding New Exercise
1. Define test cases in `app/python/exercise.tsx`
2. Create PythonCodeChecker component with unique storageKey
3. Implement onSolved callback for progress updates

### Styling Guidelines
- Use inline StyleSheet.create() for component styles
- Apply dynamic colors based on isDark theme state
- Use responsive units and flexbox for layouts
- Test on multiple screen sizes

## Troubleshooting

### Common Issues

**1. "Python runtime not initialized"**
- For web: Ensure Skulpt CDN loads correctly (check browser console)
- For mobile: Verify WebView configuration

**2. Authentication not working**
- Check backend API availability
- Verify OAuth redirect URIs are configured correctly
- Clear storage and try logging in again

**3. Code execution errors**
- Skulpt supports Python 2.7 syntax with some Python 3 features
- Not all Python libraries are available
- Input() function has limited support

**4. Progress not saving**
- Verify backend API is accessible
- Check network connectivity
- Ensure JWT token is valid

**5. Build errors**
- Run `npm install` to ensure all dependencies are installed
- Clear cache: `npx expo start -c`
- Check Node.js version (18+ recommended)

### Clearing Storage
```javascript
// In code or debug console
import { storage } from '@/utils/storage';
await storage.clear();
```

### Viewing Logs
- **Web:** Browser DevTools Console
- **Mobile:** Metro bundler terminal
- **Expo:** `npx expo start` output

## Building for Production

📚 **Documentation:**
- [QUICKSTART.md](./QUICKSTART.md) - Quick guide to building APK/IPA
- [BUILD.md](./BUILD.md) - Detailed build instructions and troubleshooting
- [TESTING.md](./TESTING.md) - Complete testing checklist

### Quick Build
```bash
# Android APK
npm run build:android

# iOS IPA
npm run build:ios

# Both platforms
npm run build:all
```

## Building for Production

### Web
```bash
npx expo export --platform web
```
Output in `dist/` directory. Deploy to any static hosting (Vercel, Netlify, etc.).

### Android APK
See [BUILD.md](./BUILD.md) for detailed instructions.

```bash
npm run build:android
# or
eas build --platform android --profile production
```

### iOS IPA
See [BUILD.md](./BUILD.md) for detailed instructions.

```bash
npm run build:ios
# or
eas build --platform ios --profile production
```

Requires Apple Developer account and macOS.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test on web and mobile platforms
5. Submit a pull request

## License

This project is part of the CodeX educational platform.

## Contact

For issues or questions, please open an issue on the GitHub repository.

---

Built with ❤️ using Expo and React Native
