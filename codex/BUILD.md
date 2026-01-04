# Building CodeX Mobile App

## Prerequisites

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Configure project:
```bash
cd codex
eas build:configure
```

## Build for Android (APK)

### Development Build
```bash
eas build --platform android --profile development
```

### Production APK
```bash
eas build --platform android --profile production
```

The APK will be available in your Expo dashboard after build completes.

### Production AAB (for Play Store)
```bash
eas build --platform android --profile production-store
```

AAB (Android App Bundle) is the preferred format for Google Play Store submission as it provides better optimization and smaller download sizes.

## Build for iOS (IPA)

### Production Build
```bash
eas build --platform ios --profile production
```

Note: iOS builds require an Apple Developer account.

## Local Android Build

If you prefer local build:

1. Install Android Studio
2. Setup Android SDK
3. Run:
```bash
npx expo run:android --variant release
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

## Testing APK

1. Download APK from EAS dashboard or local build
2. Transfer to Android device
3. Enable "Install from Unknown Sources" in Settings
4. Install and test

## Important Configuration

Before building, ensure:
- [ ] `app.json` has correct bundle IDs
- [ ] Google OAuth redirect URIs include production URLs
- [ ] Backend CORS allows production domains
- [ ] All assets (icons, splash) are present
- [ ] iOS deployment target is set to 15.1 or higher

## Build Scripts

The following npm scripts are available:

```bash
# Build Android APK
npm run build:android

# Build iOS IPA
npm run build:ios

# Build both platforms
npm run build:all
```

## Troubleshooting

### Common Build Issues

**1. "expo-build-properties plugin not found"**
- Run `npm install` to ensure all dependencies are installed

**2. "Bundle identifier already exists"**
- Update `package` in `app.json` to use your own identifier

**3. "Build failed with Gradle error"**
- Check Android SDK version compatibility
- Ensure compileSdkVersion and targetSdkVersion are correct

**4. "EAS project not configured"**
- Run `eas build:configure` to set up project
- Update `projectId` in `app.json` after configuration

### Getting Build Logs

```bash
# View build logs
eas build:list

# View specific build
eas build:view [BUILD_ID]
```

## Deployment

### Android Play Store

1. Build signed APK or AAB:
```bash
eas build --platform android --profile production
```

2. Download the build from EAS dashboard
3. Upload to Google Play Console
4. Follow Play Store submission guidelines

### iOS App Store

1. Build IPA:
```bash
eas build --platform ios --profile production
```

2. Use EAS Submit or manually upload to App Store Connect:
```bash
eas submit --platform ios
```

3. Complete App Store Connect submission

## Version Management

Update version before each build:

1. Update `version` in `app.json`
2. For Android: Increment `versionCode`
3. For iOS: Update `buildNumber`

## Additional Resources

- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Android App Signing](https://docs.expo.dev/app-signing/app-credentials/)
- [iOS Provisioning](https://docs.expo.dev/app-signing/app-credentials/)
